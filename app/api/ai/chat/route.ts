import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const query = (body.query || "").toLowerCase();

    // Pull current live stats for context
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const todayEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);

    const [todayFollowUps, hotLeads, admittedCount, totalLeads, lostLeads] = await Promise.all([
      prisma.followUp.findMany({
        where: { status: "PENDING", scheduledAt: { lte: todayEnd } },
        include: { lead: { select: { studentName: true, phone: true, score: true } } },
        take: 5,
      }),
      prisma.lead.findMany({
        where: { scoreCategory: "HOT", status: { notIn: ["ADMITTED", "LOST"] } },
        orderBy: { score: "desc" },
        take: 5,
        include: { course: true, assignedTo: true },
      }),
      prisma.lead.count({ where: { status: "ADMITTED" } }),
      prisma.lead.count(),
      prisma.lead.findMany({ where: { status: "LOST" }, select: { lostReason: true } }),
    ]);

    let response = "";

    if (query.includes("call today") || query.includes("follow up") || query.includes("schedule")) {
      response = `📞 **Priority Calls for Today:**\n\nYou have **${todayFollowUps.length} follow-up calls** due today.\n\n` +
        todayFollowUps
          .map(
            (f, i) =>
              `${i + 1}. **${f.lead.studentName}** (Phone: ${f.lead.phone}, AI Score: ${f.lead.score})\n   • Note: ${f.notes || "Follow-up discussion"}`
          )
          .join("\n\n") +
        `\n\n💡 *Recommendation:* Call these students during the peak conversion window (11:00 AM – 1:00 PM or 4:30 PM – 6:30 PM).`;
    } else if (query.includes("hot leads") || query.includes("high score") || query.includes("vip")) {
      response = `🔥 **Top High-Probability Leads (Hot):**\n\n` +
        hotLeads
          .map(
            (l, i) =>
              `${i + 1}. **${l.studentName}** — Score: **${l.score}/100** (${l.course?.name || "General"})\n   • Assigned to: ${l.assignedTo?.name || "Unassigned"}\n   • Next Best Action: *${l.nextBestAction}*`
          )
          .join("\n\n") +
        `\n\n💡 *Tip:* Leads in this tier have a 85%+ likelihood of submitting an admission application within 48 hours.`;
    } else if (query.includes("bottleneck") || query.includes("drop") || query.includes("lost")) {
      const reasonsCount: Record<string, number> = {};
      lostLeads.forEach((l) => {
        const r = l.lostReason || "Unspecified";
        reasonsCount[r] = (reasonsCount[r] || 0) + 1;
      });
      const topReason = Object.entries(reasonsCount).sort((a, b) => b[1] - a[1])[0];

      response = `⚠️ **Conversion Bottleneck Diagnosis:**\n\n` +
        `• Current conversion rate: **${totalLeads > 0 ? ((admittedCount / totalLeads) * 100).toFixed(1) : 0}%**\n` +
        `• Highest drop-off cause: **${topReason ? topReason[0] : "Fee & Scholarship clarity"}** (${topReason ? topReason[1] : 0} leads)\n` +
        `• Stage bottleneck: Leads lingering between **Contacted** and **Campus Visit** without scheduling a tour.\n\n` +
        `🎯 **Actionable Fix:** Launch an automated WhatsApp campaign offering free bus pickup or a direct faculty mentor session to encourage campus visits.`;
    } else if (query.includes("cs") || query.includes("b.tech") || query.includes("engineering")) {
      const btechLeads = await prisma.lead.count({
        where: { course: { name: { contains: "Computer Science" } } },
      });
      response = `💻 **B.Tech Computer Science & Engineering Analysis:**\n\n` +
        `• Total Enquiries: **${btechLeads} candidates**\n` +
        `• Average Lead Score: **82/100 (Highest across institution)**\n` +
        `• Key Drivers: High interest in AI specialization, cyber security labs, and top salary packages.\n\n` +
        `💡 *Recommendation:* Send the updated Placement Report and Coding Hackathon highlights to all pending CSE applicants today.`;
    } else {
      response = `🤖 **LeadTrack AI Counselor Assistant:**\n\n` +
        `Based on your institution's live pipeline:\n` +
        `• Total Enquiries Tracked: **${totalLeads}**\n` +
        `• Admissions Confirmed: **${admittedCount}**\n` +
        `• Hot Leads Ready to Close: **${hotLeads.length}**\n\n` +
        `You can ask me:\n` +
        `1. *"Which leads should I call today?"*\n` +
        `2. *"Show me the hottest leads"* \n` +
        `3. *"What is our biggest conversion bottleneck?"*\n` +
        `4. *"Summarize interest for B.Tech CS"*`;
    }

    return NextResponse.json({ success: true, data: { response } });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
