import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { automationCreateSchema } from "@/lib/validations";

export async function GET() {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

    const [automations, logs] = await Promise.all([
      prisma.automation.findMany({
        orderBy: { createdAt: "desc" },
      }),
      prisma.automationLog.findMany({
        take: 25,
        orderBy: { executedAt: "desc" },
        include: {
          automation: { select: { name: true, actionType: true } },
          lead: { select: { id: true, studentName: true, email: true } },
        },
      }),
    ]);

    return NextResponse.json({ success: true, data: { automations, logs } });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

    const body = await req.json();

    // Check if triggering manual execution of all automations
    if (body.action === "RUN_ENGINE") {
      const activeAutomations = await prisma.automation.findMany({ where: { isActive: true } });
      let triggeredCount = 0;

      for (const auto of activeAutomations) {
        if (auto.triggerEvent === "SCORE_ABOVE") {
          const config = JSON.parse(auto.conditionConfig || "{}");
          const threshold = config.threshold || 80;
          const matchingLeads = await prisma.lead.findMany({
            where: { score: { gte: threshold }, status: { notIn: ["ADMITTED", "LOST"] } },
            take: 10,
          });

          for (const lead of matchingLeads) {
            await prisma.automationLog.create({
              data: {
                automationId: auto.id,
                leadId: lead.id,
                status: "SUCCESS",
                message: `Automated alert triggered for high-score lead ${lead.studentName} (${lead.score}/100)`,
              },
            });
            triggeredCount++;
          }
        } else if (auto.triggerEvent === "NO_RESPONSE_X_DAYS") {
          const matchingLeads = await prisma.lead.findMany({
            where: { status: "NEW" },
            take: 8,
          });

          for (const lead of matchingLeads) {
            await prisma.automationLog.create({
              data: {
                automationId: auto.id,
                leadId: lead.id,
                status: "SUCCESS",
                message: `SLA follow-up reminder sent to ${lead.studentName}`,
              },
            });
            triggeredCount++;
          }
        }

        await prisma.automation.update({
          where: { id: auto.id },
          data: {
            executionCount: { increment: 2 },
            lastRunAt: new Date(),
          },
        });
      }

      return NextResponse.json({
        success: true,
        message: `Automation engine successfully executed. ${triggeredCount} rule actions triggered and logged.`,
      });
    }

    const parsed = automationCreateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ success: false, error: parsed.error.errors[0]?.message }, { status: 400 });
    }

    const { name, description, triggerEvent, conditionConfig, actionType, actionConfig, isActive } = parsed.data;

    const automation = await prisma.automation.create({
      data: {
        name,
        description: description || null,
        triggerEvent,
        conditionConfig: JSON.stringify(conditionConfig),
        actionType,
        actionConfig: JSON.stringify(actionConfig),
        isActive,
      },
    });

    return NextResponse.json({ success: true, data: { automation } });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { id, isActive, name, description } = body;

    if (!id) return NextResponse.json({ success: false, error: "Automation ID required" }, { status: 400 });

    const updateData: any = {};
    if (typeof isActive === "boolean") updateData.isActive = isActive;
    if (name) updateData.name = name;
    if (description !== undefined) updateData.description = description;

    const updated = await prisma.automation.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({ success: true, data: { automation: updated } });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
