import { SessionOptions } from "iron-session";

export interface SessionData {
  username: string;
  email: string;
  ethereumAddress: string;
  isLoggedIn: boolean;
  counter: number;
  userId?: string;
  createdAt?: number; // Timestamp when the session was created
}

export const defaultSession: SessionData = {
  username: "",
  email: "",
  ethereumAddress: "",
  isLoggedIn: false,
  counter: 0,
  createdAt: undefined,
};

// Session expiration times in milliseconds
export const EMAIL_SESSION_EXPIRATION_TIME = 10 * 60 * 1000; // 10 minutes
export const WEB3_SESSION_EXPIRATION_TIME = 24 * 60 * 60 * 1000; // 1 day

export const sessionOptions: SessionOptions = {
  password:
    process.env.SESSION_SECRET ||
    "complex_password_at_least_32_characters_long",
  cookieName: "np_myapp_session",
  cookieOptions: {
    // secure only works in `https` environments
    // if your localhost is not on `https`, then use: `secure: process.env.NODE_ENV === "production"`
    secure: process.env.NODE_ENV === "production",
    maxAge: WEB3_SESSION_EXPIRATION_TIME / 1000, // Using longest expiration time for cookie
  },
};
