import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PUBLIC_PREFIXES = ["/login", "/favicon.ico", "/_next", "/api", "/images", "/assets"];

export function middleware(request: NextRequest) {
  const hasSession = request.cookies.get("wfk_session")?.value === "1";
  const url = request.nextUrl.clone();
  const { pathname } = url;

  if (!hasSession && pathname === "/") {
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }
  const isPublic = PUBLIC_PREFIXES.some((p) => pathname.startsWith(p));
  if (!hasSession && !isPublic) {
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }
  if (hasSession && pathname === "/") {
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/:path*"],
};


