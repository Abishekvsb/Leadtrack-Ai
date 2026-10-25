import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

    if (session.role === "COUNSELOR") {
      return NextResponse.json({ success: false, error: "Counselors are not permitted to access Settings" }, { status: 403 });
    }

    const institution = await prisma.institution.findFirst({
      include: {
        _count: { select: { leads: true, courses: true, users: true } },
      },
    });

    return NextResponse.json({ success: true, data: { institution } });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

    if (session.role !== "ADMIN") {
      return NextResponse.json({ success: false, error: "Only Admins can update institution settings" }, { status: 403 });
    }

    const body = await req.json();
    const institution = await prisma.institution.findFirst();

    if (!institution) {
      return NextResponse.json({ success: false, error: "Institution not found" }, { status: 404 });
    }

    const updated = await prisma.institution.update({
      where: { id: institution.id },
      data: {
        name: body.name || institution.name,
        code: body.code !== undefined ? body.code : institution.code,
        logo: body.logo !== undefined ? body.logo : institution.logo,
        website: body.website !== undefined ? body.website : institution.website,
        address: body.address !== undefined ? body.address : institution.address,
        city: body.city !== undefined ? body.city : institution.city,
        state: body.state !== undefined ? body.state : institution.state,
        phone: body.phone !== undefined ? body.phone : institution.phone,
        email: body.email !== undefined ? body.email : institution.email,
        workingHours: body.workingHours !== undefined ? body.workingHours : institution.workingHours,
        settings: body.settings ? JSON.stringify(body.settings) : institution.settings,
      },
    });

    await prisma.auditLog.create({
      data: {
        userId: session.id,
        action: "UPDATE_SETTINGS",
        entityType: "SETTINGS",
        entityId: institution.id,
        details: JSON.stringify({ updatedFields: Object.keys(body) }),
      },
    });

    return NextResponse.json({ success: true, data: { institution: updated } });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
