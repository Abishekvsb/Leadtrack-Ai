import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getDashboardStats } from "@/server/services/statsService";

export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const range = (searchParams.get("range") || "30d") as any;
    const startDate = searchParams.get("startDate") || undefined;
    const endDate = searchParams.get("endDate") || undefined;

    const stats = await getDashboardStats({ range, startDate, endDate }, session);

    return NextResponse.json({ success: true, data: stats });
  } catch (err: any) {
    console.error("GET /api/dashboard error:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
