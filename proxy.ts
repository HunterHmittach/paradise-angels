import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasAccess = request.cookies.get("pa_access");

  // Allow API & static files
  if (
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon.ico")
  ) {
    return NextResponse.next();
  }

  // 🔐 Secret entry URL
  if (pathname === "/Hunter0207") {
    const response = NextResponse.redirect(new URL("/", request.url));
    response.cookies.set("pa_access", "granted", {
      httpOnly: false,
      path: "/",
    });
    return response;
  }

  // If cookie exists → allow access everywhere
  if (hasAccess) {
    return NextResponse.next();
  }

  // Everyone else → Coming Soon
  return NextResponse.rewrite(new URL("/coming-soon", request.url));
}

export const config = {
  matcher: "/((?!_next/static|_next/image|favicon.ico).*)",
};