import { z } from "zod";

export const registerSchema = z
  .object({
    displayName: z
      .string()
      .min(6, { message: "display_name_too_short" })
      .max(30, { message: "display_name_too_long" }),
    email: z.email({ message: "invalid_email_format" }),
    password: z
      .string()
      .min(6, { message: "password_too_short" })
      .max(30, { message: "password_too_long" }),
    password_confirmation: z.string(),
    accept_conditions: z
      .boolean()
      .refine((value) => value, { message: "accept_conditions_required" }),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "password_confirmation_mismatch",
    path: ["password_confirmation"],
  });

export type RegisterInput = z.infer<typeof registerSchema>;
