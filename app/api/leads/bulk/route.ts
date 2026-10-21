import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { bulkAssignLeads, bulkUpdateStatus } from "@/server/services/leadService";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { action, leadIds, status, assignedToId } = body;

    if (!Array.isArray(leadIds) || leadIds.length === 0) {
      return NextResponse.json({ success: false, error: "leadIds array is required" }, { status: 400 });
    }

    if (action === "CHANGE_STATUS") {
      if (!status) return NextResponse.json({ success: false, error: "Status required" }, { status: 400 });
      const result = await bulkUpdateStatus(leadIds, status, session.id);
      return NextResponse.json({ success: true, data: result, message: `Updated status of ${result.count} leads.` });
    }

    if (action === "ASSIGN") {
      if (!assignedToId) return NextResponse.json({ success: false, error: "assignedToId required" }, { status: 400 });
      const result = await bulkAssignLeads(leadIds, assignedToId, session.id);
      return NextResponse.json({ success: true, data: result, message: `Assigned ${result.count} leads.` });
    }

    if (action === "DELETE") {
      if (session.role !== "ADMIN" && session.role !== "MANAGER") {
        return NextResponse.json({ success: false, error: "Permission denied" }, { status: 403 });
      }
      await prisma.lead.deleteMany({ where: { id: { in: leadIds } } });
      return NextResponse.json({ success: true, message: `Deleted ${leadIds.length} leads.` });
    }

    return NextResponse.json({ success: false, error: "Unknown action" }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
