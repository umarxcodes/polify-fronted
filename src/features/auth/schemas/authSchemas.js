import { z } from "zod";

const password = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  .regex(/[0-9]/, "Password must contain at least one number")
  .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character");

export const loginSchema = z.object({
  identifier: z.string().trim().min(1, "Username or email is required"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  rememberMe: z.boolean().optional(),
});

export const registerSchema = z.object({
  name: z.string().trim().min(3, "Name must be at least 3 characters").max(50).regex(/^[a-zA-Z\s]+$/, "Name can only contain letters and spaces"),
  username: z.string().trim().toLowerCase().min(3, "Username must be at least 3 characters").max(20).regex(/^[a-zA-Z0-9_.]+$/, "Use letters, numbers, underscores, or dots only"),
  email: z.string().trim().toLowerCase().email("Please provide a valid email"),
  password,
  confirmPassword: z.string().min(1, "Please confirm your password"),
  terms: z.literal(true, { errorMap: () => ({ message: "You must accept the terms and conditions" }) }),
  profileImage: z.instanceof(File).optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export const forgotPasswordSchema = z.object({ email: z.string().email("Please provide a valid email") });
export const resetPasswordSchema = z.object({ password, confirmPassword: z.string() }).refine((data) => data.password === data.confirmPassword, { message: "Passwords do not match", path: ["confirmPassword"] });
export const verifyEmailSchema = z.object({ email: z.string().email("Invalid email address"), otp: z.string().regex(/^\d{6}$/, "OTP must be 6 digits") });
