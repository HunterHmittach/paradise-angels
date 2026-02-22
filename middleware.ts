import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip static files and Next internals
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // Unlock route
  if (pathname === "/0207") {
    const response = NextResponse.redirect(new URL("/", request.url));

    response.cookies.set("pa_unlocked", "true", {
      httpOnly: true,
      path: "/",
    });

    return response;
  }

  const unlocked = request.cookies.get("pa_unlocked");

  // If NOT unlocked → force coming-soon
  if (!unlocked && pathname !== "/coming-soon") {
    return NextResponse.redirect(
      new URL("/coming-soon", request.url)
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/:path*",
};
