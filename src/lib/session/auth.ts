"use server";

import { getIronSession } from "iron-session";
import { SessionData, sessionOptions } from "./session";
import { cookies } from "next/headers";

export async function auth() {
  const session = await getIronSession<SessionData>(
    await cookies(),
    sessionOptions
  );

  return session;
}
