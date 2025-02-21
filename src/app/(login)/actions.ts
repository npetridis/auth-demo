"use server";

import { z } from "zod";
import { signIn as authSignIn } from "@/auth";
import { redirect } from "next/navigation";
import { createUser, getUserByEmail } from "@/lib/db/queries";
import { hashPassword } from "@/lib/utils";

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
  await createUser({
    email: parserResult.data.email,
    passwordHash: passwordHash,
    username: parserResult.data.username,
    age: 0,
  });

  try {
    await authSignIn("credentials", {
      email: parserResult.data.email,
      password: parserResult.data.password,
      redirect: false,
    });
  } catch {
    return { error: "Failed to create user. Please try again." };
  }

  redirect("/dashboard");
}

const signInSchema = signUpSchema.omit({ username: true });

export async function signIn(prevState: ActionState, formData: FormData) {
  const parserResult = signInSchema.safeParse(Object.fromEntries(formData));
  if (!parserResult.success) {
    return { error: parserResult.error.errors[0].message };
  }

  try {
    await authSignIn("credentials", {
      email: parserResult.data.email,
      password: parserResult.data.password,
      redirect: false,
    });
  } catch {
    return { error: "Invalid credentials" };
  }

  redirect("/dashboard");
}
