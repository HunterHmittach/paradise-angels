import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const ADMIN_PATH = "/0207"; // <-- jouw geheime pad

function unauthorized() {
  return new NextResponse("Auth required", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="Admin Preview"',
    },
  });
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Altijd toestaan (anders breekt Next/Stripe)
  if (
    pathname.startsWith("/coming-soon") ||
    pathname.startsWith("/_next") ||
    pathname === "/favicon.ico" ||
    pathname.startsWith("/api/stripe/webhook")
  ) {
    return NextResponse.next();
  }

  // Als ik al ingelogd bent (cookie) -> echte site
  const hasPreview = req.cookies.get("site_preview")?.value === "1";
  if (hasPreview) return NextResponse.next();

  // Alleen mijn geheime link vraagt login popup
  if (pathname === ADMIN_PATH) {
    const auth = req.headers.get("authorization");
    if (!auth?.startsWith("Basic ")) return unauthorized();

    const base64 = auth.split(" ")[1]!;
    const [user, pass] = Buffer.from(base64, "base64").toString().split(":");

    if (
      user !== process.env.BASIC_AUTH_USER ||
      pass !== process.env.BASIC_AUTH_PASS
    ) {
      return unauthorized();
    }

    // Login OK -> cookie zetten en door naar echte site
    const res = NextResponse.redirect(new URL("/", req.url));
    res.cookies.set("site_preview", "1", {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 30, // 30 dagen
    });
    return res;
  }

  // Iedereen anders -> Coming Soon
  const url = req.nextUrl.clone();
  url.pathname = "/coming-soon";
  return NextResponse.redirect(url);
}
