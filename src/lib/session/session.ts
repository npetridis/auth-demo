import { SessionOptions } from "iron-session";

export interface SessionData {
  username: string;
  email: string;
  ethereumAddress: string;
  isLoggedIn: boolean;
  counter: number;
}

export const defaultSession: SessionData = {
  username: "",
  email: "",
  ethereumAddress: "",
  isLoggedIn: false,
  counter: 0,
};

export const sessionOptions: SessionOptions = {
  password:
    process.env.SESSION_SECRET ||
    "complex_password_at_least_32_characters_long",
  cookieName: "np_myapp_session",
  cookieOptions: {
    // secure only works in `https` environments
    // if your localhost is not on `https`, then use: `secure: process.env.NODE_ENV === "production"`
    secure: process.env.NODE_ENV === "production",
  },
};
