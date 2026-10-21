import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { updateLead } from "@/server/services/leadService";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

  const activities = await prisma.leadActivity.findMany({
    where: { leadId: params.id },
    orderBy: { createdAt: "desc" },
    include: { user: { select: { id: true, name: true, avatar: true } } },
  });

  return NextResponse.json({ success: true, data: { activities } });
}

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { type, title, description, metadata } = body;

    if (!title) {
      return NextResponse.json({ success: false, error: "Title is required" }, { status: 400 });
    }

    const activity = await prisma.leadActivity.create({
      data: {
        leadId: params.id,
        userId: session.id,
        type: type || "CALL_LOGGED",
        title,
        description: description || null,
        metadata: metadata ? JSON.stringify(metadata) : "{}",
      },
      include: { user: { select: { id: true, name: true, avatar: true } } },
    });

    // Recompute score since activity increases engagement
    await updateLead(params.id, {}, session.id);

    return NextResponse.json({ success: true, data: { activity } });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
