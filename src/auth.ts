import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { comparePasswords } from "./lib/utils";
import { getUserByEmail } from "./lib/db/queries";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      // You can specify which fields should be submitted, by adding keys to the `credentials` object.
      // e.g. domain, username, password, 2FA token, etc.
      credentials: {
        email: {},
        password: {},
      },
      authorize: async (credentials) => {
        const user = await getUserByEmail(credentials.email as string);

        if (!user) {
          return null;
        }

        // verify user password
        const isPasswordValid = await comparePasswords(
          credentials.password as string,
          user.passwordHash
        );

        if (!isPasswordValid) {
          // No user found, so this is their first attempt to login
          // Optionally, this is also the place you could do a user registration
          // throw new Error("Invalid credentials.");
          return null;
        }

        console.log("the user", user);

        // return user object with their profile data
        return {
          id: user.id.toString(),
          email: user.email,
          name: user.username,
        };
      },
    }),
  ],
  debug: process.env.NODE_ENV === "development",
  secret: process.env.NEXTAUTH_SECRET,
});
