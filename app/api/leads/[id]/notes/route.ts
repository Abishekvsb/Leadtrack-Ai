import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { noteCreateSchema } from "@/lib/validations";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

  const notes = await prisma.note.findMany({
    where: { leadId: params.id },
    orderBy: { createdAt: "desc" },
    include: { author: { select: { id: true, name: true, avatar: true } } },
  });

  return NextResponse.json({ success: true, data: { notes } });
}

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const parsed = noteCreateSchema.safeParse({ ...body, leadId: params.id });

    if (!parsed.success) {
      return NextResponse.json({ success: false, error: parsed.error.errors[0]?.message }, { status: 400 });
    }

    const note = await prisma.note.create({
      data: {
        leadId: params.id,
        authorId: session.id,
        content: parsed.data.content,
        isPinned: parsed.data.isPinned || false,
      },
      include: { author: { select: { id: true, name: true, avatar: true } } },
    });

    // Update notesCount on lead
    await prisma.lead.update({
      where: { id: params.id },
      data: { notesCount: { increment: 1 } },
    });

    // Log activity
    await prisma.leadActivity.create({
      data: {
        leadId: params.id,
        userId: session.id,
        type: "NOTE_ADDED",
        title: "Counselor Note Added",
        description: note.content.slice(0, 120) + (note.content.length > 120 ? "..." : ""),
      },
    });

    return NextResponse.json({ success: true, data: { note } });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
