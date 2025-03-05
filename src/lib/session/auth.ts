"use server";

import { getIronSession, IronSession } from "iron-session";
import {
  EMAIL_SESSION_EXPIRATION_TIME,
  WEB3_SESSION_EXPIRATION_TIME,
  SessionData,
  sessionOptions,
} from "./session";
import { cookies } from "next/headers";
import { getUserByEmail, getUserByEthereumAddress } from "../db/queries";

export async function auth() {
  const session = await getIronSession<SessionData>(
    await cookies(),
    sessionOptions
  );

  // When a session is created, set the createdAt timestamp
  if (session.isLoggedIn && !session.createdAt) {
    session.createdAt = Date.now();
    await session.save();
  }

  return session;
}

// Check if the session has expired
export async function isSessionExpired(session: SessionData): Promise<boolean> {
  if (!session.isLoggedIn || !session.createdAt) {
    return true;
  }

  const now = Date.now();

  // Use different expiration times based on login method
  if (session.ethereumAddress && session.ethereumAddress.length > 0) {
    // Web3 users get longer sessions
    return now - session.createdAt > WEB3_SESSION_EXPIRATION_TIME;
  } else {
    // Email users get shorter sessions
    return now - session.createdAt > EMAIL_SESSION_EXPIRATION_TIME;
  }
}

// Refresh the session if it's expired
export async function refreshSessionIfNeeded(
  session: IronSession<SessionData>
): Promise<boolean> {
  if (!isSessionExpired(session)) {
    return true; // Session is still valid
  }

  // If we have an Ethereum address, verify using SIWE
  if (session.ethereumAddress) {
    const user = await getUserByEthereumAddress(session.ethereumAddress);
    if (user) {
      // Since we can't automatically generate a new SIWE message and get signature,
      // we would need a client-side interaction to re-verify with wallet
      // For now, we'll just invalidate the session
      session.isLoggedIn = false;
      await session.save();
      return false;
    }
  }
  // For email+password users
  else if (session.email) {
    const user = await getUserByEmail(session.email);
    if (user) {
      // Refresh the session
      session.createdAt = Date.now();
      await session.save();
      return true;
    }
  }

  // If we can't refresh, invalidate the session
  await session.destroy();
  return false;
}
