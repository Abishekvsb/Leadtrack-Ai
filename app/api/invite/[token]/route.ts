import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword, signToken, setSessionCookie } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(
  req: NextRequest,
  { params }: { params: { token: string } }
) {
  try {
    const { token } = params;

    const invite = await prisma.userInvite.findUnique({
      where: { token },
      include: {
        invitedBy: {
          select: {
            name: true,
            institution: { select: { id: true, name: true } },
          },
        },
      },
    });

    if (!invite) {
      return NextResponse.json(
        { success: false, error: "Invalid invitation link." },
        { status: 404 }
      );
    }

    if (invite.usedAt) {
      return NextResponse.json(
        { success: false, error: "This invitation link has already been used. Please log in directly." },
        { status: 410 }
      );
    }

    if (new Date() > new Date(invite.expiresAt)) {
      return NextResponse.json(
        { success: false, error: "This invitation link has expired. Please ask your administrator for a new invite." },
        { status: 410 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        email: invite.email,
        role: invite.role,
        institutionName: invite.invitedBy?.institution?.name || "LeadTrack AI",
        invitedByName: invite.invitedBy?.name || "Administrator",
      },
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: { token: string } }
) {
  try {
    const { token } = params;
    const body = await req.json();
    const { name, password, phone } = body;

    if (!name || !password) {
      return NextResponse.json(
        { success: false, error: "Name and password are required" },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { success: false, error: "Password must be at least 8 characters long" },
        { status: 400 }
      );
    }

    const invite = await prisma.userInvite.findUnique({
      where: { token },
      include: {
        invitedBy: {
          select: { institutionId: true, institution: { select: { name: true } } },
        },
      },
    });

    if (!invite) {
      return NextResponse.json({ success: false, error: "Invalid invitation" }, { status: 404 });
    }

    if (invite.usedAt) {
      return NextResponse.json(
        { success: false, error: "This invitation has already been accepted" },
        { status: 410 }
      );
    }

    if (new Date() > new Date(invite.expiresAt)) {
      return NextResponse.json(
        { success: false, error: "This invitation has expired" },
        { status: 410 }
      );
    }

    // Check if user already exists
    const existing = await prisma.user.findUnique({
      where: { email: invite.email },
    });

    if (existing) {
      return NextResponse.json(
        { success: false, error: "An account with this email already exists. Please log in." },
        { status: 400 }
      );
    }

    const passwordHash = await hashPassword(password);

    // Create user
    const newUser = await prisma.user.create({
      data: {
        name: name.trim(),
        email: invite.email,
        phone: phone ? phone.trim() : null,
        passwordHash,
        role: invite.role,
        institutionId: invite.invitedBy?.institutionId || null,
        status: "ACTIVE",
      },
    });

    // Mark invite as used
    await prisma.userInvite.update({
      where: { id: invite.id },
      data: { usedAt: new Date() },
    });

    // Log in audit log
    await prisma.auditLog.create({
      data: {
        userId: newUser.id,
        action: "INVITE_ACCEPTED",
        entityType: "USER",
        entityId: newUser.id,
        details: JSON.stringify({
          role: newUser.role,
          email: newUser.email,
          invitedBy: invite.invitedById,
        }),
      },
    });

    // Issue session token & cookie
    const sessionToken = signToken({
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role as any,
      institutionId: newUser.institutionId || undefined,
      institutionName: invite.invitedBy?.institution?.name || "LeadTrack AI",
    });

    setSessionCookie(sessionToken);

    return NextResponse.json({
      success: true,
      data: {
        user: {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
        },
      },
    });
  } catch (err: any) {
    console.error("Accept invite error:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
