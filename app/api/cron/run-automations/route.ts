import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

async function executeAutomationEngine(req: NextRequest) {
  try {
    const cronSecret = process.env.CRON_SECRET || "leadtrack-cron-secret-key-2026";
    const authHeader = req.headers.get("authorization");
    const headerSecret = req.headers.get("x-cron-secret");
    const url = new URL(req.url);
    const querySecret = url.searchParams.get("secret") || url.searchParams.get("key");

    // Require authentication via header or query secret
    const bearerToken = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;
    const provided = bearerToken || headerSecret || querySecret;
    if (!provided || provided !== cronSecret) {
      return NextResponse.json(
        { success: false, error: "Unauthorized: Invalid or missing cron secret" },
        { status: 401 }
      );
    }

    const now = new Date();
    let remindersCreated = 0;
    let rulesExecuted = 0;

    // 1. Process Due & Overdue Follow-up Reminders
    const dueFollowUps = await prisma.followUp.findMany({
      where: {
        status: "PENDING",
        scheduledAt: { lte: now },
      },
      include: {
        lead: { select: { id: true, studentName: true, phone: true } },
        assignedTo: { select: { id: true, name: true, email: true } },
      },
      take: 50,
    });

    for (const item of dueFollowUps) {
      if (item.assignedToId) {
        // Prevent duplicate unread notifications for the same follow-up link
        const existing = await prisma.notification.findFirst({
          where: {
            userId: item.assignedToId,
            link: `/leads/${item.leadId}`,
            type: "FOLLOW_UP",
            isRead: false,
          },
        });

        if (!existing) {
          await prisma.notification.create({
            data: {
              userId: item.assignedToId,
              title: "Due Follow-up Reminder",
              message: `Scheduled follow-up with candidate ${item.lead.studentName} is due.`,
              type: "FOLLOW_UP",
              link: `/leads/${item.leadId}`,
            },
          });
          remindersCreated++;
        }
      }
    }

    // 2. Process Active Automations
    const activeAutomations = await prisma.automation.findMany({
      where: { isActive: true },
    });

    for (const auto of activeAutomations) {
      let matchedCount = 0;

      if (auto.triggerEvent === "SCORE_ABOVE") {
        let threshold = 75;
        try {
          const config = JSON.parse(auto.conditionConfig || "{}");
          if (config.threshold) threshold = Number(config.threshold);
        } catch {}

        const highScoringLeads = await prisma.lead.findMany({
          where: {
            score: { gte: threshold },
            status: { notIn: ["ADMITTED", "LOST"] },
          },
          take: 10,
        });

        for (const lead of highScoringLeads) {
          await prisma.automationLog.create({
            data: {
              automationId: auto.id,
              leadId: lead.id,
              status: "SUCCESS",
              message: `High-priority notification triggered for candidate ${lead.studentName} (AI Score: ${lead.score}/100)`,
            },
          });

          if (lead.assignedToId && auto.actionType === "NOTIFY_COUNSELOR") {
            await prisma.notification.create({
              data: {
                userId: lead.assignedToId,
                title: "High Priority Lead Alert",
                message: `${lead.studentName} has reached score ${lead.score}. Recommended: immediate follow-up.`,
                type: "HIGH_SCORE",
                link: `/leads/${lead.id}`,
              },
            });
          }
          matchedCount++;
        }
      } else if (auto.triggerEvent === "NO_RESPONSE_X_DAYS") {
        let days = 2;
        try {
          const config = JSON.parse(auto.conditionConfig || "{}");
          if (config.days) days = Number(config.days);
        } catch {}

        const cutoffDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
        const staleLeads = await prisma.lead.findMany({
          where: {
            status: "NEW",
            createdAt: { lte: cutoffDate },
          },
          take: 10,
        });

        for (const lead of staleLeads) {
          await prisma.automationLog.create({
            data: {
              automationId: auto.id,
              leadId: lead.id,
              status: "SUCCESS",
              message: `SLA warning: Lead ${lead.studentName} has been pending for over ${days} days without response.`,
            },
          });

          if (lead.assignedToId) {
            await prisma.notification.create({
              data: {
                userId: lead.assignedToId,
                title: "SLA Response Warning",
                message: `Enquiry from ${lead.studentName} requires first contact.`,
                type: "AUTOMATION",
                link: `/leads/${lead.id}`,
              },
            });
          }
          matchedCount++;
        }
      }

      await prisma.automation.update({
        where: { id: auto.id },
        data: {
          executionCount: { increment: Math.max(1, matchedCount) },
          lastRunAt: now,
        },
      });

      rulesExecuted += matchedCount;
    }

    return NextResponse.json({
      success: true,
      message: "Automations and scheduled reminders executed successfully",
      data: {
        timestamp: now.toISOString(),
        activeAutomationsCount: activeAutomations.length,
        rulesExecuted,
        remindersCreated,
      },
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Failed to execute cron automation" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  return executeAutomationEngine(req);
}

export async function GET(req: NextRequest) {
  return executeAutomationEngine(req);
}
