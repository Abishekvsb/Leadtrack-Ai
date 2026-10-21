import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { templateCreateSchema } from "@/lib/validations";

export async function GET() {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

    const templates = await prisma.template.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, data: { templates } });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const parsed = templateCreateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ success: false, error: parsed.error.errors[0]?.message }, { status: 400 });
    }

    const { name, type, category, subject, body: content, variables } = parsed.data;

    const template = await prisma.template.create({
      data: {
        name,
        type,
        category,
        subject: subject || null,
        body: content,
        variables: JSON.stringify(variables),
      },
    });

    return NextResponse.json({ success: true, data: { template } });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { id, name, type, category, subject, body: content } = body;

    if (!id) return NextResponse.json({ success: false, error: "Template ID required" }, { status: 400 });

    const updated = await prisma.template.update({
      where: { id },
      data: {
        name,
        type,
        category,
        subject: subject || null,
        body: content,
      },
    });

    return NextResponse.json({ success: true, data: { template: updated } });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ success: false, error: "Template ID required" }, { status: 400 });

    await prisma.template.delete({ where: { id } });

    return NextResponse.json({ success: true, message: "Template deleted" });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
