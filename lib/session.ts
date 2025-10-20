import { SessionOptions } from "iron-session";

export interface SessionData {
  user?: {
    id: number;
    username: string;
  };
}

export const defaultSession: SessionData = {
  user: undefined,
};

export const sessionOptions: SessionOptions = {
  password: process.env.SESSION_SECRET!,
  cookieName: "litedrive_session",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production", // https에서만 쿠키 전달
  },
};
