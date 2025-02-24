"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import {
  createUser,
  getUserByEmail,
  getUserByEthereumAddress,
} from "@/lib/db/queries";
import { comparePasswords, hashPassword } from "@/lib/utils";
import { getIronSession } from "iron-session";
import { SessionData, sessionOptions } from "@/lib/session/session";
import { cookies } from "next/headers";
import { SiweMessage } from "siwe";

export type ActionState = { error?: string };

const signUpSchema = z.object({
  email: z
    .string()
    .email({ message: "Invalid email address" })
    .min(3, { message: "Email must be at least 3 characters long" })
    .max(255, { message: "Email must be at most 255 characters long" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 8 characters long" })
    .max(100, { message: "Password must be at most 100 characters long" }),
  username: z
    .string()
    .min(3, { message: "Username must be at least 3 characters long" })
    .max(20, { message: "Username must be at most 20 characters long" }),
});

export async function signUp(prevState: ActionState, formData: FormData) {
  const parserResult = signUpSchema.safeParse(Object.fromEntries(formData));
  if (!parserResult.success) {
    return { error: parserResult.error.errors[0].message };
  }

  // If user already exists, return an error with generic message
  const existingUser = await getUserByEmail(parserResult.data.email);
  if (existingUser) {
    return { error: "Failed to create user. Please try again." };
  }

  const passwordHash = await hashPassword(parserResult.data.password);
  const newUser = await createUser({
    email: parserResult.data.email,
    passwordHash: passwordHash,
    username: parserResult.data.username,
    age: 0,
  });

  const session = await getIronSession<SessionData>(
    await cookies(),
    sessionOptions
  );

  session.isLoggedIn = true;
  session.email = newUser.email ?? "";
  session.username = newUser.username ?? "";
  session.counter = 0;
  await session.save();

  redirect("/dashboard");
}

const signInSchema = signUpSchema.omit({ username: true });

export async function signIn(prevState: ActionState, formData: FormData) {
  const parserResult = signInSchema.safeParse(Object.fromEntries(formData));
  if (!parserResult.success) {
    return { error: parserResult.error.errors[0].message };
  }

  const user = await getUserByEmail(parserResult.data.email);
  // if user email doens't exist, return an error
  if (!user || !user.passwordHash) {
    return { error: "Invalid credentials" };
  }

  // verify user password
  const isPasswordValid = await comparePasswords(
    parserResult.data.password,
    user.passwordHash
  );
  // if password is incorrect, return an error
  if (!isPasswordValid) {
    return { error: "Invalid credentials" };
  }

  const session = await getIronSession<SessionData>(
    await cookies(),
    sessionOptions
  );

  session.isLoggedIn = true;
  session.email = user.email ?? "";
  session.username = user.username ?? "";
  session.ethereumAddress = user.ethereumAddress ?? "";
  session.counter = 0;
  await session.save();

  redirect("/dashboard");
}

export async function signOut() {
  const session = await getIronSession<SessionData>(
    await cookies(),
    sessionOptions
  );

  session.destroy();

  redirect("/sign-in");
}

const ethereumSignInSchema = z.object({
  message: z.string(),
  signature: z.string(),
});

export async function ethereumSignIn(
  prevState: ActionState,
  formData: FormData
) {
  const parserResult = ethereumSignInSchema.safeParse(
    Object.fromEntries(formData)
  );
  if (!parserResult.success) {
    return { error: parserResult.error.errors[0].message };
  }

  // 1. Parse the message body
  const siweMessage = new SiweMessage(JSON.parse(parserResult.data.message));

  if (
    siweMessage.expirationTime &&
    new Date() > new Date(siweMessage.expirationTime)
  ) {
    return null;
  }

  // 2. Verify the signature
  const fields = await siweMessage.verify({
    signature: parserResult.data.signature,
  });

  if (!fields.success) {
    return { error: "Signature not verified" };
  }

  // 3. Check if user exists, if not
  // create a new user with the ethereum address
  const user = await getUserByEthereumAddress(siweMessage.address);
  if (!user) {
    createUser({
      email: "",
      passwordHash: "",
      username: "",
      age: 0,
      ethereumAddress: siweMessage.address,
    });
  }

  // 4. Save the user in the session
  const session = await getIronSession<SessionData>(
    await cookies(),
    sessionOptions
  );

  session.isLoggedIn = true;
  session.email = "";
  session.username = "";
  session.ethereumAddress = siweMessage.address;
  session.counter = 0;
  await session.save();

  redirect("/dashboard");
}
