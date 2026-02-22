import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const MAINTENANCE = process.env.MAINTENANCE_MODE === "1";
const PREVIEW_KEY = process.env.PREVIEW_KEY;

export function middleware(req: NextRequest) {
  if (!MAINTENANCE) return NextResponse.next();

  const { pathname, searchParams } = req.nextUrl;

  // Altijd toestaan
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon") ||
    pathname.startsWith("/robots.txt") ||
    pathname.startsWith("/sitemap") ||
    pathname.startsWith("/coming-soon") ||
    pathname.startsWith("/api") // laat API's werken (Stripe webhooks etc.)
  ) {
    return NextResponse.next();
  }

  // Jij mag bypass'en via cookie
  const hasPreviewCookie = req.cookies.get("pa_preview")?.value === "1";
  if (hasPreviewCookie) return NextResponse.next();

  // Jij kan unlocken via ?key=...
  const key = searchParams.get("key");
  if (PREVIEW_KEY && key === PREVIEW_KEY) {
    const res = NextResponse.redirect(new URL("/", req.url));
    res.cookies.set("pa_preview", "1", {
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 dagen
      httpOnly: true,
      sameSite: "lax",
      secure: true,
    });
    return res;
  }

  // Iedereen anders → coming soon
  const url = req.nextUrl.clone();
  url.pathname = "/coming-soon";
  url.search = "";
  return NextResponse.rewrite(url);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image).*)"],
};
