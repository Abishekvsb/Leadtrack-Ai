import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ success: false, error: "Not authenticated" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.id },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      phone: true,
      avatar: true,
      status: true,
      institution: { select: { id: true, name: true, logo: true, code: true } },
    },
  });

  if (!user || user.status !== "ACTIVE") {
    return NextResponse.json({ success: false, error: "Account inactive or removed" }, { status: 401 });
  }

  return NextResponse.json({ success: true, data: { user } });
}
