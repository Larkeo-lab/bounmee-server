import { z } from "zod";

// Pagination Schema - reusable for all list endpoints
export const paginationSchema = z.object({
  page: z
    .string()
    .optional()
    .transform((val) => {
      const num = val ? Number.parseInt(val, 10) : 1;
      return Number.isNaN(num) || num < 1 ? 1 : num;
    }),
  limit: z
    .string()
    .optional()
    .transform((val) => {
      const num = val ? Number.parseInt(val, 10) : 10;
      if (Number.isNaN(num) || num < 1) return 10;
      return num > 100 ? 100 : num;
    }),
  search: z.string().optional(),
  startDate: z
    .string()
    .optional()
    .transform((val) => (val ? new Date(val) : undefined)),
  endDate: z
    .string()
    .optional()
    .transform((val) => (val ? new Date(val) : undefined)),
  isActive: z
    .string()
    .optional()
    .transform((val) =>
      val === "true" ? true : val === "false" ? false : undefined,
    ),
});

export const idSchema = z.object({
  id: z
    .string()
    .uuid("Invalid UUID format")
    .transform((val) => {
      if (!val) throw new Error("ID is required");
      return val;
    }),
});



export const storeSchema = z.object({
  storeId: z.string().uuid("Invalid UUID format"),
});
