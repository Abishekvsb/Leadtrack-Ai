import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword, signToken, setSessionCookie } from "@/lib/auth";
import { authRegisterSchema } from "@/lib/validations";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = authRegisterSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.errors[0]?.message || "Validation failed" },
        { status: 400 }
      );
    }

    const { name, email, phone, institutionName, role, password } = parsed.data;

    // Check if user exists
    const existing = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    if (existing) {
      return NextResponse.json(
        { success: false, error: "An account with this email already exists" },
        { status: 400 }
      );
    }

    // Find or create institution
    let institution = await prisma.institution.findFirst({
      where: { name: { equals: institutionName.trim() } },
    });

    if (!institution) {
      institution = await prisma.institution.create({
        data: {
          name: institutionName.trim(),
          email: email.toLowerCase().trim(),
          phone,
        },
      });
    }

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
    return NextResponse.json({ success: false, error: error.message || "Registration failed" }, { status: 500 });
  }
}
