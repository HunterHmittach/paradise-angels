import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

function unauthorized() {
  return new NextResponse("Auth required", {
    status: 401,
    headers: { "WWW-Authenticate": 'Basic realm="Protected"' },
  });
}

export function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;

  // Laat deze routes altijd door (handig voor assets / coming-soon)
  if (
    pathname.startsWith("/coming-soon") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon.ico") ||
    pathname.startsWith("/api/stripe/webhook") // webhook moet werken!
  ) {
    return NextResponse.next();
  }

  // Basic Auth check
  const auth = req.headers.get("authorization");
  if (!auth) return unauthorized();

  const [type, encoded] = auth.split(" ");
  if (type !== "Basic" || !encoded) return unauthorized();

  const decoded = Buffer.from(encoded, "base64").toString("utf8");
  const [user, pass] = decoded.split(":");

  const USER = process.env.SITE_USER;
  const PASS = process.env.SITE_PASS;

  if (!USER || !PASS) {
    // als env vars ontbreken, zet dan alles op coming soon
    return NextResponse.redirect(new URL("/coming-soon", req.url));
  }

  if (user === USER && pass === PASS) {
    return NextResponse.next(); // jij mag alles zien
  }

  return unauthorized();
}
