import { isLoggedIn } from "./lib/session";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PROTECTED_ROUTES = ["/folders", "/profile"];

export async function proxy(req: NextRequest) {
  const _isLoggedIn = await isLoggedIn();

  if (req.nextUrl.pathname == "/" && _isLoggedIn) {
    const loginUrl = new URL("/folders", req.url);
    return NextResponse.redirect(loginUrl);
  }

  const isProtected = PROTECTED_ROUTES.some((path) =>
    req.nextUrl.pathname.startsWith(path)
  );

  if (isProtected && !_isLoggedIn) {
    const loginUrl = new URL("/sign-in", req.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|api|static|favicon.ico).*)"],
};
