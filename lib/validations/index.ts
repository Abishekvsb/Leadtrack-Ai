import { z } from "zod";

export const publicEnquirySchema = z.object({
  studentName: z.string().min(2, "Student name must be at least 2 characters"),
  email: z.string().email("Please provide a valid email address"),
  phone: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .regex(/^[0-9+() -]+$/, "Invalid phone number format"),
  courseId: z.string().optional(),
  city: z.string().min(2, "City is required"),
  leadSource: z.string().default("Website"),
  message: z.string().optional(),
});

export const leadCreateSchema = z.object({
  studentName: z.string().min(2, "Student name is required"),
  email: z.string().email("Valid email required"),
  phone: z.string().min(10, "Valid phone number required"),
  parentName: z.string().optional(),
  parentPhone: z.string().optional(),
  city: z.string().min(2, "City is required"),
  state: z.string().optional(),
  courseId: z.string().optional(),
  leadSource: z.string().default("Website"),
  status: z
    .enum(["NEW", "CONTACTED", "INTERESTED", "CAMPUS_VISIT", "APPLICATION_SUBMITTED", "ADMITTED", "LOST"])
    .default("NEW"),
  assignedToId: z.string().optional(),
  message: z.string().optional(),
  followUpDue: z.string().optional(),
});

export const leadUpdateSchema = z.object({
  studentName: z.string().min(2).optional(),
  email: z.string().email().optional(),
  phone: z.string().min(10).optional(),
  parentName: z.string().nullable().optional(),
  parentPhone: z.string().nullable().optional(),
  city: z.string().optional(),
  state: z.string().nullable().optional(),
  courseId: z.string().nullable().optional(),
  leadSource: z.string().optional(),
  status: z
    .enum(["NEW", "CONTACTED", "INTERESTED", "CAMPUS_VISIT", "APPLICATION_SUBMITTED", "ADMITTED", "LOST"])
    .optional(),
  assignedToId: z.string().nullable().optional(),
  message: z.string().nullable().optional(),
  lostReason: z.string().nullable().optional(),
  followUpDue: z.string().nullable().optional(),
});

export const authLoginSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  rememberMe: z.boolean().optional(),
});

export const authRegisterSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  institutionName: z.string().min(3, "Institution name must be at least 3 characters"),
  role: z.enum(["ADMIN", "MANAGER", "COUNSELOR"]).default("COUNSELOR"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string().min(8, "Confirm password is required"),
  terms: z.literal(true, {
    errorMap: () => ({ message: "You must accept terms & privacy policy" }),
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export const passwordResetRequestSchema = z.object({
  email: z.string().email("Valid email required"),
});

export const passwordResetConfirmSchema = z.object({
  token: z.string().min(1, "Reset token is required"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string().min(8),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export const noteCreateSchema = z.object({
  leadId: z.string().min(1, "Lead ID required"),
  content: z.string().min(1, "Note content cannot be empty"),
  isPinned: z.boolean().optional(),
});

export const followUpCreateSchema = z.object({
  leadId: z.string().min(1, "Lead ID required"),
  scheduledAt: z.string().min(1, "Scheduled date/time is required"),
  type: z.enum(["CALL", "EMAIL", "MEETING", "CAMPUS_TOUR", "WHATSAPP"]).default("CALL"),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]).default("MEDIUM"),
  notes: z.string().optional(),
  assignedToId: z.string().optional(),
});

export const automationCreateSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  description: z.string().optional(),
  triggerEvent: z.enum(["LEAD_CREATED", "NO_RESPONSE_X_DAYS", "SCORE_ABOVE", "STATUS_CHANGED"]),
  conditionConfig: z.record(z.any()).default({}),
  actionType: z.enum(["SEND_EMAIL", "SEND_WHATSAPP", "NOTIFY_COUNSELOR", "UPDATE_STATUS", "ASSIGN_LEAD"]),
  actionConfig: z.record(z.any()).default({}),
  isActive: z.boolean().default(true),
});

export const templateCreateSchema = z.object({
  name: z.string().min(3, "Template name required"),
  type: z.enum(["EMAIL", "WHATSAPP", "SMS"]).default("EMAIL"),
  category: z.string().default("FOLLOW_UP"),
  subject: z.string().optional(),
  body: z.string().min(5, "Body content required"),
  variables: z.array(z.string()).default([]),
});

export const courseCreateSchema = z.object({
  name: z.string().min(3, "Course name required"),
  code: z.string().min(2, "Course code required"),
  department: z.string().min(2, "Department required"),
  degree: z.string().min(2, "Degree level required"),
  duration: z.string().min(1, "Duration required"),
  fee: z.number().min(0, "Fee must be positive"),
  seats: z.number().int().min(1, "Seats must be at least 1"),
});
