import { cookies } from "next/headers";
import { getIronSession, SessionOptions } from "iron-session";
import { ErrorCode } from "./handle-error";

interface SessionData {
  user?: {
    id: string;
    username: string;
  };
}

const sessionOptions: SessionOptions = {
  password: process.env.SESSION_SECRET!,
  cookieName: "litedrive_session",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production", // https에서만 쿠키 전달
  },
};

export async function createSession(id: string, username: string) {
  const cookie = await cookies();
  const session = await getIronSession<SessionData>(cookie, sessionOptions);
  session.user = { id: id, username: username };
  await session.save();
}

export async function destroySession() {
  const cookie = await cookies();
  const session = await getIronSession<SessionData>(cookie, sessionOptions);

  // 세션이 있는지 검증
  const userId = session.user?.id;
  if (!userId) throw new Error(ErrorCode.USER_NOT_FOUND);

  session.destroy();
}

export async function getSession() {
  const cookie = await cookies();
  const session = await getIronSession<SessionData>(cookie, sessionOptions);

  // 세션이 있는지 검증
  const userId = session.user?.id;
  if (!userId) {
    throw new Error(ErrorCode.SESSION_NOT_FOUND);
  }

  return session;
}

export async function isLoggedIn() {
  const cookie = await cookies();
  const session = await getIronSession<SessionData>(cookie, sessionOptions);

  return !!session.user?.id;
}
