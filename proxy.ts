import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow API & static files
  if (
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon.ico")
  ) {
    return NextResponse.next();
  }

  // 🔐 Secret URL -> show real homepage
  if (pathname === "/Hunter0207") {
    return NextResponse.rewrite(new URL("/", request.url));
  }

  // Everyone else -> coming soon
  return NextResponse.rewrite(new URL("/coming-soon", request.url));
}

export const config = {
  matcher: "/((?!_next/static|_next/image|favicon.ico).*)",
};