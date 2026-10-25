import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { followUpCreateSchema } from "@/lib/validations";

export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const filter = searchParams.get("filter") || "ALL"; // ALL, TODAY, OVERDUE, UPCOMING, COMPLETED

    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const todayEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);

    const userFilter = session.role === "COUNSELOR" ? { assignedToId: session.id } : {};

    let dateWhere: any = {};
    let statusWhere: any = { status: "PENDING" };

    if (filter === "OVERDUE") {
      dateWhere = { scheduledAt: { lt: todayStart } };
    } else if (filter === "TODAY") {
      dateWhere = { scheduledAt: { gte: todayStart, lte: todayEnd } };
    } else if (filter === "UPCOMING") {
      dateWhere = { scheduledAt: { gt: todayEnd } };
    } else if (filter === "COMPLETED") {
      statusWhere = { status: "COMPLETED" };
    } else {
      // ALL
      statusWhere = {};
    }

    const followUps = await prisma.followUp.findMany({
      where: {
        ...userFilter,
        ...statusWhere,
        ...dateWhere,
      },
      include: {
        lead: {
          select: {
            id: true,
            studentName: true,
            email: true,
            phone: true,
            status: true,
            score: true,
            scoreCategory: true,
            course: { select: { name: true, code: true } },
          },
        },
        assignedTo: { select: { id: true, name: true, avatar: true } },
      },
      orderBy: { scheduledAt: "asc" },
    });

    const counts = {
      all: await prisma.followUp.count({ where: { ...userFilter } }),
      overdue: await prisma.followUp.count({
        where: { ...userFilter, status: "PENDING", scheduledAt: { lt: todayStart } },
      }),
      today: await prisma.followUp.count({
        where: { ...userFilter, status: "PENDING", scheduledAt: { gte: todayStart, lte: todayEnd } },
      }),
      upcoming: await prisma.followUp.count({
        where: { ...userFilter, status: "PENDING", scheduledAt: { gt: todayEnd } },
      }),
      completed: await prisma.followUp.count({
        where: { ...userFilter, status: "COMPLETED" },
      }),
    };

    return NextResponse.json({ success: true, data: { followUps, counts } });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const parsed = followUpCreateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ success: false, error: parsed.error.errors[0]?.message }, { status: 400 });
    }

    const { leadId, scheduledAt, type, priority, notes, assignedToId } = parsed.data;

    const followUp = await prisma.followUp.create({
      data: {
        leadId,
        scheduledAt: new Date(scheduledAt),
        type,
        priority,
        notes: notes || null,
        assignedToId: assignedToId || session.id,
        status: "PENDING",
      },
      include: {
        lead: { select: { studentName: true } },
      },
    });

    // Update lead followUpDue
    await prisma.lead.update({
      where: { id: leadId },
      data: { followUpDue: new Date(scheduledAt) },
    });

    // Log activity
    await prisma.leadActivity.create({
      data: {
        leadId,
        userId: session.id,
        type: "FOLLOW_UP_SCHEDULED",
        title: `Follow-up Scheduled: ${type}`,
        description: `Scheduled for ${new Date(scheduledAt).toLocaleString("en-IN")}. ${notes || ""}`,
      },
    });

    return NextResponse.json({ success: true, data: { followUp } });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { id, status, outcome, scheduledAt } = body;

    if (!id) return NextResponse.json({ success: false, error: "FollowUp ID required" }, { status: 400 });

    const updateData: any = {};
    if (status) updateData.status = status;
    if (outcome) updateData.outcome = outcome;
    if (scheduledAt) updateData.scheduledAt = new Date(scheduledAt);
    if (status === "COMPLETED") updateData.completedAt = new Date();

    const updated = await prisma.followUp.update({
      where: { id },
      data: updateData,
      include: { lead: true },
    });

    if (status === "COMPLETED") {
      await prisma.leadActivity.create({
        data: {
          leadId: updated.leadId,
          userId: session.id,
          type: "CALL_LOGGED",
          title: `Follow-up Completed (${updated.type})`,
          description: outcome || "Task resolved and marked complete.",
        },
      });
    }

    return NextResponse.json({ success: true, data: { followUp: updated } });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  return PATCH(req);
}
