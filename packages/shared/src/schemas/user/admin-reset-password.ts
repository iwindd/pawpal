import { z } from "zod";

const MIN_PASSWORD_LENGTH = 6;
const MAX_PASSWORD_LENGTH = 30;

export const adminResetPasswordSchema = z
  .object({
    newPassword: z
      .string()
      .min(MIN_PASSWORD_LENGTH, { message: "password_too_short" })
      .max(MAX_PASSWORD_LENGTH, { message: "password_too_long" }),
    newPasswordConfirmation: z.string().min(1, { message: "required_field" }),
  })
  .refine((data: any) => data.newPassword === data.newPasswordConfirmation, {
    message: "password_confirmation_mismatch",
    path: ["newPasswordConfirmation"],
  });

export type AdminResetPasswordInput = z.infer<typeof adminResetPasswordSchema>;
