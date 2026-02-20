import { z } from "zod";

const MIN_DISPLAY_NAME_LENGTH = 6;
const MAX_DISPLAY_NAME_LENGTH = 30;
const MIN_PASSWORD_LENGTH = 6;
const MAX_PASSWORD_LENGTH = 30;

export const adminCreateUserSchema = z
  .object({
    displayName: z
      .string()
      .min(MIN_DISPLAY_NAME_LENGTH, { message: "display_name_too_short" })
      .max(MAX_DISPLAY_NAME_LENGTH, { message: "display_name_too_long" }),
    email: z.email({ message: "invalid_email_format" }),
    password: z
      .string()
      .min(MIN_PASSWORD_LENGTH, { message: "password_too_short" })
      .max(MAX_PASSWORD_LENGTH, { message: "password_too_long" }),
    password_confirmation: z.string(),
    type: z.enum(["customer", "employee"]),
    roles: z.array(z.string()).default([]),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "password_confirmation_mismatch",
    path: ["password_confirmation"],
  });

export type AdminCreateUserInput = z.infer<typeof adminCreateUserSchema>;
