import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { mergeLeads } from "@/server/services/leadService";

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { targetLeadId, sourceLeadId } = body;

    if (!targetLeadId || !sourceLeadId) {
      return NextResponse.json({ success: false, error: "Both targetLeadId and sourceLeadId are required" }, { status: 400 });
    }

    const merged = await mergeLeads(targetLeadId, sourceLeadId, session.id);

    return NextResponse.json({
      success: true,
      data: { lead: merged },
      message: "Duplicate leads successfully merged.",
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
