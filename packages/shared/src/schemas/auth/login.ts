import { z } from "zod";

export const loginSchema = z.object({
  email: z.email({ message: "invalid_email_format" }),
  password: z
    .string()
    .min(6, { message: "password_too_short" })
    .max(30, { message: "password_too_long" }),
});

export type LoginInput = z.infer<typeof loginSchema>;
