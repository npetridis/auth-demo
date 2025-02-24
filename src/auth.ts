import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { SiweMessage } from "siwe";
import { comparePasswords } from "./lib/utils";
import { getUserByEmail } from "./lib/db/queries";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    CredentialsProvider({
      // You can specify which fields should be submitted, by adding keys to the `credentials` object.
      // e.g. domain, username, password, 2FA token, etc.
      name: "Credentials",
      credentials: {
        email: {},
        password: {},
      },
      authorize: async (credentials) => {
        console.log("!!!11 credentials", credentials);
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
    CredentialsProvider({
      // name: "Ethereum",
      credentials: {
        message: {},
        signature: {},
      },
      authorize: async (credentials) => {
        console.log("!!! authoraize", credentials);
        try {
          debugger;
          // 1. Parse the message body
          const siweMessage = new SiweMessage(
            JSON.parse((credentials?.message as string) || "{}")
          );

          console.log("siweMessage", siweMessage);

          // 2. Verify the signature
          const fields = await siweMessage.verify({
            signature: (credentials?.signature as string) || "",
          });

          // If verification fails, fields.success is false or an error is thrown
          if (!fields.success) {
            return null; // Return null to indicate an invalid sign-in
          }

          // 3. Check any additional conditions if needed, e.g. expiration, nonce, domain, etc.
          // if (siweMessage.expirationTime && new Date() > new Date(siweMessage.expirationTime)) {
          //   return null;
          // }

          // 4. If valid, return an object representing the "user"
          // The user object can have any shape; NextAuth saves it in the session token
          return {
            id: siweMessage.address, // e.g., store the wallet address as user.id
            address: siweMessage.address,
          };
        } catch (error) {
          console.error("SIWE verification error:", error);
          return null;
        }
      },
    }),
  ],
  debug: process.env.NODE_ENV === "development",
  secret: process.env.NEXTAUTH_SECRET,
  // callbacks: {
  //   // Example: Make the address or email available in the token/session
  //   async jwt({ token, user }) {
  //     if (user?.address) {
  //       token.address = user.address;
  //     }
  //     if (user?.email) {
  //       token.email = user.email;
  //     }
  //     return token;
  //   },
  //   async session({ session, token }) {
  //     if (token.address) {
  //       session.address = token.address;
  //     }
  //     if (token.email) {
  //       session.user = { ...session.user, email: token.email };
  //     }
  //     return session;
  //   },
  // },
});
