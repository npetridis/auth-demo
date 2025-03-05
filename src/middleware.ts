// Read more: https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher

import { NextRequest, NextResponse } from "next/server";
import {
  auth,
  isSessionExpired,
  refreshSessionIfNeeded,
} from "./lib/session/auth";

export async function middleware(request: NextRequest) {
  const session = await auth();

  // First check if user is logged in
  if (!session.isLoggedIn) {
    if (request.nextUrl.pathname.startsWith("/posts")) {
      return Response.redirect(
        new URL("/sign-in?redirect=posts", request.url),
        302
      );
    }
  } else {
    // If session is expired, try to refresh it
    if (await isSessionExpired(session)) {
      console.log("Session is expires, refreshing session");
      const refreshed = await refreshSessionIfNeeded(session);

      // If refresh failed, redirect to sign-in page
      if (!refreshed && request.nextUrl.pathname.startsWith("/posts")) {
        return Response.redirect(
          new URL("/sign-in?redirect=posts&expired=true", request.url),
          302
        );
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/posts"],
};
