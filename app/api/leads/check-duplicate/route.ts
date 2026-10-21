import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { checkDuplicate } from "@/server/services/leadService";

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { email, phone, excludeId } = body;

    if (!email && !phone) {
      return NextResponse.json({ success: false, error: "Email or phone required" }, { status: 400 });
    }

    const duplicate = await checkDuplicate(email || "", phone || "", excludeId);

    return NextResponse.json({
      success: true,
      hasDuplicate: !!duplicate,
      data: duplicate ? { duplicate } : null,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
