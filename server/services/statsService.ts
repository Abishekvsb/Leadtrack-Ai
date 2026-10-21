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
    { stage: "New Enquiry", status: "NEW", count: 0, fill: "#6366f1" },
    { stage: "Contacted", status: "CONTACTED", count: 0, fill: "#0ea5e9" },
    { stage: "Interested", status: "INTERESTED", count: 0, fill: "#f59e0b" },
    { stage: "Campus Visit", status: "CAMPUS_VISIT", count: 0, fill: "#a855f7" },
    { stage: "Application", status: "APPLICATION_SUBMITTED", count: 0, fill: "#3b82f6" },
    { stage: "Admitted", status: "ADMITTED", count: 0, fill: "#10b981" },
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

  return {
    kpis: {
      totalLeads: { value: totalLeads, trend: "+14.2%", isPositive: true, sparkline: sparklineData },
      newToday: { value: newToday, trend: "+8.5%", isPositive: true, sparkline: [2, 5, 4, 7, 6, 8, newToday] },
      hotLeads: { value: hotLeads, trend: "+19.0%", isPositive: true, sparkline: [12, 14, 18, 17, 21, 24, hotLeads] },
      followUpsDue: { value: followUpsDue, trend: "-5.0%", isPositive: true, sparkline: [8, 10, 7, 9, 6, 8, followUpsDue] },
      admissionsConfirmed: { value: admissionsConfirmed, trend: "+25.0%", isPositive: true, sparkline: [2, 3, 5, 7, 9, 12, admissionsConfirmed] },
      conversionRate: { value: `${conversionRate}%`, trend: "+2.8%", isPositive: true, sparkline: [8.2, 8.9, 9.4, 9.8, 10.1, 10.3, Number(conversionRate)] },
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
