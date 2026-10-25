import { NextRequest, NextResponse } from "next/server";
import { publicEnquirySchema } from "@/lib/validations";
import { createLead, checkDuplicate } from "@/server/services/leadService";
import { checkRateLimit, getClientIp } from "@/lib/rateLimit";

export async function POST(req: NextRequest) {
  try {
    const clientIp = getClientIp(req);
    const rl = checkRateLimit("enquiry", clientIp, 15, 60 * 1000);
    if (!rl.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Too many enquiry submissions. Please wait a moment before trying again.",
          retryAfter: rl.retryAfterSeconds,
        },
        { status: 429, headers: { "Retry-After": String(rl.retryAfterSeconds || 60) } }
      );
    }

    const body = await req.json();
    const parsed = publicEnquirySchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.errors[0]?.message || "Validation failed" },
        { status: 400 }
      );
    }

    const { email, phone } = parsed.data;

    // Check duplicate
    const existing = await checkDuplicate(email, phone);
    if (existing) {
      return NextResponse.json(
        {
          success: false,
          isDuplicate: true,
          error: "An inquiry with this email or phone number has already been registered! Our admissions team is already reviewing your profile.",
          data: {
            studentName: existing.studentName,
            status: existing.status,
            courseName: existing.course?.name || "General Course",
          },
        },
        { status: 409 }
      );
    }

    const lead = await createLead({
      ...parsed.data,
      status: "NEW",
    });

    return NextResponse.json({
      success: true,
      message: "Your enquiry has been received successfully! An admissions counselor will reach out shortly.",
      data: {
        leadId: lead.id,
        studentName: lead.studentName,
        course: lead.course?.name,
      },
    });
  } catch (err: any) {
    console.error("Public enquiry API error:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Failed to submit enquiry" },
      { status: 500 }
    );
  }
}
