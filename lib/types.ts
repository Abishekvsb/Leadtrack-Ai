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
  NEW: { bg: "bg-[#64748B]/10", text: "text-[#64748B] dark:text-[#94A3B8]", border: "border-[#64748B]/20", dot: "bg-[#64748B]" },
  CONTACTED: { bg: "bg-[#FFC21A]/10", text: "text-[#8A5A00] dark:text-[#FFD25A]", border: "border-[#FFC21A]/30", dot: "bg-[#FFC21A]" },
  INTERESTED: { bg: "bg-[#FFC21A]/15", text: "text-[#8A5A00] dark:text-[#FFD25A]", border: "border-[#FFC21A]/35", dot: "bg-[#FFC21A]" },
  CAMPUS_VISIT: { bg: "bg-[#D62828]/10 dark:bg-[#FF5A5F]/15", text: "text-[#D62828] dark:text-[#FF5A5F]", border: "border-[#D62828]/25 dark:border-[#FF5A5F]/35", dot: "bg-[#D62828] dark:bg-[#FF5A5F]" },
  APPLICATION_SUBMITTED: { bg: "bg-[#E5A100]/15 dark:bg-[#FFD25A]/20", text: "text-[#8A5A00] dark:text-[#FFD25A]", border: "border-[#E5A100]/30", dot: "bg-[#E5A100]" },
  ADMITTED: { bg: "bg-[#16A34A]/10 dark:bg-[#16A34A]/20", text: "text-[#16A34A] dark:text-[#4ADE80]", border: "border-[#16A34A]/30 dark:border-[#16A34A]/40", dot: "bg-[#16A34A]" },
  LOST: { bg: "bg-[#6B6470]/10 dark:bg-[#6B6470]/20", text: "text-[#6B6470] dark:text-[#A19AA6]", border: "border-[#6B6470]/20", dot: "bg-[#6B6470]" },
};

export const SCORE_COLORS: Record<ScoreCategory, { bg: string; text: string; badge: string }> = {
  HOT: { bg: "bg-[#D62828]/10", text: "text-[#D62828] dark:text-[#FF5A5F]", badge: "bg-[#D62828] text-white font-mono font-bold" },
  WARM: { bg: "bg-[#FFC21A]/15", text: "text-[#8A5A00] dark:text-[#FFD25A]", badge: "bg-[#FFC21A] text-[#17141A] font-mono font-bold" },
  COLD: { bg: "bg-[#64748B]/10", text: "text-[#64748B] dark:text-[#94A3B8]", badge: "bg-[#64748B] text-white font-mono" },
};
