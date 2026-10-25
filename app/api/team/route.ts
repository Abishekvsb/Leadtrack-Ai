import { NextRequest, NextResponse } from "next/server";
import { getSession, hashPassword } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

    if (session.role === "COUNSELOR") {
      return NextResponse.json({ success: false, error: "Counselors are not permitted to access Team management" }, { status: 403 });
    }

    const users = await prisma.user.findMany({
      orderBy: { createdAt: "asc" },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        phone: true,
        avatar: true,
        status: true,
        createdAt: true,
        _count: {
          select: {
            leads: true,
            followUps: true,
          },
        },
      },
    });

    return NextResponse.json({ success: true, data: { users } });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

    if (session.role !== "ADMIN" && session.role !== "MANAGER") {
      return NextResponse.json({ success: false, error: "Permission denied" }, { status: 403 });
    }

    const body = await req.json();
    const { name, email, phone, role, password } = body;

    if (!name || !email || !password) {
      return NextResponse.json({ success: false, error: "Name, email and password are required" }, { status: 400 });
    }

    const existing = await prisma.user.findUnique({ where: { email: email.toLowerCase().trim() } });
    if (existing) {
      return NextResponse.json({ success: false, error: "Email already in use" }, { status: 400 });
    }

    const institution = await prisma.institution.findFirst();
    const passwordHash = await hashPassword(password);

    const user = await prisma.user.create({
      data: {
        name,
        email: email.toLowerCase().trim(),
        phone: phone || null,
        role: role || "COUNSELOR",
        passwordHash,
        institutionId: institution?.id || null,
        status: "ACTIVE",
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
      },
    });

    return NextResponse.json({ success: true, data: { user } });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

    if (session.role !== "ADMIN" && session.role !== "MANAGER") {
      return NextResponse.json({ success: false, error: "Permission denied" }, { status: 403 });
    }

    const body = await req.json();
    const { id, status, role, name, phone } = body;

    if (!id) return NextResponse.json({ success: false, error: "User ID required" }, { status: 400 });

    const updateData: any = {};
    if (status) updateData.status = status;
    if (role) updateData.role = role;
    if (name) updateData.name = name;
    if (phone !== undefined) updateData.phone = phone;

    const updated = await prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
      },
    });

    return NextResponse.json({ success: true, data: { user: updated } });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
