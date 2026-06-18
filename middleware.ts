import { decodeJwt } from "jose";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PUBLIC_ROUTES = ["/login", "/sign-up"];

function isPublicRoute(pathname: string): boolean {
  return PUBLIC_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(route + "/"),
  );
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (isPublicRoute(pathname)) {
    return NextResponse.next();
  }

  const token = request.cookies.get("access_token")?.value;

  if (!token) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  let role: string = "User";
  try {
    const payload = decodeJwt(token);
    role = (payload.role as string) || "User";
  } catch {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const isAdmin = role === "Admin" || role === "SuperAdmin";

  if (pathname.startsWith("/meets/all") && !isAdmin) {
    return NextResponse.redirect(new URL("/meets/managed", request.url));
  }

  if (pathname.startsWith("/meets/managed") && role === "User") {
    return NextResponse.redirect(new URL("/meets/invitations", request.url));
  }

  if (pathname.startsWith("/users") && !isAdmin) {
    return NextResponse.redirect(new URL("/meets/managed", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next|static|favicon.ico|images|fonts).*)"],
};
