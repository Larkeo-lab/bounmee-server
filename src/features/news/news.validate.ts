import { z } from "zod";
import { NewsStatus } from "@prisma/client";

// News Creation Schema
export const newsCreateSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(255, "Title must not exceed 255 characters")
    .trim(),
  content: z
    .string()
    .min(1, "Content is required")
    .trim(),
  image: z
    .string()
    .max(255, "Image URL must not exceed 255 characters")
    .trim(),
  status: z.nativeEnum(NewsStatus).optional(),
});

// News Update Schema
export const newsUpdateSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(255, "Title must not exceed 255 characters")
    .trim()
    .optional(),
  content: z
    .string()
    .min(1, "Content is required")
    .trim()
    .optional(),
  image: z
    .string()
    .max(255, "Image URL must not exceed 255 characters")
    .trim()
    .optional(),
  status: z.nativeEnum(NewsStatus).optional(),
  isActive: z.boolean().optional(),
});

export const querySchema = z.object({
  status: z.nativeEnum(NewsStatus).optional(),
  search: z.string().optional(),
  createdBy: z.string().optional(),
  isActive: z.preprocess(
    (val) => (val === "true" ? true : val === "false" ? false : val),
    z.boolean().optional()
  ),
});

// Types
export type NewsCreateRequest = z.infer<typeof newsCreateSchema>;
export type NewsUpdateRequest = z.infer<typeof newsUpdateSchema>;
export type NewsQueryRequest = z.infer<typeof querySchema>;
