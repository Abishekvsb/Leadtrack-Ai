import { prisma } from "@/lib/prisma";
import { computeLeadScore } from "@/lib/scoring";
import { LeadFilterParams, UserSession } from "@/lib/types";
import { normalizeEmail, normalizePhone } from "@/lib/utils";
import { Prisma } from "@prisma/client";

export async function listLeads(params: LeadFilterParams, user?: UserSession | null) {
  const {
    search = "",
    status,
    courseId,
    leadSource,
    scoreCategory,
    assignedToId,
    startDate,
    endDate,
    page = 1,
    limit = 20,
    sortBy = "createdAt",
    sortOrder = "desc",
  } = params;

  const where: Prisma.LeadWhereInput = {};

  // Role scoping: COUNSELOR only sees leads assigned to them (unless explicitly searching all or admin/manager)
  if (user && user.role === "COUNSELOR") {
    where.assignedToId = user.id;
  } else if (assignedToId) {
    where.assignedToId = assignedToId;
  }

  if (search.trim()) {
    const q = search.trim();
    where.OR = [
      { studentName: { contains: q } },
      { email: { contains: q } },
      { phone: { contains: q } },
      { city: { contains: q } },
    ];
  }

  if (status && status !== "ALL") {
    where.status = status;
  }

  if (courseId && courseId !== "ALL") {
    where.courseId = courseId;
  }

  if (leadSource && leadSource !== "ALL") {
    where.leadSource = leadSource;
  }

  if (scoreCategory && scoreCategory !== "ALL") {
    where.scoreCategory = scoreCategory;
  }

  if (startDate || endDate) {
    where.createdAt = {};
    if (startDate) where.createdAt.gte = new Date(startDate);
    if (endDate) {
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      where.createdAt.lte = end;
    }
  }

  const skip = (Number(page) - 1) * Number(limit);
  const take = Number(limit);

  const [total, leads] = await Promise.all([
    prisma.lead.count({ where }),
    prisma.lead.findMany({
      where,
      skip,
      take,
      orderBy: { [sortBy]: sortOrder },
      include: {
        course: { select: { id: true, name: true, code: true, fee: true } },
        assignedTo: { select: { id: true, name: true, email: true, avatar: true } },
      },
    }),
  ]);

  return {
    leads,
    pagination: {
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / Number(limit)),
    },
  };
}

export async function getLeadById(id: string) {
  return prisma.lead.findUnique({
    where: { id },
    include: {
      course: true,
      assignedTo: { select: { id: true, name: true, email: true, phone: true, avatar: true } },
      activities: { orderBy: { createdAt: "desc" }, take: 50 },
      notes: { orderBy: { createdAt: "desc" }, include: { author: { select: { name: true, avatar: true } } } },
      followUps: { orderBy: { scheduledAt: "asc" } },
      documents: { orderBy: { createdAt: "desc" } },
    },
  });
}

export async function checkDuplicate(email: string, phone: string, excludeId?: string) {
  const normEmail = normalizeEmail(email);
  const normPhone = normalizePhone(phone);

  if (!normEmail && !normPhone) return null;

  const candidates = await prisma.lead.findMany({
    where: {
      AND: [
        excludeId ? { id: { not: excludeId } } : {},
        {
          OR: [
            normEmail ? { email: { equals: normEmail, mode: "insensitive" } } : {},
            normPhone && normPhone.length >= 7 ? { phone: { contains: normPhone.slice(-7) } } : {},
          ],
        },
      ],
    },
    include: {
      course: true,
      assignedTo: { select: { name: true } },
    },
  });

  return (
    candidates.find((c) => {
      const cPhone = normalizePhone(c.phone);
      const cEmail = normalizeEmail(c.email);
      const emailMatches = !!normEmail && !!cEmail && normEmail === cEmail;
      const phoneMatches =
        !!normPhone &&
        !!cPhone &&
        (cPhone === normPhone ||
          (normPhone.length >= 10 && cPhone.endsWith(normPhone.slice(-10))) ||
          (cPhone.length >= 10 && normPhone.endsWith(cPhone.slice(-10))));
      return emailMatches || phoneMatches;
    }) || null
  );
}

export async function createLead(data: any, createdByUserId?: string | null) {
  // Check duplicate
  const duplicate = await checkDuplicate(data.email, data.phone);
  if (duplicate) {
    throw new Error(`DUPLICATE_LEAD: A lead already exists for student "${duplicate.studentName}" with matching contact details.`);
  }

  // Get course degree for scoring
  let courseDegree = "";
  if (data.courseId) {
    const course = await prisma.course.findUnique({ where: { id: data.courseId } });
    if (course) courseDegree = course.degree;
  }

  // Compute AI score
  const scoring = computeLeadScore({
    leadSource: data.leadSource || "Website",
    status: data.status || "NEW",
    createdAt: new Date(),
    courseDegree,
    phone: data.phone,
    email: data.email,
    city: data.city,
    parentPhone: data.parentPhone,
  });

  // Pick default counselor if not assigned
  let assignedToId = data.assignedToId;
  if (!assignedToId) {
    const defaultCounselor = await prisma.user.findFirst({
      where: { role: "COUNSELOR", status: "ACTIVE" },
      orderBy: { leads: { _count: "asc" } }, // Round-robin load balancing
    });
    if (defaultCounselor) assignedToId = defaultCounselor.id;
  }

  const lead = await prisma.lead.create({
    data: {
      studentName: data.studentName,
      email: data.email.toLowerCase().trim(),
      phone: data.phone.trim(),
      parentName: data.parentName || null,
      parentPhone: data.parentPhone || null,
      city: data.city,
      state: data.state || null,
      courseId: data.courseId || null,
      leadSource: data.leadSource || "Website",
      status: data.status || "NEW",
      score: scoring.score,
      scoreCategory: scoring.category,
      scoreBreakdown: JSON.stringify(scoring.breakdown),
      engagementLevel: scoring.engagementLevel,
      nextBestAction: scoring.nextBestAction,
      conversionProbability: scoring.conversionProbability,
      message: data.message || null,
      assignedToId: assignedToId || null,
      followUpDue: data.followUpDue ? new Date(data.followUpDue) : null,
    },
    include: {
      course: true,
      assignedTo: true,
    },
  });

  // Log activity
  await prisma.leadActivity.create({
    data: {
      leadId: lead.id,
      userId: createdByUserId || null,
      type: "STATUS_CHANGE",
      title: "Lead Created",
      description: `New lead created via ${lead.leadSource} for ${lead.course?.name || "General Enquiry"}. Initial AI score: ${scoring.score}/100.`,
    },
  });

  // Create follow-up if followUpDue was specified
  if (data.followUpDue) {
    await prisma.followUp.create({
      data: {
        leadId: lead.id,
        assignedToId: lead.assignedToId,
        scheduledAt: new Date(data.followUpDue),
        type: "CALL",
        priority: scoring.score >= 75 ? "HIGH" : "MEDIUM",
        notes: `Initial follow-up call with ${lead.studentName}`,
      },
    });
  }

  // Trigger automations asynchronously
  runAutomationsForLead(lead.id, "LEAD_CREATED").catch(console.error);

  return lead;
}

export async function updateLead(id: string, data: any, updatedByUserId?: string | null) {
  const existing = await prisma.lead.findUnique({
    where: { id },
    include: { course: true, notes: true, activities: true, followUps: true },
  });

  if (!existing) throw new Error("Lead not found");

  const statusChanged = data.status && data.status !== existing.status;
  const newStatus = data.status || existing.status;

  // Re-compute score
  const scoring = computeLeadScore({
    leadSource: data.leadSource || existing.leadSource,
    status: newStatus,
    createdAt: existing.createdAt,
    courseDegree: existing.course?.degree,
    phone: data.phone || existing.phone,
    email: data.email || existing.email,
    city: data.city || existing.city,
    parentPhone: data.parentPhone || existing.parentPhone,
    notesCount: existing.notes.length,
    activitiesCount: existing.activities.length,
    followUpsCount: existing.followUps.length,
  });

  const updated = await prisma.lead.update({
    where: { id },
    data: {
      ...data,
      score: scoring.score,
      scoreCategory: scoring.category,
      scoreBreakdown: JSON.stringify(scoring.breakdown),
      engagementLevel: scoring.engagementLevel,
      nextBestAction: scoring.nextBestAction,
      conversionProbability: scoring.conversionProbability,
      followUpDue: data.followUpDue ? new Date(data.followUpDue) : existing.followUpDue,
    },
    include: {
      course: true,
      assignedTo: true,
    },
  });

  // Log activity on status change
  if (statusChanged) {
    await prisma.leadActivity.create({
      data: {
        leadId: id,
        userId: updatedByUserId || null,
        type: "STATUS_CHANGE",
        title: `Status Changed to ${newStatus}`,
        description: `Lead status updated from ${existing.status} to ${newStatus}.`,
      },
    });

    // Check automation triggers
    runAutomationsForLead(id, "STATUS_CHANGED", { oldStatus: existing.status, newStatus }).catch(console.error);
  }

  return updated;
}

export async function bulkUpdateStatus(leadIds: string[], status: string, userId?: string | null) {
  const leads = await prisma.lead.findMany({ where: { id: { in: leadIds } } });
  
  for (const lead of leads) {
    await updateLead(lead.id, { status }, userId);
  }

  return { count: leads.length };
}

export async function bulkAssignLeads(leadIds: string[], assignedToId: string, userId?: string | null) {
  await prisma.lead.updateMany({
    where: { id: { in: leadIds } },
    data: { assignedToId },
  });

  const counselor = await prisma.user.findUnique({ where: { id: assignedToId } });

  for (const leadId of leadIds) {
    await prisma.leadActivity.create({
      data: {
        leadId,
        userId: userId || null,
        type: "STATUS_CHANGE",
        title: "Counselor Reassigned",
        description: `Lead reassigned to counselor ${counselor?.name || "Counselor"}.`,
      },
    });
  }

  return { count: leadIds.length };
}

export async function mergeLeads(targetLeadId: string, sourceLeadId: string, userId?: string | null) {
  const [target, source] = await Promise.all([
    prisma.lead.findUnique({ where: { id: targetLeadId } }),
    prisma.lead.findUnique({ where: { id: sourceLeadId }, include: { notes: true, activities: true, followUps: true } }),
  ]);

  if (!target || !source) throw new Error("One or both leads not found");

  // Move notes, activities, follow-ups
  await prisma.note.updateMany({ where: { leadId: sourceLeadId }, data: { leadId: targetLeadId } });
  await prisma.followUp.updateMany({ where: { leadId: sourceLeadId }, data: { leadId: targetLeadId } });
  await prisma.leadActivity.updateMany({ where: { leadId: sourceLeadId }, data: { leadId: targetLeadId } });

  // Add merge log
  await prisma.leadActivity.create({
    data: {
      leadId: targetLeadId,
      userId: userId || null,
      type: "SYSTEM_AUTOMATION",
      title: "Duplicate Lead Merged",
      description: `Merged duplicate enquiry from ${source.studentName} (${source.email}, ${source.phone}).`,
    },
  });

  // Delete source lead
  await prisma.lead.delete({ where: { id: sourceLeadId } });

  // Recalculate target score
  return updateLead(targetLeadId, {}, userId);
}

// Background Automation Evaluation
export async function runAutomationsForLead(leadId: string, triggerEvent: string, extraData?: any) {
  try {
    const automations = await prisma.automation.findMany({
      where: { isActive: true, triggerEvent },
    });

    if (!automations.length) return;

    const lead = await prisma.lead.findUnique({
      where: { id: leadId },
      include: { course: true, assignedTo: true },
    });

    if (!lead) return;

    for (const auto of automations) {
      let conditionsMet = false;
      const config = JSON.parse(auto.conditionConfig || "{}");

      if (triggerEvent === "LEAD_CREATED") {
        conditionsMet = true;
      } else if (triggerEvent === "SCORE_ABOVE") {
        if (lead.score >= (config.threshold || 80)) conditionsMet = true;
      } else if (triggerEvent === "STATUS_CHANGED") {
        if (!config.targetStatus || config.targetStatus === lead.status) conditionsMet = true;
      }

      if (conditionsMet) {
        // Execute Action
        let message = `Triggered ${auto.actionType} for lead ${lead.studentName}`;
        if (auto.actionType === "NOTIFY_COUNSELOR" && lead.assignedToId) {
          await prisma.notification.create({
            data: {
              userId: lead.assignedToId,
              title: `Automation Alert: ${auto.name}`,
              message: `Lead ${lead.studentName} reached score ${lead.score}.`,
              type: "AUTOMATION",
              link: `/leads/${lead.id}`,
            },
          });
        }

        // Record log
        await prisma.automationLog.create({
          data: {
            automationId: auto.id,
            leadId: lead.id,
            status: "SUCCESS",
            message,
          },
        });

        await prisma.automation.update({
          where: { id: auto.id },
          data: {
            executionCount: { increment: 1 },
            lastRunAt: new Date(),
          },
        });
      }
    }
  } catch (err) {
    console.error("Error executing lead automations:", err);
  }
}
