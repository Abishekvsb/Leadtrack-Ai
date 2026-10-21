import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { courseCreateSchema } from "@/lib/validations";

export async function GET() {
  try {
    const courses = await prisma.course.findMany({
      orderBy: { name: "asc" },
      include: {
        _count: { select: { leads: true } },
      },
    });

    return NextResponse.json({ success: true, data: { courses } });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const parsed = courseCreateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ success: false, error: parsed.error.errors[0]?.message }, { status: 400 });
    }

    const institution = await prisma.institution.findFirst();

    const course = await prisma.course.create({
      data: {
        ...parsed.data,
        institutionId: institution?.id || null,
        isActive: true,
      },
    });

    return NextResponse.json({ success: true, data: { course } });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { id, ...data } = body;
    if (!id) return NextResponse.json({ success: false, error: "Course ID required" }, { status: 400 });

    const updated = await prisma.course.update({
      where: { id },
      data,
    });

    return NextResponse.json({ success: true, data: { course: updated } });
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
    if (!id) return NextResponse.json({ success: false, error: "Course ID required" }, { status: 400 });

    await prisma.course.delete({ where: { id } });

    return NextResponse.json({ success: true, message: "Course removed" });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
