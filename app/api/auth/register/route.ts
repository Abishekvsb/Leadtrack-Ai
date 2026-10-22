import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword, signToken, setSessionCookie } from "@/lib/auth";
import { authRegisterSchema } from "@/lib/validations";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const userCount = await prisma.user.count();
    return NextResponse.json({
      success: true,
      data: {
        isFirstRun: userCount === 0,
        registrationOpen: userCount === 0,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to check registration status" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Check if any user already exists
    const totalUsers = await prisma.user.count();
    if (totalUsers > 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Public registration is closed. New counselors and staff must be invited by an Administrator on the Team page.",
        },
        { status: 403 }
      );
    }

    const parsed = authRegisterSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.errors[0]?.message || "Validation failed" },
        { status: 400 }
      );
    }

    const { name, email, phone, institutionName, password } = parsed.data;

    // First user is ALWAYS created as ADMIN
    const role = "ADMIN";

    // Check if email exists
    const existing = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    if (existing) {
      return NextResponse.json(
        { success: false, error: "An account with this email already exists" },
        { status: 400 }
      );
    }

    // Create institution
    const institution = await prisma.institution.create({
      data: {
        name: institutionName.trim(),
        email: email.toLowerCase().trim(),
        phone: phone.trim(),
        settings: JSON.stringify({
          scoringWeights: { source: 30, responseSpeed: 25, engagement: 25, completeness: 20 },
          currency: "INR",
          defaultLeadSource: "Website",
          sdgGoal: "UN SDG 4 - Quality Education & Equal Access",
        }),
      },
    });

    const passwordHash = await hashPassword(password);

    const user = await prisma.user.create({
      data: {
        name: name.trim(),
        email: email.toLowerCase().trim(),
        phone: phone.trim(),
        role,
        passwordHash,
        institutionId: institution.id,
        status: "ACTIVE",
      },
    });

    // Record initial audit log
    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: "INITIAL_ADMIN_SETUP",
        entityType: "USER",
        entityId: user.id,
        details: JSON.stringify({
          institutionName: institution.name,
          adminEmail: user.email,
        }),
      },
    });

    const token = signToken({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role as any,
      institutionId: institution.id,
      institutionName: institution.name,
    });

    setSessionCookie(token);

    return NextResponse.json({
      success: true,
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
    });
  } catch (error: any) {
    console.error("Register API error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Registration failed" },
      { status: 500 }
    );
  }
}
