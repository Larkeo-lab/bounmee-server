import { ReportStatus, UserType } from "@prisma/client";
import { z } from "zod";

// Report Creation Schema
export const reportCreateSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(255, "Title must not exceed 255 characters")
    .trim(),
  description: z.string().trim().optional().nullable(),
  provinceId: z.string().uuid("Invalid province ID format").optional().nullable(),
  districtId: z.string().uuid("Invalid district ID format").optional().nullable(),
  villageId: z.string().uuid("Invalid village ID format").optional().nullable(),
  location: z.string().min(1, "Location is required").trim(),
  image: z.string().trim().optional().nullable(),
  video: z.string().trim().optional().nullable(),
  attachments: z.any().optional().nullable(),
  status: z.nativeEnum(ReportStatus).optional(),
  currentAssignee: z.nativeEnum(UserType).optional(),
});

// Report Update Schema
export const reportUpdateSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(255, "Title must not exceed 255 characters")
    .trim()
    .optional(),
  description: z.string().trim().optional().nullable(),
  provinceId: z.string().uuid("Invalid province ID format").optional().nullable(),
  districtId: z.string().uuid("Invalid district ID format").optional().nullable(),
  villageId: z.string().uuid("Invalid village ID format").optional().nullable(),
  location: z.string().min(1, "Location is required").trim().optional(),
  image: z.string().trim().optional().nullable(),
  video: z.string().trim().optional().nullable(),
  attachments: z.any().optional().nullable(),
  status: z.nativeEnum(ReportStatus).optional(),
  currentAssignee: z.nativeEnum(UserType).optional(),
  evidenceDetail: z.string().trim().optional().nullable(),
  caseConclusion: z.string().trim().optional().nullable(),
});

// Report Query/Filtering Schema
export const reportQuerySchema = z.object({
  status: z.nativeEnum(ReportStatus).optional(),
  currentAssignee: z.nativeEnum(UserType).optional(),
  // Reports whose escalation history ever reached this level
  reachedAssignee: z.nativeEnum(UserType).optional(),
  provinceId: z.string().uuid().optional(),
  districtId: z.string().uuid().optional(),
  villageId: z.string().uuid().optional(),
  userId: z.string().uuid().optional(),
  search: z.string().optional(),
});

// Extra-info entry added to an existing report
export const reportMoreDetailSchema = z.object({
  detail: z.string().min(1, "Detail is required").trim(),
  images: z.array(z.string()).optional(),
  attachments: z.string().optional().nullable(),
});

// Types
export type ReportCreateRequest = z.infer<typeof reportCreateSchema>;
export type ReportUpdateRequest = z.infer<typeof reportUpdateSchema>;
export type ReportQueryRequest = z.infer<typeof reportQuerySchema>;
export type ReportMoreDetailRequest = z.infer<typeof reportMoreDetailSchema>;
