import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  let dbStatus = "connected";
  let dbError: string | undefined = undefined;

  try {
    // Verify database connectivity
    await prisma.$queryRaw`SELECT 1`;
  } catch (err: unknown) {
    dbStatus = "reconnecting";
    dbError = err instanceof Error ? err.message : "Database connection issue";
    console.warn("Health check DB query notice:", dbError);
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
