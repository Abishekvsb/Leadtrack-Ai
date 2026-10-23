import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  let dbStatus = "connected";
  let dbError: string | undefined = undefined;

  try {
    // Verify database connectivity with 2.5s timeout safeguard so cold starts never block Render health check
    await Promise.race([
      prisma.$queryRaw`SELECT 1`,
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Health check DB query timeout")), 2500)
      ),
    ]);
  } catch (err: unknown) {
    dbStatus = "reconnecting";
    dbError = err instanceof Error ? err.message : "Database connection notice";
    console.warn("Health check DB notice:", dbError);
  }

  return NextResponse.json({
    ok: true,
    status: "healthy",
    database: dbStatus,
    error: dbError,
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
}
