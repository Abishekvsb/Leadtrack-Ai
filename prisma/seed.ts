import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const INDIAN_FIRST_NAMES_MALE = [
  "Aarav", "Vivaan", "Aditya", "Vihaan", "Arjun", "Sai", "Reyansh", "Ayaan", "Krishna", "Ishaan",
  "Shaurya", "Atharva", "Dhruv", "Kabir", "Rohan", "Karan", "Siddharth", "Vikram", "Ayush", "Harsh",
  "Nikhil", "Manish", "Gaurav", "Ankit", "Deepak", "Rahul", "Pranav", "Varun", "Rishabh", "Yash"
];

const INDIAN_FIRST_NAMES_FEMALE = [
  "Ananya", "Diya", "Saanvi", "Aadhya", "Pari", "Myra", "Anika", "Navya", "Avani", "Tanvi",
  "Isha", "Riya", "Kavya", "Sneha", "Pooja", "Shreya", "Meera", "Neha", "Divya", "Aditi",
  "Simran", "Preeti", "Komal", "Swati", "Nisha", "Palak", "Kriti", "Trisha", "Anushree", "Shruti"
];

const INDIAN_LAST_NAMES = [
  "Sharma", "Verma", "Gupta", "Malhotra", "Bhatia", "Saxena", "Iyer", "Nair", "Patel", "Shah",
  "Deshmukh", "Kulkarni", "Patil", "Reddy", "Rao", "Choudhury", "Das", "Banerjee", "Chatterjee", "Mishra",
  "Trivedi", "Pandey", "Singh", "Yadav", "Chauhan", "Joshi", "Bhardwaj", "Agarwal", "Bansal", "Mehta"
];

const CITIES = [
  { city: "Bangalore", state: "Karnataka" },
  { city: "Mumbai", state: "Maharashtra" },
  { city: "Delhi NCR", state: "Delhi" },
  { city: "Hyderabad", state: "Telangana" },
  { city: "Pune", state: "Maharashtra" },
  { city: "Chennai", state: "Tamil Nadu" },
  { city: "Kolkata", state: "West Bengal" },
  { city: "Ahmedabad", state: "Gujarat" },
  { city: "Jaipur", state: "Rajasthan" },
  { city: "Lucknow", state: "Uttar Pradesh" },
  { city: "Chandigarh", state: "Punjab" },
  { city: "Bhopal", state: "Madhya Pradesh" },
  { city: "Indore", state: "Madhya Pradesh" },
  { city: "Kochi", state: "Kerala" },
  { city: "Coimbatore", state: "Tamil Nadu" },
  { city: "Patna", state: "Bihar" },
  { city: "Bhubaneswar", state: "Odisha" },
  { city: "Dehradun", state: "Uttarakhand" }
];

const SOURCES = [
  "Website", "Instagram", "Facebook", "Google Ads", "Walk-in", "Referral", "Education Fair", "WhatsApp"
];

const STATUSES = [
  "NEW", "CONTACTED", "INTERESTED", "CAMPUS_VISIT", "APPLICATION_SUBMITTED", "ADMITTED", "LOST"
];

const LOST_REASONS = [
  "Opted for state engineering college closer to hometown",
  "Fee structure exceeds family budget",
  "Selected in premier national institution (IIT/NIT/IIM)",
  "Unresponsive after 5 follow-up attempts",
  "Course preference changed to Medical stream",
  "Relocating abroad for undergraduate studies"
];

function getRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// AI Scoring Engine function for realistic seed data
function calculateScore(source: string, status: string, daysAgo: number) {
  let score = 40; // baseline

  // Source weight
  if (source === "Referral" || source === "Walk-in") score += 25;
  else if (source === "Website" || source === "WhatsApp") score += 18;
  else if (source === "Education Fair" || source === "Google Ads") score += 12;
  else score += 8;

  // Status progression
  if (status === "ADMITTED") score = 96 + getRandomInt(0, 4);
  else if (status === "APPLICATION_SUBMITTED") score = 85 + getRandomInt(0, 10);
  else if (status === "CAMPUS_VISIT") score = 75 + getRandomInt(0, 12);
  else if (status === "INTERESTED") score = 65 + getRandomInt(0, 12);
  else if (status === "CONTACTED") score = 50 + getRandomInt(0, 15);
  else if (status === "LOST") score = getRandomInt(15, 35);
  else score += getRandomInt(-5, 10);

  // Recency bonus
  if (daysAgo <= 3) score += 6;
  else if (daysAgo <= 10) score += 2;
  else if (daysAgo > 30) score -= 8;

  // Clamp 10-99
  score = Math.max(12, Math.min(99, score));

  let category = "WARM";
  if (score >= 75) category = "HOT";
  else if (score < 45) category = "COLD";

  let engagement = "MEDIUM";
  if (score >= 75) engagement = "HIGH";
  else if (score < 45) engagement = "LOW";

  let nextAction = "Call student to introduce campus and course curriculum";
  if (status === "ADMITTED") nextAction = "Share orientation schedule and hostel fee link";
  else if (status === "APPLICATION_SUBMITTED") nextAction = "Verify 12th marksheet and schedule interview";
  else if (status === "CAMPUS_VISIT") nextAction = "Send application link with early bird discount";
  else if (status === "INTERESTED") nextAction = "Invite student & parents for weekend campus tour";
  else if (status === "CONTACTED") nextAction = "Share detailed curriculum PDF on WhatsApp";
  else if (status === "LOST") nextAction = "Archive lead or tag for next intake batch";
  else if (score >= 80) nextAction = "High-priority call from Senior Admissions Officer";

  const breakdown = {
    sourceWeight: source === "Referral" || source === "Walk-in" ? "+25 (High Trust Source)" : "+15 (Standard Channel)",
    engagementBonus: engagement === "HIGH" ? "+20 (Multiple touchpoints)" : "+10 (Moderate touchpoints)",
    recencyFactor: daysAgo <= 5 ? "+10 (Active enquiry)" : "-5 (Inactive)",
    profileCompleteness: "+15 (Verified Phone & Email)"
  };

  const conversionProb = Math.min(98, Math.max(10, Math.round(score * 0.95 + getRandomInt(-4, 4))));

  return { score, category, breakdown, engagement, nextAction, conversionProb };
}

async function main() {
  console.log("🌱 Starting LeadTrack AI database seed...");

  // Clear existing data safely
  await prisma.auditLog.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.automationLog.deleteMany();
  await prisma.automation.deleteMany();
  await prisma.document.deleteMany();
  await prisma.note.deleteMany();
  await prisma.followUp.deleteMany();
  await prisma.leadActivity.deleteMany();
  await prisma.lead.deleteMany();
  await prisma.course.deleteMany();
  await prisma.template.deleteMany();
  await prisma.passwordResetToken.deleteMany();
  await prisma.user.deleteMany();
  await prisma.institution.deleteMany();

  // 1. Create Institution
  const institution = await prisma.institution.create({
    data: {
      name: "Apex Institute of Technology & Management",
      code: "AITM-BLR",
      logo: "https://images.unsplash.com/photo-1562774053-701939374585?w=200&h=200&fit=crop&q=80",
      website: "https://apex-tech.edu.in",
      address: "Campus Park, Electronic City Phase 1",
      city: "Bangalore",
      state: "Karnataka",
      phone: "+91 80 4912 8800",
      email: "admissions@apex-tech.edu.in",
      workingHours: "09:00 - 18:00 (Mon - Sat)",
      settings: JSON.stringify({
        scoringWeights: { source: 30, responseSpeed: 25, engagement: 25, completeness: 20 },
        currency: "INR",
        defaultLeadSource: "Website",
        sdgGoal: "UN SDG 4 - Quality Education & Inclusive Learning Opportunities"
      })
    }
  });

  console.log("✅ Created Institution:", institution.name);

  // 2. Create Users
  const passwordAdmin = await bcrypt.hash("Admin@123", 10);
  const passwordCounselor = await bcrypt.hash("Counselor@123", 10);
  const passwordPriya = await bcrypt.hash("Priya@123", 10);
  const passwordRahul = await bcrypt.hash("Rahul@123", 10);

  const admin = await prisma.user.create({
    data: {
      name: "Dr. Rajeshwar Sharma",
      email: "admin@leadtrack.ai",
      passwordHash: passwordAdmin,
      role: "ADMIN",
      phone: "+91 98765 43210",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&q=80",
      institutionId: institution.id,
      status: "ACTIVE"
    }
  });

  const counselor1 = await prisma.user.create({
    data: {
      name: "Priya Sharma",
      email: "counselor.priya@leadtrack.ai",
      passwordHash: passwordPriya,
      role: "COUNSELOR",
      phone: "+91 98112 34567",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop&q=80",
      institutionId: institution.id,
      status: "ACTIVE"
    }
  });

  const counselor2 = await prisma.user.create({
    data: {
      name: "Rahul Verma",
      email: "counselor.rahul@leadtrack.ai",
      passwordHash: passwordRahul,
      role: "COUNSELOR",
      phone: "+91 98223 45678",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&q=80",
      institutionId: institution.id,
      status: "ACTIVE"
    }
  });

  const manager = await prisma.user.create({
    data: {
      name: "Anita Desai",
      email: "manager.anita@leadtrack.ai",
      passwordHash: passwordCounselor,
      role: "MANAGER",
      phone: "+91 98334 56789",
      avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&fit=crop&q=80",
      institutionId: institution.id,
      status: "ACTIVE"
    }
  });

  console.log("✅ Created Users: 1 Admin, 1 Manager, 2 Counselors");

  // 3. Create 8 Courses
  const coursesData = [
    { name: "B.Tech in Computer Science & Engineering", code: "BTECH-CSE", department: "Engineering", degree: "B.Tech", duration: "4 Years", fee: 180000, seats: 180 },
    { name: "B.Tech in Artificial Intelligence & Data Science", code: "BTECH-AIDS", department: "Engineering", degree: "B.Tech", duration: "4 Years", fee: 195000, seats: 120 },
    { name: "MBA in Business Analytics & Strategy", code: "MBA-BA", department: "Management", degree: "MBA", duration: "2 Years", fee: 350000, seats: 120 },
    { name: "Bachelor of Computer Applications (BCA)", code: "BCA-GEN", department: "Computer Applications", degree: "BCA", duration: "3 Years", fee: 95000, seats: 100 },
    { name: "BBA in Digital Marketing & Fintech", code: "BBA-DMF", department: "Management", degree: "BBA", duration: "3 Years", fee: 115000, seats: 90 },
    { name: "M.Tech in Cloud Computing & Cyber Security", code: "MTECH-CC", department: "Engineering", degree: "M.Tech", duration: "2 Years", fee: 140000, seats: 60 },
    { name: "B.Sc in Biotechnology & Genomics", code: "BSC-BIOTECH", department: "Life Sciences", degree: "B.Sc", duration: "3 Years", fee: 85000, seats: 60 },
    { name: "Executive MBA for Professionals", code: "EMBA-EXEC", department: "Management", degree: "EMBA", duration: "1 Year", fee: 420000, seats: 45 }
  ];

  const courses = [];
  for (const c of coursesData) {
    const created = await prisma.course.create({
      data: { ...c, institutionId: institution.id, isActive: true }
    });
    courses.push(created);
  }
  console.log(`✅ Created ${courses.length} Courses`);

  // 4. Create Templates
  const templatesData = [
    {
      name: "Welcome & Course Brochure",
      type: "EMAIL",
      category: "WELCOME",
      subject: "Welcome to Apex Institute – Here is your {{course}} Information Pack",
      body: "Dear {{name}},\n\nThank you for reaching out to Apex Institute of Technology & Management! We are delighted by your interest in our {{course}} program.\n\nAttached is our comprehensive prospectus outlining course modules, world-class lab facilities, global accreditations, and our 94% placement track record.\n\nYour dedicated admissions counselor {{counselor}} is available to guide you at every step.\n\nWarm regards,\nAdmissions Team\n{{institution}}",
      variables: JSON.stringify(["name", "course", "institution", "counselor"]),
      isDefault: true
    },
    {
      name: "Campus Visit Invitation",
      type: "EMAIL",
      category: "CAMPUS_VISIT",
      subject: "Experience AITM Campus – Personal Tour & Dean Interaction",
      body: "Hi {{name}},\n\nSeeing is believing! We would love to host you and your parents for an exclusive guided walkthrough of our tech park campus, innovation labs, and residential facilities.\n\nYou can also arrange a 1-on-1 interaction with the Head of Department for {{course}}.\n\nReply to this email or contact {{counselor}} to pick your preferred weekend slot.\n\nBest wishes,\n{{institution}}",
      variables: JSON.stringify(["name", "course", "institution", "counselor"]),
      isDefault: true
    },
    {
      name: "Quick WhatsApp Follow-up",
      type: "WHATSAPP",
      category: "FOLLOW_UP",
      subject: null,
      body: "Hello {{name}}! 👋 This is {{counselor}} from {{institution}}. I noticed you checked out our {{course}} program. Would you like a 5-minute call today to discuss eligibility and merit scholarships?",
      variables: JSON.stringify(["name", "course", "institution", "counselor"]),
      isDefault: true
    },
    {
      name: "Merit Scholarship Offer Alert",
      type: "EMAIL",
      category: "ADMISSION_OFFER",
      subject: "Merit Scholarship Eligibility for {{name}} – {{course}}",
      body: "Dear {{name}},\n\nBased on your academic profile, you qualify for the Apex Merit Scholarship (up to 35% tuition waiver) for {{course}} for the upcoming intake.\n\nScholarship seats are strictly allocated on a first-come basis. Please complete your registration formalities to lock in your eligibility.\n\nWarm regards,\nOffice of Scholarships & Financial Aid\n{{institution}}",
      variables: JSON.stringify(["name", "course", "institution"]),
      isDefault: false
    }
  ];

  for (const t of templatesData) {
    await prisma.template.create({ data: t });
  }
  console.log("✅ Created Communication Templates");

  // 5. Create Automations
  const automationsData = [
    {
      name: "Fast Lead Engagement (2-Day SLA)",
      description: "If an enquiry remains in NEW status for 2 days without touchpoint, send reminder email & flag to manager",
      triggerEvent: "NO_RESPONSE_X_DAYS",
      conditionConfig: JSON.stringify({ days: 2, currentStatus: "NEW" }),
      actionType: "SEND_EMAIL",
      actionConfig: JSON.stringify({ templateName: "Welcome & Course Brochure", notifyManager: true }),
      isActive: true,
      executionCount: 42
    },
    {
      name: "VIP Hot Lead Instant Alert",
      description: "When an incoming lead has AI Score >= 80, instantly notify assigned counselor via alert & SMS",
      triggerEvent: "SCORE_ABOVE",
      conditionConfig: JSON.stringify({ threshold: 80 }),
      actionType: "NOTIFY_COUNSELOR",
      actionConfig: JSON.stringify({ priority: "URGENT", channel: "POPUP_AND_EMAIL" }),
      isActive: true,
      executionCount: 28
    },
    {
      name: "Campus Visit Confirmation SMS/Email",
      description: "When lead status transitions to CAMPUS_VISIT, automatically dispatch schedule details and GPS directions",
      triggerEvent: "STATUS_CHANGED",
      conditionConfig: JSON.stringify({ targetStatus: "CAMPUS_VISIT" }),
      actionType: "SEND_WHATSAPP",
      actionConfig: JSON.stringify({ templateName: "Campus Visit Invitation" }),
      isActive: true,
      executionCount: 19
    },
    {
      name: "Post-Application Offer Follow-up",
      description: "Trigger scholarship evaluation and send offer letter checklist within 24 hours of application submission",
      triggerEvent: "STATUS_CHANGED",
      conditionConfig: JSON.stringify({ targetStatus: "APPLICATION_SUBMITTED" }),
      actionType: "UPDATE_STATUS",
      actionConfig: JSON.stringify({ addTimelineNote: true }),
      isActive: true,
      executionCount: 15
    }
  ];

  const automations = [];
  for (const a of automationsData) {
    const created = await prisma.automation.create({ data: a });
    automations.push(created);
  }
  console.log("✅ Created Automations");

  // 6. Create 155 realistic leads with rich history
  console.log("⏳ Generating 155 realistic leads spanning the past 45 days...");
  const counselors = [counselor1, counselor2];
  const totalLeadsToCreate = 155;
  const now = new Date();

  // Status distributions:
  // NEW: 25, CONTACTED: 35, INTERESTED: 30, CAMPUS_VISIT: 22, APPLICATION_SUBMITTED: 20, ADMITTED: 15, LOST: 8
  const statusPool: string[] = [];
  for (let i = 0; i < 25; i++) statusPool.push("NEW");
  for (let i = 0; i < 35; i++) statusPool.push("CONTACTED");
  for (let i = 0; i < 30; i++) statusPool.push("INTERESTED");
  for (let i = 0; i < 22; i++) statusPool.push("CAMPUS_VISIT");
  for (let i = 0; i < 20; i++) statusPool.push("APPLICATION_SUBMITTED");
  for (let i = 0; i < 15; i++) statusPool.push("ADMITTED");
  for (let i = 0; i < 8; i++) statusPool.push("LOST");

  for (let i = 0; i < totalLeadsToCreate; i++) {
    const isMale = Math.random() > 0.45;
    const firstName = isMale ? getRandom(INDIAN_FIRST_NAMES_MALE) : getRandom(INDIAN_FIRST_NAMES_FEMALE);
    const lastName = getRandom(INDIAN_LAST_NAMES);
    const studentName = `${firstName} ${lastName}`;
    const cleanFirst = firstName.toLowerCase();
    const cleanLast = lastName.toLowerCase();
    const email = `${cleanFirst}.${cleanLast}${getRandomInt(10, 999)}@gmail.com`;
    const phone = `+91 ${getRandomInt(9800, 9999)} ${getRandomInt(100000, 999999)}`;
    const location = getRandom(CITIES);
    const course = getRandom(courses);
    const source = getRandom(SOURCES);
    const status = statusPool[i % statusPool.length];
    const assignedCounselor = getRandom(counselors);

    // Days ago between 0 and 45
    // Make recent dates denser for nice sparklines
    const daysAgo = Math.floor(Math.pow(Math.random(), 1.5) * 45);
    const createdAt = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000 - getRandomInt(10, 3600) * 1000);
    const updatedAt = new Date(createdAt.getTime() + getRandomInt(1, Math.min(daysAgo, 5) * 24 * 3600 * 1000));

    const scoring = calculateScore(source, status, daysAgo);

    // Follow-up due date calculation
    let followUpDue: Date | null = null;
    if (status !== "ADMITTED" && status !== "LOST") {
      // Some overdue (-2 to -1 days), some today (0), some upcoming (1 to 4 days)
      const offsetDays = getRandomInt(-2, 4);
      followUpDue = new Date(now.getTime() + offsetDays * 24 * 60 * 60 * 1000 + getRandomInt(1, 8) * 3600 * 1000);
    }

    const lostReason = status === "LOST" ? getRandom(LOST_REASONS) : null;
    const parentName = `${getRandom(INDIAN_FIRST_NAMES_MALE)} ${lastName}`;
    const parentPhone = `+91 ${getRandomInt(9700, 9899)} ${getRandomInt(100000, 999999)}`;

    const lead = await prisma.lead.create({
      data: {
        studentName,
        email,
        phone,
        parentName,
        parentPhone,
        city: location.city,
        state: location.state,
        courseId: course.id,
        leadSource: source,
        status,
        score: scoring.score,
        scoreCategory: scoring.category,
        scoreBreakdown: JSON.stringify(scoring.breakdown),
        engagementLevel: scoring.engagement,
        nextBestAction: scoring.nextAction,
        conversionProbability: scoring.conversionProb,
        message: `Enquiring for ${course.name} intake. Seeking syllabus, lab facilities, and hostel fee details.`,
        assignedToId: assignedCounselor.id,
        institutionId: institution.id,
        followUpDue,
        lostReason,
        notesCount: 0,
        createdAt,
        updatedAt
      }
    });

    // Add initial activity
    await prisma.leadActivity.create({
      data: {
        leadId: lead.id,
        userId: assignedCounselor.id,
        type: "STATUS_CHANGE",
        title: "Lead Created",
        description: `Enquiry received via ${source} from ${location.city}. Automatically assigned to ${assignedCounselor.name}.`,
        createdAt
      }
    });

    // Add score activity
    await prisma.leadActivity.create({
      data: {
        leadId: lead.id,
        userId: null,
        type: "SCORE_UPDATED",
        title: `AI Score Computed: ${scoring.score} (${scoring.category})`,
        description: `Source weight: ${scoring.breakdown.sourceWeight}. Predicted conversion: ${scoring.conversionProb}%.`,
        createdAt: new Date(createdAt.getTime() + 1000 * 60 * 5)
      }
    });

    // If status is progressed, add notes, follow-ups, and activities
    if (status !== "NEW") {
      const callDate = new Date(createdAt.getTime() + 1000 * 3600 * getRandomInt(2, 24));
      await prisma.leadActivity.create({
        data: {
          leadId: lead.id,
          userId: assignedCounselor.id,
          type: "CALL_LOGGED",
          title: "Outbound Call Completed",
          description: `Spoke with ${studentName}. Verified 12th PCM/Commerce score. Student expressed positive intent for ${course.name}.`,
          createdAt: callDate
        }
      });

      // Add a note
      const note = await prisma.note.create({
        data: {
          leadId: lead.id,
          authorId: assignedCounselor.id,
          content: `${studentName} is keen on ${course.degree}. Family inquired about student loan partnerships and placement records. Follow up with brochure.`,
          isPinned: scoring.score > 80,
          createdAt: callDate
        }
      });

      await prisma.lead.update({
        where: { id: lead.id },
        data: { notesCount: { increment: 1 } }
      });
    }

    if (status === "CAMPUS_VISIT" || status === "APPLICATION_SUBMITTED" || status === "ADMITTED") {
      const visitDate = new Date(createdAt.getTime() + 1000 * 3600 * 48);
      await prisma.leadActivity.create({
        data: {
          leadId: lead.id,
          userId: assignedCounselor.id,
          type: "STATUS_CHANGE",
          title: "Campus Tour Completed",
          description: `Visited university campus with parents. Met Prof. Raman in the Department of ${course.department}.`,
          createdAt: visitDate
        }
      });
    }

    if (status === "APPLICATION_SUBMITTED" || status === "ADMITTED") {
      const appDate = new Date(createdAt.getTime() + 1000 * 3600 * 72);
      await prisma.leadActivity.create({
        data: {
          leadId: lead.id,
          userId: assignedCounselor.id,
          type: "STATUS_CHANGE",
          title: "Application Form & Fee Received",
          description: `Application form #${course.code}-${getRandomInt(1000, 9999)} submitted online. Document verification in progress.`,
          createdAt: appDate
        }
      });
    }

    if (status === "ADMITTED") {
      const admitDate = new Date(createdAt.getTime() + 1000 * 3600 * 120);
      await prisma.leadActivity.create({
        data: {
          leadId: lead.id,
          userId: admin.id,
          type: "STATUS_CHANGE",
          title: "Admission Confirmed 🎉",
          description: `Seat successfully secured in ${course.name}. Welcome kit and enrollment credentials dispatched.`,
          createdAt: admitDate
        }
      });
    }

    // Add a pending follow-up if applicable
    if (followUpDue && Math.random() > 0.4) {
      await prisma.followUp.create({
        data: {
          leadId: lead.id,
          assignedToId: assignedCounselor.id,
          scheduledAt: followUpDue,
          type: getRandom(["CALL", "WHATSAPP", "CAMPUS_TOUR", "EMAIL"]),
          priority: scoring.score >= 75 ? "HIGH" : "MEDIUM",
          status: followUpDue < now ? "PENDING" : "PENDING",
          notes: `Check in on admission documents and entrance score card submission for ${studentName}.`,
          createdAt: new Date(createdAt.getTime() + 1000 * 3600 * 12)
        }
      });
    }
  }

  // 7. Create some notifications
  await prisma.notification.create({
    data: {
      userId: admin.id,
      title: "New Batch Admissions Milestone",
      message: "Congratulations! Apex Institute has crossed 15 confirmed admissions this week.",
      type: "SYSTEM",
      link: "/analytics",
      isRead: false
    }
  });

  await prisma.notification.create({
    data: {
      userId: counselor1.id,
      title: "Hot Lead Alert 🔥",
      message: "Aarav Sharma scored 94 AI Lead Score. Immediate call recommended.",
      type: "HIGH_SCORE",
      link: "/leads",
      isRead: false
    }
  });

  await prisma.notification.create({
    data: {
      userId: counselor2.id,
      title: "Campus Visit Scheduled",
      message: "Ananya Iyer confirmed a campus walkthrough for tomorrow 11:30 AM.",
      type: "FOLLOW_UP",
      link: "/follow-ups",
      isRead: false
    }
  });

  // 8. Create Audit Logs
  await prisma.auditLog.create({
    data: {
      userId: admin.id,
      action: "SYSTEM_INITIALIZE",
      entityType: "SETTINGS",
      entityId: institution.id,
      details: JSON.stringify({ event: "Database successfully seeded with 155 leads, 8 courses, and automated workflows." }),
      ipAddress: "127.0.0.1"
    }
  });

  console.log("✨ Seed successfully completed! Ready for production testing.");
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
