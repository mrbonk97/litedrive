import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { getIronSession } from "iron-session";
import type { NextRequest } from "next/server";
import { SessionData, sessionOptions } from "@/lib/session";

export async function proxy(req: NextRequest) {
  const res = NextResponse.next();

  const cookie = await cookies();
  const session = await getIronSession<SessionData>(cookie, sessionOptions);

  // 보호해야 하는 경로
  const protectedPaths = ["/folders", "/profile"];
  const isProtected = protectedPaths.some((path) => req.nextUrl.pathname.startsWith(path));

  if (req.nextUrl.pathname == "/" && session.user) {
    const loginUrl = new URL("/folders", req.url);
    return NextResponse.redirect(loginUrl);
  }

  if (isProtected && !session.user) {
    const loginUrl = new URL("/sign-in", req.url);
    return NextResponse.redirect(loginUrl);
  }

  return res;
}

export const config = {
  matcher: ["/((?!_next|api|static|favicon.ico).*)"],
};
