import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get("leadtrack_session")?.value;

  const protectedPrefixes = [
    "/dashboard",
    "/leads",
    "/pipeline",
    "/follow-ups",
    "/team",
    "/settings",
    "/templates",
    "/automation",
    "/audit-logs",
    "/courses",
    "/notifications",
  ];

  const isProtectedRoute = protectedPrefixes.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );

  // If user is accessing a protected route without session cookie, redirect to /login
  if (isProtectedRoute && !token) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // If user is already logged in and visits login or register, redirect to /dashboard
  if ((pathname === "/login" || pathname === "/register") && token) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/leads/:path*",
    "/pipeline/:path*",
    "/follow-ups/:path*",
    "/team/:path*",
    "/settings/:path*",
    "/templates/:path*",
    "/automation/:path*",
    "/audit-logs/:path*",
    "/courses/:path*",
    "/notifications/:path*",
    "/login",
    "/register",
  ],
};
