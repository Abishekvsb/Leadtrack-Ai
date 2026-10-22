import { prisma } from "@/lib/prisma";
import { UserSession } from "@/lib/types";
import { normalizeEmail, normalizePhone, formatDate } from "@/lib/utils";

export interface CopilotToolResult {
  toolName: string;
  data: any;
  summary: string;
}

// 1. Role-scoped live DB query tools
export async function getTodaysFollowUps(session: UserSession): Promise<CopilotToolResult> {
  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);

  const where: any = {
    status: "PENDING",
    scheduledAt: { gte: startOfDay, lte: endOfDay },
  };
  if (session.role === "COUNSELOR") {
    where.assignedToId = session.id;
  }

  const tasks = await prisma.followUp.findMany({
    where,
    orderBy: { scheduledAt: "asc" },
    include: {
      lead: { select: { id: true, studentName: true, phone: true, score: true, scoreCategory: true } },
    },
    take: 15,
  });

  return {
    toolName: "getTodaysFollowUps",
    data: tasks,
    summary: `Found ${tasks.length} follow-up task(s) scheduled for today.`,
  };
}

export async function getHotLeads(session: UserSession): Promise<CopilotToolResult> {
  const where: any = {
    scoreCategory: "HOT",
    status: { notIn: ["ADMITTED", "LOST"] },
  };
  if (session.role === "COUNSELOR") {
    where.assignedToId = session.id;
  }

  const leads = await prisma.lead.findMany({
    where,
    orderBy: { score: "desc" },
    take: 10,
    include: {
      course: { select: { name: true } },
      assignedTo: { select: { name: true } },
    },
  });

  return {
    toolName: "getHotLeads",
    data: leads,
    summary: `Found ${leads.length} high-intent lead(s) with AI score >= 75.`,
  };
}

export async function getOverdueFollowUps(session: UserSession): Promise<CopilotToolResult> {
  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const where: any = {
    status: "PENDING",
    scheduledAt: { lt: startOfDay },
  };
  if (session.role === "COUNSELOR") {
    where.assignedToId = session.id;
  }

  const overdue = await prisma.followUp.findMany({
    where,
    orderBy: { scheduledAt: "asc" },
    take: 10,
    include: {
      lead: { select: { id: true, studentName: true, phone: true, score: true } },
    },
  });

  return {
    toolName: "getOverdueFollowUps",
    data: overdue,
    summary: `Found ${overdue.length} overdue follow-up task(s) needing immediate attention.`,
  };
}

export async function getLeadByNameOrPhone(session: UserSession, search: string): Promise<CopilotToolResult> {
  const cleanPhone = normalizePhone(search);
  const where: any = {
    OR: [
      { studentName: { contains: search, mode: "insensitive" } },
      { email: { contains: search, mode: "insensitive" } },
      cleanPhone && cleanPhone.length >= 4 ? { phone: { contains: cleanPhone.slice(-6) } } : { phone: { contains: search } },
    ],
  };

  if (session.role === "COUNSELOR") {
    where.assignedToId = session.id;
  }

  const leads = await prisma.lead.findMany({
    where,
    take: 5,
    include: {
      course: { select: { name: true } },
      assignedTo: { select: { name: true } },
    },
  });

  return {
    toolName: "getLeadByNameOrPhone",
    data: leads,
    summary: `Found ${leads.length} lead(s) matching query "${search}".`,
  };
}

export async function getFunnelStats(session: UserSession): Promise<CopilotToolResult> {
  const userFilter = session.role === "COUNSELOR" ? { assignedToId: session.id } : {};
  const [total, stages] = await Promise.all([
    prisma.lead.count({ where: userFilter }),
    prisma.lead.groupBy({
      by: ["status"],
      where: userFilter,
      _count: { _all: true },
    }),
  ]);

  const funnel = stages.map((s) => ({
    status: s.status,
    count: s._count._all,
    percentage: total > 0 ? Math.round((s._count._all / total) * 100) : 0,
  }));

  return {
    toolName: "getFunnelStats",
    data: { totalLeads: total, stages: funnel },
    summary: `Pipeline total: ${total} lead(s) across stages.`,
  };
}

export async function getSourcePerformance(session: UserSession): Promise<CopilotToolResult> {
  const userFilter = session.role === "COUNSELOR" ? { assignedToId: session.id } : {};
  const sources = await prisma.lead.groupBy({
    by: ["leadSource"],
    where: userFilter,
    _count: { _all: true },
    orderBy: { _count: { leadSource: "desc" } },
  });

  return {
    toolName: "getSourcePerformance",
    data: sources.map((s) => ({ source: s.leadSource, count: s._count._all })),
    summary: `Found data across ${sources.length} acquisition source(s).`,
  };
}

export async function getCourseDemand(session: UserSession, courseQuery?: string): Promise<CopilotToolResult> {
  const userFilter = session.role === "COUNSELOR" ? { assignedToId: session.id } : {};
  const courses = await prisma.course.findMany({
    where: courseQuery ? { name: { contains: courseQuery, mode: "insensitive" } } : {},
    select: {
      id: true,
      name: true,
      code: true,
      fee: true,
      seats: true,
      _count: {
        select: { leads: { where: userFilter } },
      },
    },
    orderBy: { leads: { _count: "desc" } },
  });

  return {
    toolName: "getCourseDemand",
    data: courses.map((c) => ({
      name: c.name,
      code: c.code,
      inquiries: c._count.leads,
      seats: c.seats,
      fee: c.fee,
    })),
    summary: `Found ${courses.length} course(s).`,
  };
}

export async function getCounselorPerformance(session: UserSession): Promise<CopilotToolResult> {
  // If counselor, only show their own
  const userWhere = session.role === "COUNSELOR" ? { id: session.id } : { role: { in: ["COUNSELOR", "MANAGER"] } };

  const users = await prisma.user.findMany({
    where: userWhere,
    select: {
      id: true,
      name: true,
      role: true,
      _count: {
        select: {
          leads: true,
          followUps: { where: { status: "COMPLETED" } },
        },
      },
    },
  });

  return {
    toolName: "getCounselorPerformance",
    data: users.map((u) => ({
      name: u.name,
      role: u.role,
      assignedLeads: u._count.leads,
      completedFollowUps: u._count.followUps,
    })),
    summary: `Performance data for ${users.length} staff member(s).`,
  };
}

export async function getConversionBottleneck(session: UserSession): Promise<CopilotToolResult> {
  const userFilter = session.role === "COUNSELOR" ? { assignedToId: session.id } : {};
  const [lostCount, lostReasons, total] = await Promise.all([
    prisma.lead.count({ where: { ...userFilter, status: "LOST" } }),
    prisma.lead.findMany({
      where: { ...userFilter, status: "LOST" },
      select: { lostReason: true },
    }),
    prisma.lead.count({ where: userFilter }),
  ]);

  const reasonsMap: Record<string, number> = {};
  lostReasons.forEach((l) => {
    const r = l.lostReason || "Unspecified";
    reasonsMap[r] = (reasonsMap[r] || 0) + 1;
  });

  return {
    toolName: "getConversionBottleneck",
    data: {
      totalLeads: total,
      lostLeads: lostCount,
      dropOffRate: total > 0 ? ((lostCount / total) * 100).toFixed(1) + "%" : "0%",
      reasons: reasonsMap,
    },
    summary: `Analyzed ${lostCount} lost lead(s) out of ${total} total inquiries.`,
  };
}

export async function getAutomationStatus(): Promise<CopilotToolResult> {
  const [total, active, recentLogs] = await Promise.all([
    prisma.automation.count(),
    prisma.automation.count({ where: { isActive: true } }),
    prisma.automationLog.findMany({
      orderBy: { executedAt: "desc" },
      take: 5,
      include: { automation: { select: { name: true } } },
    }),
  ]);

  return {
    toolName: "getAutomationStatus",
    data: { total, active, recentLogs },
    summary: `Automation engine: ${active} active recipes of ${total} configured.`,
  };
}

export async function getNewLeadsCount(session: UserSession, days = 7): Promise<CopilotToolResult> {
  const userFilter = session.role === "COUNSELOR" ? { assignedToId: session.id } : {};
  const since = new Date(Date.now() - days * 24 * 3600 * 1000);
  const count = await prisma.lead.count({
    where: {
      ...userFilter,
      createdAt: { gte: since },
    },
  });

  return {
    toolName: "getNewLeadsCount",
    data: { count, days },
    summary: `${count} new lead(s) captured in the last ${days} day(s).`,
  };
}

// 2. Built-in App Knowledge Base
export const APP_KNOWLEDGE_BASE: Record<string, { answer: string; link?: string; linkText?: string }> = {
  add_lead: {
    answer:
      "To add a new student lead manually:\n1. Navigate to the **[Leads Queue](/leads)** page.\n2. Click the **+ Add Lead** button in the top right.\n3. Fill in the student's name, phone, email, and intended course.\n4. Save. The lead will immediately be scored by AI and placed in the pipeline.",
    link: "/leads",
    linkText: "Open Leads Queue",
  },
  lead_scoring: {
    answer:
      "**How LeadTrack AI Scoring Works (0–100):**\n• **Acquisition Source (30%):** Walk-ins and Referrals receive higher intent scores than cold ad clicks.\n• **Progression & Engagement (25%):** Each phone call, campus tour, or note adds engagement points.\n• **Response Speed (25%):** Recent inquiries receive an active boost; unresponsive leads degrade over time.\n• **Profile Completeness (20%):** Verified email, alternate guardian phone, and city boost the score.\n\nLeads are categorized as **HOT (>=75)**, **WARM (45-74)**, or **COLD (<45)**.",
    link: "/settings?tab=scoring",
    linkText: "View Scoring Weights",
  },
  create_automation: {
    answer:
      "To enable or create automations:\n1. Go to the **[Automation Rules](/automation)** page.\n2. Choose from pre-built recipes (like the 2-Day Inactivity SLA, Hot Lead Instant Alert, or Campus Visit confirmations).\n3. Toggle the status switch to **Active** to start executing automated follow-ups.",
    link: "/automation",
    linkText: "Manage Automations",
  },
  import_csv: {
    answer:
      "To import leads in bulk via CSV or Excel:\n1. Go to the **[Leads Queue](/leads)**.\n2. Click the **Import CSV** button.\n3. Download our sample spreadsheet template.\n4. Upload your file. Our engine validates phone/email duplicates before saving to prevent duplicate student profiles.",
    link: "/leads",
    linkText: "Go to Leads Import",
  },
  share_enquiry: {
    answer:
      "To capture student queries online:\n• Direct public portal: **[Open Public Enquiry Form](/enquire)**.\n• You can embed this form on your college website or paste the link in your social media bios and WhatsApp promotional campaigns. Leads flow directly into LeadTrack AI with zero delay.",
    link: "/enquire",
    linkText: "Preview Enquiry Portal",
  },
  invite_counselor: {
    answer:
      "To invite new staff or counselors:\n1. Open the **[Counselor Team](/team)** page (Admin / Manager access).\n2. Click **Invite Team Member**.\n3. Enter their institutional email and assigned role.\n4. Copy the secure 7-day invite link to share with them so they can set their password.",
    link: "/team",
    linkText: "Invite Staff on Team Page",
  },
};

// 3. Match Knowledge Base queries
export function checkKnowledgeBase(query: string) {
  const q = query.toLowerCase();
  if (q.includes("add a lead") || q.includes("add lead") || q.includes("create lead") || q.includes("new lead")) {
    return APP_KNOWLEDGE_BASE.add_lead;
  }
  if (q.includes("scoring work") || q.includes("score work") || q.includes("why this score") || q.includes("ai score")) {
    return APP_KNOWLEDGE_BASE.lead_scoring;
  }
  if (q.includes("create automation") || q.includes("how automation") || q.includes("set automation") || q.includes("enable automation")) {
    return APP_KNOWLEDGE_BASE.create_automation;
  }
  if (q.includes("import csv") || q.includes("bulk upload") || q.includes("import lead") || q.includes("upload excel")) {
    return APP_KNOWLEDGE_BASE.import_csv;
  }
  if (q.includes("share enquiry") || q.includes("enquiry form") || q.includes("public form") || q.includes("student form")) {
    return APP_KNOWLEDGE_BASE.share_enquiry;
  }
  if (q.includes("invite") || q.includes("add counselor") || q.includes("new team") || q.includes("add staff")) {
    return APP_KNOWLEDGE_BASE.invite_counselor;
  }
  return null;
}

// 4. Check for Unrelated Queries
export function isUnrelatedQuery(query: string): boolean {
  const q = query.toLowerCase().trim();
  const allowedKeywords = [
    "lead", "counselor", "follow", "call", "task", "student", "pipeline", "admission",
    "enquiry", "inquiry", "course", "fee", "program", "score", "hot", "warm", "cold",
    "automation", "template", "analytics", "roi", "team", "settings", "how", "what",
    "who", "which", "overdue", "status", "bottleneck", "audit", "b.tech", "mba", "drop",
    "convert", "conversion", "today", "yesterday", "week", "month", "help", "guide"
  ];

  // If query is long and has zero allowed keywords, flag as unrelated
  const words = q.split(/\s+/);
  const matchCount = words.filter((w) => allowedKeywords.some((k) => w.includes(k))).length;
  if (words.length > 2 && matchCount === 0) {
    return true;
  }

  // Common off-topic triggers
  const offTopicTriggers = [
    "weather", "recipe", "poem", "joke", "code python", "write a story", "capital of",
    "who is the president", "movie", "song", "crypto", "bitcoin", "football", "cricket score"
  ];
  return offTopicTriggers.some((t) => q.includes(t));
}

// 5. Rule-Based Intent Engine (Instant, Reliable, Grounded Live DB)
export async function executeRuleBasedCopilot(query: string, session: UserSession): Promise<string> {
  const q = query.toLowerCase();

  // Knowledge base check
  const kbMatch = checkKnowledgeBase(query);
  if (kbMatch) {
    let out = kbMatch.answer;
    if (kbMatch.link) {
      out += `\n\n👉 **[${kbMatch.linkText || "Go to Page"}](${kbMatch.link})**`;
    }
    return out;
  }

  // Check if unrelated
  if (isUnrelatedQuery(query)) {
    return (
      "I am specifically designed to assist with **LeadTrack AI** admissions management, counselor tasks, and enrollment analytics. " +
      "I cannot answer off-topic questions. How can I help you manage your student leads today?"
    );
  }

  // Today's calls
  if (q.includes("call today") || q.includes("today") || (q.includes("who") && q.includes("call"))) {
    const res = await getTodaysFollowUps(session);
    const tasks = res.data;
    if (tasks.length === 0) {
      return (
        "📞 **Today's Follow-up Calls:**\n\nYou have **0 pending follow-up calls** scheduled for today! 🎉\n\n" +
        "• To schedule new calls, open any candidate from the **[Leads Queue](/leads)**.\n" +
        "• Or check **[Overdue Tasks](/follow-ups)** to clear backlogged follow-ups."
      );
    }
    return (
      `📞 **Today's Scheduled Calls (${tasks.length}):**\n\n` +
      tasks
        .map(
          (t: any, i: number) =>
            `${i + 1}. **[${t.lead.studentName}](/leads/${t.lead.id})** (AI Score: **${t.lead.score}/100**)\n` +
            `   • Phone: \`${t.lead.phone}\`\n` +
            `   • Scheduled: *${formatDate(t.scheduledAt)}*\n` +
            `   • Note: ${t.notes || "Follow-up discussion"}\n` +
            `   • [Open Lead Dossier](/leads/${t.lead.id})`
        )
        .join("\n\n")
    );
  }

  // Overdue
  if (q.includes("overdue") || q.includes("missed") || q.includes("pending call")) {
    const res = await getOverdueFollowUps(session);
    const tasks = res.data;
    if (tasks.length === 0) {
      return "✅ **No Overdue Tasks:** All counselor follow-ups are up to date! Great job staying within response SLAs.";
    }
    return (
      `⚠️ **Overdue Follow-ups Requiring Immediate Outreach (${tasks.length}):**\n\n` +
      tasks
        .map(
          (t: any, i: number) =>
            `${i + 1}. **[${t.lead.studentName}](/leads/${t.lead.id})** — Due: ${formatDate(t.scheduledAt)}\n` +
            `   • Phone: \`${t.lead.phone}\` (Score: ${t.lead.score}/100)\n` +
            `   • [Open Lead Dossier](/leads/${t.lead.id})`
        )
        .join("\n\n")
    );
  }

  // Hot leads
  if (q.includes("hot") || q.includes("high score") || q.includes("priority lead") || q.includes("high intent")) {
    const res = await getHotLeads(session);
    const leads = res.data;
    if (leads.length === 0) {
      return (
        "🔥 **Hot Leads (Score >= 75):**\n\nThere are currently **0 leads categorized as HOT**.\n\n" +
        "As candidates interact with WhatsApp messages, visit campus, or submit applications, their scores will automatically elevate into this tier."
      );
    }
    return (
      `🔥 **Top High-Intent Leads (${leads.length}):**\n\n` +
      leads
        .map(
          (l: any, i: number) =>
            `${i + 1}. **[${l.studentName}](/leads/${l.id})** — Score: **${l.score}/100 (HOT)**\n` +
            `   • Program: ${l.course?.name || "General Program"}\n` +
            `   • Counselor: ${l.assignedTo?.name || "Unassigned"}\n` +
            `   • Next Action: *${l.nextBestAction || "Call student to introduce admissions process"}*\n` +
            `   • [Open Lead Dossier](/leads/${l.id})`
        )
        .join("\n\n")
    );
  }

  // Source performance / best leads
  if (q.includes("source") || q.includes("best lead") || q.includes("channel") || q.includes("where do leads")) {
    const res = await getSourcePerformance(session);
    const sources = res.data;
    if (sources.length === 0) {
      return "📊 **Source Performance:** No lead sources recorded yet. Share your enquiry form to capture prospective students.";
    }
    const topSource = sources[0];
    return (
      `📊 **Lead Acquisition Channel Performance:**\n\n` +
      sources.map((s: any) => `• **${s.source}**: ${s.count} enquiries`).join("\n") +
      `\n\n💡 **Top Contributing Channel:** **${topSource?.source || "Website"}** accounts for the highest volume of inquiries.`
    );
  }

  // Funnel / conversion rate
  if (q.includes("conversion") || q.includes("funnel") || q.includes("rate") || q.includes("stage")) {
    const res = await getFunnelStats(session);
    const { totalLeads, stages } = res.data;
    if (totalLeads === 0) {
      return "📈 **Pipeline Funnel:** Total enquiries is currently 0. Once students enquire, stage conversion tracking will appear here.";
    }
    return (
      `📈 **Pipeline Stage Distribution (Total: ${totalLeads} enquiries):**\n\n` +
      stages.map((s: any) => `• **${s.status}**: ${s.count} (${s.percentage}%)`).join("\n") +
      `\n\n👉 **[Open Pipeline Kanban](/pipeline)**`
    );
  }

  // Course demand
  if (q.includes("course") || q.includes("degree") || q.includes("b.tech") || q.includes("mba") || q.includes("program")) {
    const res = await getCourseDemand(session);
    const courses = res.data;
    if (courses.length === 0) {
      return "🎓 **Course Demand:** No academic programs found. Add courses in **[Settings > Courses](/settings?tab=courses)**.";
    }
    return (
      `🎓 **Academic Program Demand:**\n\n` +
      courses
        .map(
          (c: any, i: number) =>
            `${i + 1}. **${c.name}** (\`${c.code}\`)\n   • Inquiries: **${c.inquiries}** | Seats: **${c.seats}**`
        )
        .join("\n\n")
    );
  }

  // Counselor performance
  if (q.includes("counselor") || q.includes("team") || q.includes("caseload") || q.includes("workload")) {
    const res = await getCounselorPerformance(session);
    const counselors = res.data;
    if (counselors.length === 0) {
      return "👥 **Counselor Team:** No counselors found. Invite team members in **[Counselor Team](/team)**.";
    }
    return (
      `👥 **Counselor Performance & Caseloads:**\n\n` +
      counselors
        .map(
          (c: any, i: number) =>
            `${i + 1}. **${c.name}** (${c.role})\n   • Assigned Leads: **${c.assignedLeads}**\n   • Completed Tasks: **${c.completedFollowUps}**`
        )
        .join("\n\n")
    );
  }

  // Conversion bottleneck
  if (q.includes("bottleneck") || q.includes("drop") || q.includes("lost reason")) {
    const res = await getConversionBottleneck(session);
    const { totalLeads, lostLeads, dropOffRate, reasons } = res.data;
    const reasonsEntries = Object.entries(reasons);
    return (
      `⚠️ **Admissions Conversion Diagnosis:**\n\n` +
      `• Total Inquiries: **${totalLeads}**\n` +
      `• Drop-off Count: **${lostLeads}** (${dropOffRate})\n` +
      (reasonsEntries.length > 0
        ? `\n**Top Causes of Lost Queries:**\n` +
          reasonsEntries.map(([r, c]) => `• ${r}: **${c}**`).join("\n")
        : `\n• No lost queries logged yet.`)
    );
  }

  // Automation status
  if (q.includes("automation") || q.includes("sla") || q.includes("recipe")) {
    const res = await getAutomationStatus();
    const { total, active } = res.data;
    return (
      `⚡ **SLA Automation Health:**\n\n` +
      `• Total Configured: **${total} recipes**\n` +
      `• Currently Active: **${active} recipes**\n\n` +
      `👉 **[Manage Automation Rules](/automation)**`
    );
  }

  // Default overview
  const [funnelRes, hotRes, tasksRes] = await Promise.all([
    getFunnelStats(session),
    getHotLeads(session),
    getTodaysFollowUps(session),
  ]);

  return (
    `👋 **LeadTrack AI Counselor Assistant:**\n\n` +
    `Here is your real-time pipeline status:\n` +
    `• **Total Inquiries:** ${funnelRes.data.totalLeads}\n` +
    `• **Hot Priority Leads:** ${hotRes.data.length}\n` +
    `• **Today's Follow-up Calls:** ${tasksRes.data.length}\n\n` +
    `**Suggested questions you can ask me:**\n` +
    `• *"Which leads should I call today?"*\n` +
    `• *"Show overdue follow-ups"*\n` +
    `• *"Which source gives the best leads?"*\n` +
    `• *"What is our conversion rate?"*\n` +
    `• *"How do I import leads?"*`
  );
}
