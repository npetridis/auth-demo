// Read more: https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher

import { NextRequest, NextResponse } from "next/server";
import { getIronSession } from "iron-session";
import { SessionData, sessionOptions } from "./lib/session/session";
import { cookies } from "next/headers";

export async function middleware(request: NextRequest) {
  const session = await getIronSession<SessionData>(
    await cookies(),
    sessionOptions
  );

  if (!session.isLoggedIn) {
    if (request.nextUrl.pathname.startsWith("/dashboard")) {
      return Response.redirect(new URL("/sign-in", request.url), 302);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard"],
};
