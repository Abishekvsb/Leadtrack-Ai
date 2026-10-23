import { PrismaClient } from "@prisma/client";

// Normalize and map environment variables for PostgreSQL / Neon / Render
if (!process.env.DATABASE_URL) {
  const fallbackUrl =
    process.env.POSTGRES_URL ||
    process.env.POSTGRES_PRISMA_URL ||
    process.env.POSTGRESQL_URL ||
    process.env.NEON_DATABASE_URL ||
    process.env.DATABASE_POSTGRESQL_URL ||
    "";
  if (fallbackUrl) {
    process.env.DATABASE_URL = fallbackUrl;
  } else {
    // Prevent PrismaClient constructor crash when env var is missing
    process.env.DATABASE_URL = "postgresql://leadtrack:leadtrack@localhost:5432/leadtrack?sslmode=require";
  }
}

if (!process.env.DIRECT_URL) {
  process.env.DIRECT_URL =
    process.env.POSTGRES_URL_NON_POOLING ||
    process.env.POSTGRES_DIRECT_URL ||
    process.env.DATABASE_URL;
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
