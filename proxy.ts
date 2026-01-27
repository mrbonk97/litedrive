import { isLoggedIn } from "@/lib/session";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PROTECTED_ROUTES = ["/folders", "/profile"];
const AUTH_ROUTES = ["/sign-in", "/sign-up"];

export async function proxy(req: NextRequest) {
  const _isLoggedIn = await isLoggedIn();
  const pathname = req.nextUrl.pathname;

  // 로그인한 사용자가 sign-in / sign-up 접근하면 /folders로
  const isAuthRoute = AUTH_ROUTES.some((path) => pathname.startsWith(path));

  if (_isLoggedIn && isAuthRoute) {
    return NextResponse.redirect(new URL("/folders", req.url));
  }

  // 로그인한 사용자가 루트 접근 시 /folders로
  if (pathname === "/" && _isLoggedIn) {
    return NextResponse.redirect(new URL("/folders", req.url));
  }

  // 인증이 필요한 페이지인데 로그인 안 했으면 sign-in으로
  const isProtected = PROTECTED_ROUTES.some((path) =>
    pathname.startsWith(path)
  );

  if (isProtected && !_isLoggedIn) {
    return NextResponse.redirect(new URL("/sign-in", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|api|static|favicon.ico).*)"],
};
