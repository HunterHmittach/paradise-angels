import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasAccess = request.cookies.get("pa_access")?.value === "granted";

  // Allow API routes
  if (pathname.startsWith("/api")) {
    return NextResponse.next();
  }

  // Allow Next internal assets
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon.ico")
  ) {
    return NextResponse.next();
  }

  // Secret login URL
  if (pathname === "/Hunter0207") {
    const response = NextResponse.redirect(new URL("/", request.url));
    response.cookies.set("pa_access", "granted", {
      path: "/",
    });
    return response;
  }

  // If user has access cookie → allow all pages
  if (hasAccess) {
    return NextResponse.next();
  }

  // Otherwise show coming soon
  return NextResponse.rewrite(new URL("/coming-soon", request.url));
}

export const config = {
  matcher: "/((?!_next/static|_next/image|favicon.ico).*)",
};