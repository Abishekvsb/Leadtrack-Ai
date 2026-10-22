import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";

export const dynamic = "force-dynamic";

// GET /api/team/invite - List pending invites
export async function GET() {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

    if (session.role !== "ADMIN" && session.role !== "MANAGER") {
      return NextResponse.json({ success: false, error: "Permission denied" }, { status: 403 });
    }

    const invites = await prisma.userInvite.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        invitedBy: {
          select: { name: true, email: true },
        },
      },
    });

    return NextResponse.json({ success: true, data: { invites } });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

// POST /api/team/invite - Generate new invite link
export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

    if (session.role !== "ADMIN" && session.role !== "MANAGER") {
      return NextResponse.json({ success: false, error: "Only Admins and Managers can invite users" }, { status: 403 });
    }

    const body = await req.json();
    const { email, role = "COUNSELOR" } = body;

    if (!email) {
      return NextResponse.json({ success: false, error: "Email is required" }, { status: 400 });
    }

    const cleanEmail = email.toLowerCase().trim();

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: cleanEmail },
    });
    if (existingUser) {
      return NextResponse.json(
        { success: false, error: "A user with this email is already registered." },
        { status: 400 }
      );
    }

    // Check if there is already an active invite for this email
    const existingInvite = await prisma.userInvite.findFirst({
      where: {
        email: cleanEmail,
        usedAt: null,
        expiresAt: { gt: new Date() },
      },
    });

    const token = crypto.randomBytes(24).toString("hex");
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    let invite;
    if (existingInvite) {
      invite = await prisma.userInvite.update({
        where: { id: existingInvite.id },
        data: {
          token,
          role,
          expiresAt,
          invitedById: session.id,
        },
      });
    } else {
      invite = await prisma.userInvite.create({
        data: {
          email: cleanEmail,
          role,
          token,
          expiresAt,
          invitedById: session.id,
        },
      });
    }

    const proto = req.headers.get("x-forwarded-proto") || "https";
    const host = req.headers.get("x-forwarded-host") || req.headers.get("host");
    const fallbackUrl = host ? `${proto}://${host}` : "https://leadtrack-ai.onrender.com";
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || fallbackUrl;

    const inviteUrl = `${baseUrl}/invite/${token}`;

    return NextResponse.json({
      success: true,
      data: {
        invite: {
          id: invite.id,
          email: invite.email,
          role: invite.role,
          expiresAt: invite.expiresAt,
          token: invite.token,
          inviteUrl,
        },
      },
    });
  } catch (err: any) {
    console.error("Team invite creation error:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

// DELETE /api/team/invite - Revoke invite
export async function DELETE(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

    if (session.role !== "ADMIN") {
      return NextResponse.json({ success: false, error: "Permission denied" }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) return NextResponse.json({ success: false, error: "Invite ID required" }, { status: 400 });

    await prisma.userInvite.delete({ where: { id } });

    return NextResponse.json({ success: true, message: "Invite revoked successfully" });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
