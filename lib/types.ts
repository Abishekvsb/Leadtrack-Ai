export type Role = "ADMIN" | "MANAGER" | "COUNSELOR";

export type LeadStatus =
  | "NEW"
  | "CONTACTED"
  | "INTERESTED"
  | "CAMPUS_VISIT"
  | "APPLICATION_SUBMITTED"
  | "ADMITTED"
  | "LOST";

export type ScoreCategory = "HOT" | "WARM" | "COLD";
export type EngagementLevel = "LOW" | "MEDIUM" | "HIGH";

export type LeadSource =
  | "Website"
  | "Instagram"
  | "Facebook"
  | "Google Ads"
  | "Walk-in"
  | "Referral"
  | "Education Fair"
  | "WhatsApp";

export interface UserSession {
  id: string;
  name: string;
  email: string;
  role: Role;
  institutionId?: string | null;
  institutionName?: string | null;
  avatar?: string | null;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface LeadFilterParams {
  search?: string;
  status?: string;
  courseId?: string;
  leadSource?: string;
  scoreCategory?: string;
  assignedToId?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export const STATUS_LABELS: Record<LeadStatus, string> = {
  NEW: "New Enquiry",
  CONTACTED: "Contacted",
  INTERESTED: "Interested",
  CAMPUS_VISIT: "Campus Visit",
  APPLICATION_SUBMITTED: "Application Submitted",
  ADMITTED: "Admitted 🎉",
  LOST: "Lost / Closed",
};

export const STATUS_COLORS: Record<LeadStatus, { bg: string; text: string; border: string; dot: string }> = {
  NEW: { bg: "bg-[#5B7083]/10", text: "text-[#5B7083] dark:text-[#8CA0B2]", border: "border-[#5B7083]/20", dot: "bg-[#5B7083]" },
  CONTACTED: { bg: "bg-[#E0A030]/10", text: "text-[#B87B14] dark:text-[#E0A030]", border: "border-[#E0A030]/25", dot: "bg-[#E0A030]" },
  INTERESTED: { bg: "bg-[#E0A030]/15", text: "text-[#A26908] dark:text-[#E8AF44]", border: "border-[#E0A030]/30", dot: "bg-[#E0A030]" },
  CAMPUS_VISIT: { bg: "bg-[#0F3D33]/10 dark:bg-[#4FB89A]/15", text: "text-[#0F3D33] dark:text-[#4FB89A]", border: "border-[#0F3D33]/20 dark:border-[#4FB89A]/30", dot: "bg-[#0F3D33] dark:bg-[#4FB89A]" },
  APPLICATION_SUBMITTED: { bg: "bg-[#E0A030]/15 dark:bg-[#E0A030]/20", text: "text-[#945E00] dark:text-[#F3BA54]", border: "border-[#E0A030]/30", dot: "bg-[#E0A030]" },
  ADMITTED: { bg: "bg-[#0F3D33]/15 dark:bg-[#4FB89A]/20", text: "text-[#0F3D33] dark:text-[#4FB89A]", border: "border-[#0F3D33]/30 dark:border-[#4FB89A]/40", dot: "bg-[#0F3D33] dark:bg-[#4FB89A]" },
  LOST: { bg: "bg-[#6B665C]/10 dark:bg-[#6B665C]/20", text: "text-[#6B665C] dark:text-[#A8A296]", border: "border-[#6B665C]/20", dot: "bg-[#6B665C]" },
};

export const SCORE_COLORS: Record<ScoreCategory, { bg: string; text: string; badge: string }> = {
  HOT: { bg: "bg-[#C4552F]/10", text: "text-[#C4552F] dark:text-[#E27652]", badge: "bg-[#C4552F] text-white font-mono" },
  WARM: { bg: "bg-[#E0A030]/15", text: "text-[#B87B14] dark:text-[#E0A030]", badge: "bg-[#E0A030] text-[#1B1A17] font-mono font-semibold" },
  COLD: { bg: "bg-[#5B7083]/10", text: "text-[#5B7083] dark:text-[#8CA0B2]", badge: "bg-[#5B7083] text-white font-mono" },
};
