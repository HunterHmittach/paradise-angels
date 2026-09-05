import { NextResponse } from "next/server";

export function proxy() {
  // The Paradise Angels website is now open to every visitor.
  return NextResponse.next();
}

export const config = {
  matcher: "/((?!_next/static|_next/image|favicon.ico).*)",
};
