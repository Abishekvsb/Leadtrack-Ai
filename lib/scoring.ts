import { LeadStatus, ScoreCategory, EngagementLevel } from "./types";

export interface ScoreFactors {
  sourceQuality: { score: number; max: number; reason: string };
  engagement: { score: number; max: number; reason: string };
  courseDemand: { score: number; max: number; reason: string };
  profileCompleteness: { score: number; max: number; reason: string };
  recency: { score: number; max: number; reason: string };
  statusStage: { score: number; max: number; reason: string };
}

export interface ScoreResult {
  score: number;
  category: ScoreCategory;
  engagementLevel: EngagementLevel;
  nextBestAction: string;
  conversionProbability: number;
  breakdown: ScoreFactors;
  explanation: string;
}

export function computeLeadScore(params: {
  leadSource: string;
  status: string;
  createdAt: Date | string;
  courseDegree?: string | null;
  phone?: string | null;
  email?: string | null;
  city?: string | null;
  parentPhone?: string | null;
  notesCount?: number;
  activitiesCount?: number;
  followUpsCount?: number;
}): ScoreResult {
  const {
    leadSource,
    status,
    createdAt,
    courseDegree = "",
    phone,
    email,
    city,
    parentPhone,
    notesCount = 0,
    activitiesCount = 0,
    followUpsCount = 0,
  } = params;

  // 1. Source Quality (Max 25 pts)
  let sourceScore = 15;
  let sourceReason = "Digital inquiry channel";
  const sourceLower = leadSource.toLowerCase();
  if (sourceLower.includes("referral")) {
    sourceScore = 25;
    sourceReason = "High-intent personal referral";
  } else if (sourceLower.includes("walk-in")) {
    sourceScore = 24;
    sourceReason = "In-person campus walk-in inquiry";
  } else if (sourceLower.includes("whatsapp")) {
    sourceScore = 20;
    sourceReason = "Direct messaging interaction";
  } else if (sourceLower.includes("website")) {
    sourceScore = 18;
    sourceReason = "Official website organic form";
  } else if (sourceLower.includes("education fair")) {
    sourceScore = 16;
    sourceReason = "Education expo attendee";
  } else if (sourceLower.includes("google") || sourceLower.includes("ads")) {
    sourceScore = 14;
    sourceReason = "Paid search ad campaign";
  } else {
    sourceScore = 12;
    sourceReason = "Social media top-of-funnel lead";
  }

  // 2. Profile Completeness (Max 15 pts)
  let profileScore = 0;
  if (phone && phone.trim().length >= 10) profileScore += 5;
  if (email && email.includes("@")) profileScore += 4;
  if (city && city.trim().length > 1) profileScore += 3;
  if (parentPhone && parentPhone.trim().length >= 10) profileScore += 3;
  const profileReason =
    profileScore >= 12
      ? "Fully verified student & guardian contact info"
      : profileScore >= 8
      ? "Direct contact verified; guardian info pending"
      : "Partial profile; contact details require completion";

  // 3. Engagement (Max 25 pts)
  const totalInteractions = notesCount + activitiesCount + followUpsCount;
  let engagementScore = 5;
  let engagementLevel: EngagementLevel = "LOW";
  let engagementReason = "Initial touchpoint pending";

  if (totalInteractions >= 5) {
    engagementScore = 25;
    engagementLevel = "HIGH";
    engagementReason = `Strong multi-touch interaction (${totalInteractions} logs, notes & calls)`;
  } else if (totalInteractions >= 2) {
    engagementScore = 18;
    engagementLevel = "MEDIUM";
    engagementReason = `Active dialogue underway (${totalInteractions} touchpoints)`;
  } else if (totalInteractions === 1) {
    engagementScore = 10;
    engagementLevel = "LOW";
    engagementReason = "Preliminary contact established";
  }

  // 4. Course Demand & Career Value (Max 15 pts)
  let courseScore = 10;
  let courseReason = "Standard curriculum demand";
  const degLower = (courseDegree || "").toLowerCase();
  if (degLower.includes("tech") || degLower.includes("ai") || degLower.includes("mba")) {
    courseScore = 15;
    courseReason = "High-placement, premium demand program (Engineering/AI/MBA)";
  } else if (degLower.includes("bca") || degLower.includes("bba")) {
    courseScore = 12;
    courseReason = "Popular professional undergraduate program";
  }

  // 5. Recency (Max 10 pts)
  const createdDate = typeof createdAt === "string" ? new Date(createdAt) : createdAt;
  const daysAgo = Math.floor((new Date().getTime() - createdDate.getTime()) / (1000 * 3600 * 24));
  let recencyScore = 10;
  let recencyReason = "Fresh inquiry (within 48 hours)";
  if (daysAgo <= 2) {
    recencyScore = 10;
    recencyReason = "Hot fresh inquiry received in the last 48 hours";
  } else if (daysAgo <= 7) {
    recencyScore = 8;
    recencyReason = "Active inquiry from the past week";
  } else if (daysAgo <= 21) {
    recencyScore = 5;
    recencyReason = "Enquiry received 2-3 weeks ago";
  } else {
    recencyScore = 2;
    recencyReason = "Older enquiry (>30 days); requires re-engagement campaign";
  }

  // 6. Pipeline Status Progression (Max 10 pts)
  let statusScore = 3;
  let statusReason = "Initial stage";
  switch (status as LeadStatus) {
    case "ADMITTED":
      statusScore = 10;
      statusReason = "Admission confirmed & enrolled";
      break;
    case "APPLICATION_SUBMITTED":
      statusScore = 9;
      statusReason = "Formal application and credentials submitted";
      break;
    case "CAMPUS_VISIT":
      statusScore = 8;
      statusReason = "Campus walkthrough or faculty session attended";
      break;
    case "INTERESTED":
      statusScore = 6;
      statusReason = "Expressed keen interest during counseling session";
      break;
    case "CONTACTED":
      statusScore = 4;
      statusReason = "Initial discussion completed by counselor";
      break;
    case "NEW":
      statusScore = 2;
      statusReason = "New enquiry waiting for first counseling call";
      break;
    case "LOST":
      statusScore = 0;
      statusReason = "Lead marked as dropped/lost";
      break;
  }

  // Aggregate total
  let totalScore =
    sourceScore + profileScore + engagementScore + courseScore + recencyScore + statusScore;

  // Penalize lost status
  if (status === "LOST") {
    totalScore = Math.min(25, totalScore - 40);
  }

  // Clamp 0 to 100
  totalScore = Math.max(10, Math.min(99, Math.round(totalScore)));

  // Categorize
  let category: ScoreCategory = "WARM";
  if (totalScore >= 75) {
    category = "HOT";
  } else if (totalScore < 45) {
    category = "COLD";
  }

  // Calculate Next Best Action
  let nextBestAction = "Schedule a discovery call with the student";
  if (status === "ADMITTED") {
    nextBestAction = "Share welcome kit, hostel registration link & orientation calendar";
  } else if (status === "APPLICATION_SUBMITTED") {
    nextBestAction = "Review academic transcripts & initiate provisional seat booking";
  } else if (status === "CAMPUS_VISIT") {
    nextBestAction = "Send application link with merit scholarship deadline alert";
  } else if (status === "INTERESTED") {
    nextBestAction = "Invite student & parents for weekend campus tour & lab showcase";
  } else if (status === "CONTACTED") {
    nextBestAction = "Dispatch program brochure, syllabus PDF & fee structure via WhatsApp";
  } else if (status === "LOST") {
    nextBestAction = "Tag for future re-engagement cycle or alternate course intake";
  } else if (totalScore >= 80) {
    nextBestAction = "High-priority direct call from Senior Admissions Officer today";
  }

  // Conversion Probability
  let conversionProbability = Math.round(totalScore * 0.95);
  if (status === "ADMITTED") conversionProbability = 100;
  if (status === "APPLICATION_SUBMITTED") conversionProbability = Math.max(85, conversionProbability);
  if (status === "LOST") conversionProbability = 5;

  const breakdown: ScoreFactors = {
    sourceQuality: { score: sourceScore, max: 25, reason: sourceReason },
    engagement: { score: engagementScore, max: 25, reason: engagementReason },
    courseDemand: { score: courseScore, max: 15, reason: courseReason },
    profileCompleteness: { score: profileScore, max: 15, reason: profileReason },
    recency: { score: recencyScore, max: 10, reason: recencyReason },
    statusStage: { score: statusScore, max: 10, reason: statusReason },
  };

  const explanation = `Score of ${totalScore}/100 is driven by ${sourceReason.toLowerCase()} (${sourceScore}/25) and ${engagementReason.toLowerCase()} (${engagementScore}/25). Profile data is rated at ${profileScore}/15.`;

  return {
    score: totalScore,
    category,
    engagementLevel,
    nextBestAction,
    conversionProbability,
    breakdown,
    explanation,
  };
}
