import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { listLeads, createLead } from "@/server/services/leadService";
import { leadCreateSchema } from "@/lib/validations";

export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status") || "ALL";
    const courseId = searchParams.get("courseId") || "ALL";
    const leadSource = searchParams.get("leadSource") || "ALL";
    const scoreCategory = searchParams.get("scoreCategory") || "ALL";
    const assignedToId = searchParams.get("assignedToId") || "";
    const startDate = searchParams.get("startDate") || undefined;
    const endDate = searchParams.get("endDate") || undefined;
    const page = Number(searchParams.get("page")) || 1;
    const limit = Number(searchParams.get("limit")) || 25;
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const sortOrder = (searchParams.get("sortOrder") as "asc" | "desc") || "desc";

    const result = await listLeads(
      {
        search,
        status,
        courseId,
        leadSource,
        scoreCategory,
        assignedToId,
        startDate,
        endDate,
        page,
        limit,
        sortBy,
        sortOrder,
      },
      session
    );

    return NextResponse.json({ success: true, data: result });
  } catch (err: any) {
    console.error("GET /api/leads error:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const parsed = leadCreateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.errors[0]?.message || "Validation failed" },
        { status: 400 }
      );
    }

    const lead = await createLead(parsed.data, session.id);

    return NextResponse.json({ success: true, data: { lead } });
  } catch (err: any) {
    console.error("POST /api/leads error:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 400 });
  }
}
