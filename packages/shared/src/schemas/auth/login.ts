import { z } from "zod";

const MIN_PASSWORD_LENGTH = 6;
const MAX_PASSWORD_LENGTH = 30;

export const loginSchema = z.object({
  email: z.email({ message: "invalid_email_format" }),
  password: z
    .string()
    .min(MIN_PASSWORD_LENGTH, { message: "password_too_short" })
    .max(MAX_PASSWORD_LENGTH, { message: "password_too_long" }),
});

export type LoginInput = z.infer<typeof loginSchema>;
