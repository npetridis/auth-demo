// Read more: https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher

import { NextRequest, NextResponse } from "next/server";
import { auth } from "./lib/session/auth";

export async function middleware(request: NextRequest) {
  const session = await auth();

  if (!session.isLoggedIn) {
    if (request.nextUrl.pathname.startsWith("/posts")) {
      return Response.redirect(
        new URL("/sign-in?redirect=posts", request.url),
        302
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/posts"],
};
