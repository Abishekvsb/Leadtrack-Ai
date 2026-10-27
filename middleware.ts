import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

function parseJwtPayload(token: string): { role?: string; exp?: number } | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), "=");
    const decoded = atob(padded);
    const bytes = Uint8Array.from(decoded, (c) => c.charCodeAt(0));
    const jsonStr = new TextDecoder().decode(bytes);
    return JSON.parse(jsonStr);
  } catch {
    return null;
  }
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get("leadtrack_session")?.value;

  const protectedPrefixes = [
    "/dashboard",
    "/leads",
    "/pipeline",
    "/follow-ups",
    "/analytics",
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

  if (token) {
    const session = parseJwtPayload(token);

    // If token is expired or corrupt on protected route, redirect to login
    if (isProtectedRoute && (!session || (session.exp && Date.now() >= session.exp * 1000))) {
      const loginUrl = new URL("/login", req.url);
      loginUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(loginUrl);
    }

    // If user is already logged in and visits login or register, redirect to /dashboard
    if (pathname === "/login" || pathname === "/register") {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    const role = session?.role;

    // Admin-only pages: /settings, /automation, /templates, /audit-logs, /courses
    const adminOnlyPrefixes = [
      "/settings",
      "/automation",
      "/templates",
      "/audit-logs",
      "/courses",
    ];

    const isAdminRoute = adminOnlyPrefixes.some(
      (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
    );

    if (isAdminRoute && role !== "ADMIN") {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    // Manager and Admin pages: /team
    const managerOrAdminPrefixes = ["/team"];

    const isManagerRoute = managerOrAdminPrefixes.some(
      (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
    );

    if (isManagerRoute && role !== "ADMIN" && role !== "MANAGER") {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/leads/:path*",
    "/pipeline/:path*",
    "/follow-ups/:path*",
    "/analytics/:path*",
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

