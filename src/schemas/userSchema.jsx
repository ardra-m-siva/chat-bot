import { z } from 'zod';
export const registerSchema = z.object({
    fullName: z.string()
        .trim()
        .min(2, "Full name is required")
        .max(50, "Full name cannot exceed 50 characters")
        .regex(/^[A-Za-z ]+$/, "Full name can only contain letters and spaces"),
    email: z.string()
        .trim()
        .email("Invalid email"),
    username: z.string()
        .trim()
        .regex(/^[a-z-]+$/, "Username can only contain lowercase letter and hyphen"),
    password: z.string()
        .trim()
        .min(8, "Password must be at least 8 characters")
        .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
        .regex(/[a-z]/, "Password must contain at least one lowercase letter")
        .regex(/[0-9]/, "Password must contain at least one number")
        .regex(/[!@#$%^&*(),.?":{}|<>]/, "Password must contain at least one special character"),
})

export const loginSchema = z.object({
    loginId: z.union([
        z.string().email("Invalid email address"),
        z.string().min(1, "Username is required")
      ]),
    password: z.string().min(1, "Password is required"),
});
