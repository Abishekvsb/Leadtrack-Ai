import { prisma } from "@/lib/prisma";
import { UserSession } from "@/lib/types";

export interface DashboardStatsParams {
  range?: "today" | "7d" | "30d" | "all";
  startDate?: string;
  endDate?: string;
}

export async function getDashboardStats(params: DashboardStatsParams, user?: UserSession | null) {
  const { range = "30d", startDate, endDate } = params;

  const now = new Date();
  let rangeStart = new Date(now.getTime() - 30 * 24 * 3600 * 1000);

  if (range === "today") {
    rangeStart = new Date();
    rangeStart.setHours(0, 0, 0, 0);
  } else if (range === "7d") {
    rangeStart = new Date(now.getTime() - 7 * 24 * 3600 * 1000);
  } else if (range === "30d") {
    rangeStart = new Date(now.getTime() - 30 * 24 * 3600 * 1000);
  } else if (range === "all") {
    rangeStart = new Date(0);
  }

  if (startDate) {
    rangeStart = new Date(startDate);
  }

  const rangeEnd = endDate ? new Date(endDate) : new Date();
  rangeEnd.setHours(23, 59, 59, 999);

  // Counselor scoping if counselor
  const userFilter = user && user.role === "COUNSELOR" ? { assignedToId: user.id } : {};

  // Fetch leads within range and total leads
  const [allLeads, leadsInRange] = await Promise.all([
    prisma.lead.findMany({
      where: { ...userFilter },
      select: {
        id: true,
        status: true,
        score: true,
        scoreCategory: true,
        leadSource: true,
        courseId: true,
        course: { select: { name: true, code: true, fee: true } },
        assignedToId: true,
        assignedTo: { select: { name: true } },
        createdAt: true,
        followUpDue: true,
      },
    }),
    prisma.lead.findMany({
      where: {
        ...userFilter,
        createdAt: { gte: rangeStart, lte: rangeEnd },
      },
      select: {
        id: true,
        status: true,
        score: true,
        scoreCategory: true,
        leadSource: true,
        courseId: true,
        course: { select: { name: true, code: true, fee: true } },
        assignedToId: true,
        assignedTo: { select: { name: true } },
        createdAt: true,
      },
    }),
  ]);

  // Today start
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  // 1. KPI Cards
  const totalLeads = allLeads.length;
  const newToday = allLeads.filter((l) => new Date(l.createdAt) >= todayStart).length;
  const hotLeads = allLeads.filter((l) => l.scoreCategory === "HOT").length;
  const admissionsConfirmed = allLeads.filter((l) => l.status === "ADMITTED").length;
  const conversionRate = totalLeads > 0 ? ((admissionsConfirmed / totalLeads) * 100).toFixed(1) : "0.0";

  // Follow-ups due today / overdue
  const followUpsDue = await prisma.followUp.count({
    where: {
      status: "PENDING",
      scheduledAt: { lte: rangeEnd },
      ...(user && user.role === "COUNSELOR" ? { assignedToId: user.id } : {}),
    },
  });

  // 2. Generate Leads Over Time (Area Chart)
  // Group by day for the selected window (default 14-30 days)
  const daysCount = range === "today" ? 1 : range === "7d" ? 7 : 30;
  const leadsOverTimeMap: Record<string, { date: string; leads: number; admitted: number }> = {};

  for (let i = daysCount - 1; i >= 0; i--) {
    const d = new Date(now.getTime() - i * 24 * 3600 * 1000);
    const key = d.toISOString().split("T")[0];
    const displayLabel = d.toLocaleDateString("en-IN", { month: "short", day: "numeric" });
    leadsOverTimeMap[key] = { date: displayLabel, leads: 0, admitted: 0 };
  }

  allLeads.forEach((l) => {
    const key = new Date(l.createdAt).toISOString().split("T")[0];
    if (leadsOverTimeMap[key]) {
      leadsOverTimeMap[key].leads += 1;
      if (l.status === "ADMITTED") leadsOverTimeMap[key].admitted += 1;
    }
  });

  const leadsOverTime = Object.values(leadsOverTimeMap);

  // 3. Lead Source Performance (Bar Chart)
  const sourceCounts: Record<string, { source: string; total: number; admitted: number }> = {};
  allLeads.forEach((l) => {
    const src = l.leadSource || "Other";
    if (!sourceCounts[src]) {
      sourceCounts[src] = { source: src, total: 0, admitted: 0 };
    }
    sourceCounts[src].total += 1;
    if (l.status === "ADMITTED") sourceCounts[src].admitted += 1;
  });
  const sourcePerformance = Object.values(sourceCounts).sort((a, b) => b.total - a.total);

  // 4. Conversion Funnel
  const funnelStages = [
    { stage: "New Enquiry", status: "NEW", count: 0, fill: "#D62828" },
    { stage: "Contacted", status: "CONTACTED", count: 0, fill: "#E63946" },
    { stage: "Interested", status: "INTERESTED", count: 0, fill: "#F77F00" },
    { stage: "Campus Visit", status: "CAMPUS_VISIT", count: 0, fill: "#FFC21A" },
    { stage: "Application", status: "APPLICATION_SUBMITTED", count: 0, fill: "#D4A017" },
    { stage: "Admitted", status: "ADMITTED", count: 0, fill: "#10B981" },
  ];

  funnelStages.forEach((item) => {
    item.count = allLeads.filter((l) => l.status === item.status).length;
  });

  // Cumulative funnel logic
  let cumulative = totalLeads;
  const funnelData = funnelStages.map((st, idx) => {
    const pct = totalLeads > 0 ? Math.round((st.count / totalLeads) * 100) : 0;
    return {
      ...st,
      percentage: pct,
    };
  });

  // 5. Course-wise Interest (Donut Chart)
  const courseCounts: Record<string, { name: string; count: number; fee: number }> = {};
  allLeads.forEach((l) => {
    const name = l.course?.name || "General / Undecided";
    if (!courseCounts[name]) {
      courseCounts[name] = { name, count: 0, fee: l.course?.fee || 0 };
    }
    courseCounts[name].count += 1;
  });
  const courseInterest = Object.values(courseCounts)
    .sort((a, b) => b.count - a.count)
    .slice(0, 6);

  // 6. Counselor Performance
  const counselorMap: Record<string, { name: string; assigned: number; contacted: number; admitted: number }> = {};
  allLeads.forEach((l) => {
    const name = l.assignedTo?.name || "Unassigned";
    if (!counselorMap[name]) {
      counselorMap[name] = { name, assigned: 0, contacted: 0, admitted: 0 };
    }
    counselorMap[name].assigned += 1;
    if (l.status !== "NEW") counselorMap[name].contacted += 1;
    if (l.status === "ADMITTED") counselorMap[name].admitted += 1;
  });
  const counselorPerformance = Object.values(counselorMap).sort((a, b) => b.admitted - a.admitted);

  // 7. Today's Follow-up Tasks Widget
  const todayEnd = new Date();
  todayEnd.setHours(23, 59, 59, 999);
  const todayFollowUps = await prisma.followUp.findMany({
    where: {
      status: "PENDING",
      scheduledAt: { lte: todayEnd },
      ...(user && user.role === "COUNSELOR" ? { assignedToId: user.id } : {}),
    },
    include: {
      lead: { select: { id: true, studentName: true, phone: true, email: true, scoreCategory: true } },
    },
    orderBy: { scheduledAt: "asc" },
    take: 8,
  });

  // 8. Recent Activity Feed
  const recentActivities = await prisma.leadActivity.findMany({
    take: 8,
    orderBy: { createdAt: "desc" },
    include: {
      lead: { select: { id: true, studentName: true } },
      user: { select: { name: true, avatar: true } },
    },
  });

  // 9. Top Hot Leads List
  const topHotLeads = await prisma.lead.findMany({
    where: {
      scoreCategory: "HOT",
      status: { notIn: ["ADMITTED", "LOST"] },
      ...(user && user.role === "COUNSELOR" ? { assignedToId: user.id } : {}),
    },
    orderBy: { score: "desc" },
    take: 6,
    include: {
      course: { select: { name: true, code: true } },
      assignedTo: { select: { name: true } },
    },
  });

  // 10. Engagement Heatmap (Days of week vs Hours of day)
  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const heatmapData = daysOfWeek.map((day, dIdx) => {
    return {
      day,
      morning: allLeads.filter((l) => {
        const d = new Date(l.createdAt);
        return d.getDay() === dIdx && d.getHours() >= 9 && d.getHours() < 13;
      }).length,
      afternoon: allLeads.filter((l) => {
        const d = new Date(l.createdAt);
        return d.getDay() === dIdx && d.getHours() >= 13 && d.getHours() < 17;
      }).length,
      evening: allLeads.filter((l) => {
        const d = new Date(l.createdAt);
        return d.getDay() === dIdx && d.getHours() >= 17 && d.getHours() <= 21;
      }).length,
    };
  });

  // Sparklines for KPI cards (last 7 days counts)
  const sparklineMap: Record<string, number> = {};
  for (let i = 6; i >= 0; i--) {
    const d = new Date(now.getTime() - i * 24 * 3600 * 1000);
    sparklineMap[d.toISOString().split("T")[0]] = 0;
  }
  allLeads.forEach((l) => {
    const key = new Date(l.createdAt).toISOString().split("T")[0];
    if (sparklineMap[key] !== undefined) sparklineMap[key] += 1;
  });
  const sparklineData = Object.values(sparklineMap);

  // Compute onboarding checklist status dynamically
  const [institution, coursesCount, staffCount, invitesCount, activeAutomationsCount] = await Promise.all([
    prisma.institution.findFirst(),
    prisma.course.count(),
    prisma.user.count({ where: { role: { in: ["COUNSELOR", "MANAGER"] } } }),
    prisma.userInvite.count(),
    prisma.automation.count({ where: { isActive: true } }),
  ]);

  const onboardingSteps = [
    {
      id: "institution",
      title: "Add institution details",
      description: "Set official college name, campus address, website & branding",
      href: "/settings",
      completed: !!(institution && institution.name && (institution.website || institution.address || institution.phone || institution.city)),
    },
    {
      id: "courses",
      title: "Add courses & degrees",
      description: "Configure intake capacity, annual tuition fees & eligibility",
      href: "/courses",
      completed: coursesCount > 0,
    },
    {
      id: "counselors",
      title: "Invite admissions counselors",
      description: "Send invite links so counselors can log calls and guide students",
      href: "/team",
      completed: staffCount > 0 || invitesCount > 0,
    },
    {
      id: "shareEnquiry",
      title: "Share public enquiry form",
      description: "Publish your enquiry link on your website or social media campaigns",
      href: "/enquire",
      isExternal: true,
      completed: totalLeads > 0,
    },
    {
      id: "automations",
      title: "Enable automated follow-up recipes",
      description: "Activate 2-day SLA email check-ins and hot lead notifications",
      href: "/automations",
      completed: activeAutomationsCount > 0,
    },
  ];

  const completedCount = onboardingSteps.filter((s) => s.completed).length;
  const progressPercent = Math.round((completedCount / onboardingSteps.length) * 100);
  const showOnboarding = totalLeads === 0 || completedCount < onboardingSteps.length;

  return {
    kpis: {
      totalLeads: {
        value: totalLeads,
        trend: totalLeads > 0 ? "+100%" : "0%",
        isPositive: true,
        sparkline: sparklineData,
      },
      newToday: {
        value: newToday,
        trend: newToday > 0 ? `+${newToday}` : "0",
        isPositive: true,
        sparkline: sparklineData,
      },
      hotLeads: {
        value: hotLeads,
        trend: hotLeads > 0 ? `+${hotLeads}` : "0",
        isPositive: true,
        sparkline: sparklineData,
      },
      followUpsDue: {
        value: followUpsDue,
        trend: followUpsDue > 0 ? `${followUpsDue} due` : "0",
        isPositive: followUpsDue === 0,
        sparkline: sparklineData,
      },
      admissionsConfirmed: {
        value: admissionsConfirmed,
        trend: admissionsConfirmed > 0 ? `+${admissionsConfirmed}` : "0",
        isPositive: true,
        sparkline: sparklineData,
      },
      conversionRate: {
        value: `${conversionRate}%`,
        trend: Number(conversionRate) > 0 ? `${conversionRate}%` : "0%",
        isPositive: true,
        sparkline: sparklineData,
      },
    },
    onboarding: {
      steps: onboardingSteps,
      completedCount,
      totalSteps: onboardingSteps.length,
      progressPercent,
      isComplete: completedCount === onboardingSteps.length,
      showOnboarding,
    },
    leadsOverTime,
    sourcePerformance,
    funnelData,
    courseInterest,
    counselorPerformance,
    todayFollowUps,
    recentActivities,
    topHotLeads,
    heatmapData,
  };
}
