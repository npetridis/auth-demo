import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { hash, compare } from "bcryptjs";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const SALT_ROUNDS = 10;

export async function hashPassword(password: string) {
  return await hash(password, SALT_ROUNDS);
}

export async function comparePasswords(
  plainTextPassword: string,
  hashedPassword: string
) {
  return compare(plainTextPassword, hashedPassword);
}
