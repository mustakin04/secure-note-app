
import { z } from "zod";

const registerSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(50)
    .trim(),

  email: z.email("Invalid email address")
    .trim()
    .toLowerCase(),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters"),
});

const loginSchema = z.object({
  email: z.email("Invalid email address")
    .trim()
    .toLowerCase(),

  password: z.string().min(1, "Password is required"),
});

export const registerValidationSchema = z.object({
  body: registerSchema,
});

export const loginValidationSchema = z.object({
  body: loginSchema,
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
