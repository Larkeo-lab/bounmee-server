import z from "zod";

export const registerSchema = z.object({
  userName: z.string().min(1, "Username is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  email: z.string().email("Invalid email").optional().nullable(),
  phone: z.string().optional().nullable(),
  profileImage: z.string().optional().nullable(),
  provinceId: z.string().uuid().optional().nullable(),
  districtId: z.string().uuid().optional().nullable(),
  address: z.string().optional().nullable(),
});

export const loginSchema = z.object({
  identifier: z.string().min(1, "Email, username, or phone is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1, "Refresh token is required"),
});

export const updateProfileSchema = z.object({
  email: z.string().email("Invalid email").optional().nullable(),
  phone: z.string().optional().nullable(),
  profileImage: z.string().optional().nullable(),
  provinceId: z.string().uuid().optional().nullable(),
  districtId: z.string().uuid().optional().nullable(),
  address: z.string().optional().nullable(),
});

export const updatePasswordSchema = z.object({
  password: z.string().min(6, "Password must be at least 6 characters"),
  userId: z.string().optional(),
});

export type UpdatePasswordSchema = z.infer<typeof updatePasswordSchema>;
export type RegisterSchema = z.infer<typeof registerSchema>;
export type LoginSchema = z.infer<typeof loginSchema>;
export type RefreshTokenSchema = z.infer<typeof refreshTokenSchema>;
export type UpdateProfileSchema = z.infer<typeof updateProfileSchema>;
