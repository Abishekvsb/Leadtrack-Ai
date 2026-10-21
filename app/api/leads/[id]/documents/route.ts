import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

  const documents = await prisma.document.findMany({
    where: { leadId: params.id },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ success: true, data: { documents } });
}

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { name, fileType, fileUrl, fileSize } = body;

    if (!name || !fileType) {
      return NextResponse.json({ success: false, error: "Document name and type are required" }, { status: 400 });
    }

    const document = await prisma.document.create({
      data: {
        leadId: params.id,
        name,
        fileType,
        fileUrl: fileUrl || "https://placehold.co/600x400/pdf",
        fileSize: fileSize || "1.2 MB",
        uploadedBy: session.name,
      },
    });

    await prisma.leadActivity.create({
      data: {
        leadId: params.id,
        userId: session.id,
        type: "DOCUMENT_UPLOADED",
        title: `Document Uploaded: ${name}`,
        description: `Uploaded ${fileType} document (${fileSize || "1.2 MB"}).`,
      },
    });

    return NextResponse.json({ success: true, data: { document } });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
