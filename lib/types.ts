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
  NEW: { bg: "bg-blue-500/10", text: "text-blue-600 dark:text-blue-400", border: "border-blue-500/20", dot: "bg-blue-500" },
  CONTACTED: { bg: "bg-sky-500/10", text: "text-sky-600 dark:text-sky-400", border: "border-sky-500/20", dot: "bg-sky-500" },
  INTERESTED: { bg: "bg-amber-500/10", text: "text-amber-600 dark:text-amber-400", border: "border-amber-500/20", dot: "bg-amber-500" },
  CAMPUS_VISIT: { bg: "bg-purple-500/10", text: "text-purple-600 dark:text-purple-400", border: "border-purple-500/20", dot: "bg-purple-500" },
  APPLICATION_SUBMITTED: { bg: "bg-indigo-500/10", text: "text-indigo-600 dark:text-indigo-400", border: "border-indigo-500/20", dot: "bg-indigo-500" },
  ADMITTED: { bg: "bg-emerald-500/10", text: "text-emerald-600 dark:text-emerald-400", border: "border-emerald-500/20", dot: "bg-emerald-500" },
  LOST: { bg: "bg-rose-500/10", text: "text-rose-600 dark:text-rose-400", border: "border-rose-500/20", dot: "bg-rose-500" },
};

export const SCORE_COLORS: Record<ScoreCategory, { bg: string; text: string; badge: string }> = {
  HOT: { bg: "bg-emerald-500/10", text: "text-emerald-600 dark:text-emerald-400", badge: "bg-gradient-to-r from-emerald-500 to-teal-500 text-white" },
  WARM: { bg: "bg-amber-500/10", text: "text-amber-600 dark:text-amber-400", badge: "bg-gradient-to-r from-amber-500 to-orange-500 text-white" },
  COLD: { bg: "bg-slate-500/10", text: "text-slate-600 dark:text-slate-400", badge: "bg-slate-500 text-white" },
};
