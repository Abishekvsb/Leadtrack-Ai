import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getLeadById, updateLead } from "@/server/services/leadService";
import { leadUpdateSchema } from "@/lib/validations";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

    const lead = await getLeadById(params.id);
    if (!lead) return NextResponse.json({ success: false, error: "Lead not found" }, { status: 404 });

    // If counselor, check if assigned or can view
    if (session.role === "COUNSELOR" && lead.assignedToId && lead.assignedToId !== session.id) {
      // Counselor restricted access
      return NextResponse.json({ success: false, error: "Forbidden: Not assigned to this lead" }, { status: 403 });
    }

    return NextResponse.json({ success: true, data: { lead } });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const parsed = leadUpdateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.errors[0]?.message || "Validation failed" },
        { status: 400 }
      );
    }

    const updated = await updateLead(params.id, parsed.data, session.id);
    return NextResponse.json({ success: true, data: { lead: updated } });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

    if (session.role !== "ADMIN" && session.role !== "MANAGER") {
      return NextResponse.json({ success: false, error: "Only Admins & Managers can delete leads" }, { status: 403 });
    }

    const lead = await prisma.lead.findUnique({ where: { id: params.id } });
    if (!lead) return NextResponse.json({ success: false, error: "Lead not found" }, { status: 404 });

    await prisma.lead.delete({ where: { id: params.id } });

    await prisma.auditLog.create({
      data: {
        userId: session.id,
        action: "DELETE_LEAD",
        entityType: "LEAD",
        entityId: params.id,
        details: JSON.stringify({ studentName: lead.studentName, email: lead.email }),
      },
    });

    return NextResponse.json({ success: true, message: "Lead deleted successfully" });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
