"use server";

import {
  createPost,
  createUser,
  getUserByEmail,
  getUserByEthereumAddress,
} from "@/lib/db/queries";
import { auth } from "@/lib/session/auth";
import { comparePasswords, hashPassword } from "@/lib/utils";
import { redirect } from "next/navigation";
import { SiweMessage } from "siwe";
import { z } from "zod";

export type ActionState = { error?: string };

const signUpSchema = z.object({
  email: z
    .string()
    .email({ message: "Invalid email address." })
    .min(3, { message: "Email must be at least 3 characters long." })
    .max(255, { message: "Email must be at most 255 characters long." }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 8 characters long." })
    .max(100, { message: "Password must be at most 100 characters long." }),
  username: z
    .string()
    .min(3, { message: "Username must be at least 3 characters long." })
    .max(20, { message: "Username must be at most 20 characters long." }),
});

export async function signUp(prevState: ActionState, formData: FormData) {
  const parserResult = signUpSchema.safeParse(Object.fromEntries(formData));
  if (!parserResult.success) {
    return { error: parserResult.error.errors[0].message };
  }

  // If user already exists, return an error with generic message
  const existingUser = await getUserByEmail(parserResult.data.email);
  if (existingUser) {
    return {
      error:
        "An account with that email already exists. Please use a different email or log in if this is your account.",
    };
  }

  const passwordHash = await hashPassword(parserResult.data.password);
  const newUser = await createUser({
    email: parserResult.data.email,
    passwordHash: passwordHash,
    username: parserResult.data.username,
    age: 0,
  });

  // Create a welcome post for the new user
  await createPost({
    title: "My first Post",
    content: "Welcome to PostBook!",
    userId: newUser.id,
  });

  const session = await auth();

  session.isLoggedIn = true;
  session.email = newUser.email ?? "";
  session.username = newUser.username ?? "";
  session.counter = 0;
  session.userId = newUser.id;
  session.createdAt = Date.now();
  await session.save();

  const redirectTo = formData.get("redirect") as string | null;
  if (redirectTo === "posts") {
    redirect("/posts");
  }

  redirect("/");
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
    return { error: "Invalid credentials." };
  }

  // verify user password
  const isPasswordValid = await comparePasswords(
    parserResult.data.password,
    user.passwordHash
  );
  // if password is incorrect, return an error
  if (!isPasswordValid) {
    return { error: "Invalid credentials." };
  }

  const session = await auth();

  session.isLoggedIn = true;
  session.email = user.email ?? "";
  session.username = user.username ?? "";
  session.ethereumAddress = user.ethereumAddress ?? "";
  session.counter = 0;
  session.userId = user.id;
  session.createdAt = Date.now();
  await session.save();

  const redirectTo = formData.get("redirect") as string | null;
  if (redirectTo === "posts") {
    redirect("/posts");
  }

  redirect("/");
}

export async function signOut() {
  const session = await auth();

  session.destroy();

  redirect("/");
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

  // Parse the message body
  const siweMessage = new SiweMessage(JSON.parse(parserResult.data.message));

  // Add 1 day expiration to SIWE message if none exists
  if (!siweMessage.expirationTime) {
    const expirationTime = new Date();
    expirationTime.setDate(expirationTime.getDate() + 1); // 1 day expiration
    siweMessage.expirationTime = expirationTime.toISOString();
  }
  
  // Check if message has expired
  if (
    siweMessage.expirationTime &&
    new Date() > new Date(siweMessage.expirationTime)
  ) {
    return { error: "Authentication request has expired. Please try again." };
  }

  //  Verify the signature
  const fields = await siweMessage.verify({
    signature: parserResult.data.signature,
  });

  if (!fields.success) {
    return { error: "Signature not verified." };
  }

  // Check if user exists,
  // if not create a new user with the ethereum address
  const user = await getUserByEthereumAddress(siweMessage.address);
  let userId = user?.id;
  if (!user) {
    const newUser = await createUser({
      email: null,
      passwordHash: null,
      username: null,
      age: 0,
      ethereumAddress: siweMessage.address,
    });

    userId = newUser.id;

    // Create a welcome post for the new user
    await createPost({
      title: "My first Post",
      content: "Welcome to PostBook!",
      userId: userId!,
    });
  }

  // Save the user in the session
  const session = await auth();

  session.isLoggedIn = true;
  session.email = "";
  session.username = "";
  session.ethereumAddress = siweMessage.address;
  session.counter = 0;
  session.userId = userId;
  session.createdAt = Date.now();
  await session.save();

  const redirectTo = formData.get("redirect") as string | null;
  if (redirectTo === "posts") {
    redirect("/posts");
  }

  redirect("/");
}
