import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyPassword, signToken, setSessionCookie } from "@/lib/auth";
import { authLoginSchema } from "@/lib/validations";
import { checkRateLimit, getClientIp } from "@/lib/rateLimit";

export async function POST(req: NextRequest) {
  try {
    const clientIp = getClientIp(req);
    const rl = checkRateLimit("login", clientIp, 10, 60 * 1000);
    if (!rl.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Too many login attempts. Please wait a minute before trying again.",
          retryAfter: rl.retryAfterSeconds,
        },
        { status: 429, headers: { "Retry-After": String(rl.retryAfterSeconds || 60) } }
      );
    }

    const body = await req.json();
    const parsed = authLoginSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.errors[0]?.message || "Invalid input" },
        { status: 400 }
      );
    }

    const { email, password } = parsed.data;

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
      include: { institution: true },
    });

    if (!user || user.status !== "ACTIVE") {
      return NextResponse.json(
        { success: false, error: "Invalid email or password" },
        { status: 401 }
      );
    }

    const isValid = await verifyPassword(password, user.passwordHash);
    if (!isValid) {
      return NextResponse.json(
        { success: false, error: "Invalid email or password" },
        { status: 401 }
      );
    }

    const token = signToken({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role as any,
      institutionId: user.institutionId,
      institutionName: user.institution?.name,
      avatar: user.avatar,
    });

    setSessionCookie(token);

    // Audit log
    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: "LOGIN",
        entityType: "USER",
        entityId: user.id,
        details: JSON.stringify({ email: user.email, role: user.role }),
        ipAddress: req.headers.get("x-forwarded-for")?.split(",")[0].trim() || req.headers.get("x-real-ip") || "unknown",
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          avatar: user.avatar,
          institution: user.institution,
        },
      },
    });
  } catch (error: any) {
    console.error("Login API error:", error);
    return NextResponse.json({ success: false, error: error.message || "Internal server error" }, { status: 500 });
  }
}
