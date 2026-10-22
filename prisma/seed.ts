import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting LeadTrack AI system defaults setup...");

  // Default Communication Templates
  const defaultTemplates = [
    {
      name: "Welcome & Course Brochure",
      type: "EMAIL",
      category: "WELCOME",
      subject: "Welcome to {{institution}} – Here is your {{course}} Information Pack",
      body: "Dear {{name}},\n\nThank you for reaching out to {{institution}}! We are delighted by your interest in our {{course}} program.\n\nAttached is our comprehensive prospectus outlining course modules, world-class lab facilities, global accreditations, and placement track record.\n\nYour dedicated admissions counselor {{counselor}} is available to guide you at every step.\n\nWarm regards,\nAdmissions Team\n{{institution}}",
      variables: JSON.stringify(["name", "course", "institution", "counselor"]),
      isDefault: true,
    },
    {
      name: "Campus Visit Invitation",
      type: "EMAIL",
      category: "CAMPUS_VISIT",
      subject: "Experience {{institution}} Campus – Personal Tour & Department Interaction",
      body: "Hi {{name}},\n\nSeeing is believing! We would love to host you and your parents for an exclusive guided walkthrough of our campus, innovation labs, and residential facilities.\n\nYou can also arrange a 1-on-1 interaction with the faculty for {{course}}.\n\nReply to this email or contact {{counselor}} to pick your preferred visiting slot.\n\nBest wishes,\n{{institution}}",
      variables: JSON.stringify(["name", "course", "institution", "counselor"]),
      isDefault: true,
    },
    {
      name: "Quick WhatsApp Follow-up",
      type: "WHATSAPP",
      category: "FOLLOW_UP",
      subject: null,
      body: "Hello {{name}}! 👋 This is {{counselor}} from {{institution}}. I noticed you checked out our {{course}} program. Would you like a 5-minute call today to discuss eligibility and scholarship opportunities?",
      variables: JSON.stringify(["name", "course", "institution", "counselor"]),
      isDefault: true,
    },
    {
      name: "Merit Scholarship Offer Alert",
      type: "EMAIL",
      category: "ADMISSION_OFFER",
      subject: "Merit Scholarship Eligibility for {{name}} – {{course}}",
      body: "Dear {{name}},\n\nBased on your academic profile, you qualify for an institutional merit scholarship evaluation for {{course}}.\n\nScholarship seats are strictly allocated on a first-come basis. Please complete your registration formalities to lock in your eligibility.\n\nWarm regards,\nOffice of Scholarships & Financial Aid\n{{institution}}",
      variables: JSON.stringify(["name", "course", "institution"]),
      isDefault: false,
    },
  ];

  for (const t of defaultTemplates) {
    const existing = await prisma.template.findFirst({
      where: { name: t.name },
    });
    if (!existing) {
      await prisma.template.create({ data: t });
    }
  }
  console.log("✅ Verified system default templates");

  // Default Automation Recipes (Created inactive until enabled by admin)
  const defaultAutomations = [
    {
      name: "Fast Lead Engagement (2-Day SLA)",
      description: "If an enquiry remains in NEW status for 2 days without touchpoint, send reminder email & notify counselor",
      triggerEvent: "NO_RESPONSE_X_DAYS",
      conditionConfig: JSON.stringify({ days: 2, currentStatus: "NEW" }),
      actionType: "SEND_EMAIL",
      actionConfig: JSON.stringify({ templateName: "Welcome & Course Brochure", notifyManager: true }),
      isActive: false,
      executionCount: 0,
    },
    {
      name: "VIP Hot Lead Instant Alert",
      description: "When an incoming lead has AI Score >= 80, instantly notify assigned counselor",
      triggerEvent: "SCORE_ABOVE",
      conditionConfig: JSON.stringify({ threshold: 80 }),
      actionType: "NOTIFY_COUNSELOR",
      actionConfig: JSON.stringify({ priority: "URGENT", channel: "POPUP_AND_EMAIL" }),
      isActive: false,
      executionCount: 0,
    },
    {
      name: "Campus Visit Confirmation Notification",
      description: "When lead status transitions to CAMPUS_VISIT, automatically dispatch schedule details and directions",
      triggerEvent: "STATUS_CHANGED",
      conditionConfig: JSON.stringify({ targetStatus: "CAMPUS_VISIT" }),
      actionType: "SEND_WHATSAPP",
      actionConfig: JSON.stringify({ templateName: "Campus Visit Invitation" }),
      isActive: false,
      executionCount: 0,
    },
    {
      name: "Post-Application Follow-up",
      description: "Trigger scholarship evaluation checklist within 24 hours of application submission",
      triggerEvent: "STATUS_CHANGED",
      conditionConfig: JSON.stringify({ targetStatus: "APPLICATION_SUBMITTED" }),
      actionType: "UPDATE_STATUS",
      actionConfig: JSON.stringify({ addTimelineNote: true }),
      isActive: false,
      executionCount: 0,
    },
  ];

  for (const a of defaultAutomations) {
    const existing = await prisma.automation.findFirst({
      where: { name: a.name },
    });
    if (!existing) {
      await prisma.automation.create({ data: a });
    }
  }
  console.log("✅ Verified system default automation recipes (inactive)");
  console.log("✨ Seed finished: Clean database ready for first-run admin registration.");
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
