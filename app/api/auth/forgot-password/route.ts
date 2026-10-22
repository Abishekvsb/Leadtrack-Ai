import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { passwordResetRequestSchema } from "@/lib/validations";
import { sendEmail } from "@/lib/email";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = passwordResetRequestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ success: false, error: "Valid email required" }, { status: 400 });
    }

    const { email } = parsed.data;
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    if (user) {
      // Invalidate existing tokens
      await prisma.passwordResetToken.deleteMany({ where: { email: user.email } });

      const token = crypto.randomBytes(32).toString("hex");
      const expiresAt = new Date(Date.now() + 1000 * 3600 * 2); // 2 hours

      await prisma.passwordResetToken.create({
        data: {
          email: user.email,
          token,
          expiresAt,
        },
      });

      const proto = req.headers.get("x-forwarded-proto") || "https";
      const host = req.headers.get("x-forwarded-host") || req.headers.get("host");
      const fallbackUrl = host ? `${proto}://${host}` : "https://leadtrack-ai.onrender.com";
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || fallbackUrl;
      const resetUrl = `${baseUrl}/reset-password?token=${token}`;

      await sendEmail({
        to: user.email,
        subject: "LeadTrack AI – Password Reset Request",
        text: `Hello ${user.name},\n\nYou requested a password reset. Click this link to set a new password:\n${resetUrl}\n\nThis link is valid for 2 hours.\nIf you did not make this request, please ignore this email.`,
      });
    }

    // Always respond with success to avoid user enumeration
    return NextResponse.json({
      success: true,
      message: "If an account exists with that email, a password reset link has been dispatched.",
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
