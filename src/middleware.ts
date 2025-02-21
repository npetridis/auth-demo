// import { withAuth } from "next-auth/middleware";

// export { auth as middleware } from "./auth";
// export { default } from "next-auth/middleware"

// Or like this if you need to do something here.
// export default auth((req) => {
//   console.log(req.auth) //  { session: { user: { ... } } }
// })

// Read more: https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher

// export default withAuth(
//   // withAuth takes a configuration object
//   {
//     pages: {
//       signIn: "/login", // Redirect here if user is not authenticated
//     },
//   }
// );

import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  console.log("Welcome");

  if (req.nextUrl.pathname.startsWith("/about")) {
    return NextResponse.rewrite(new URL("/about-2", req.url));
  }

  // if (req.nextUrl.pathname.startsWith("/dashboard")) {
  //   return NextResponse.rewrite(new URL("/dashboard/user", req.url));
  // }

  // 1. Retrieve the token using the same SECRET as in your NextAuth config
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  console.log("MID: token", token);

  // 2. If no token, redirect to the custom login page
  if (!token) {
    const loginUrl = new URL("/sign-in", req.url);
    // Optional: preserve the original URL so you can redirect back
    loginUrl.searchParams.set("callbackUrl", req.url);
    return NextResponse.redirect(loginUrl);
  }

  // 3. (Optional) If you want role-based logic, you can check token contents
  // e.g. if (!token?.role || token.role !== "admin") { ... }

  // 4. If token is valid, allow the request to go through
  return NextResponse.next();
}

// Specify the paths you want to protect
export const config = {
  matcher: [
    "/dashboard", // Protect /dashboard
    "/dashboard/:path*", // Protect /dashboard and any nested routes
    "/settings/:path*", // Protect /settings and any nested routes
  ],
};

// export const config = {
//   matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)", "/dashboard"],
// };
