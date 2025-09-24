import { z } from "zod";

const MIN_PASSWORD_LENGTH = 6;
const MAX_PASSWORD_LENGTH = 30;

export const changePasswordSchema = z
  .object({
    oldPassword: z.string().min(1, { message: "required_field" }),
    newPassword: z
      .string()
      .min(MIN_PASSWORD_LENGTH, { message: "password_too_short" })
      .max(MAX_PASSWORD_LENGTH, { message: "password_too_long" }),
    newPasswordConfirmation: z.string().min(1, { message: "required_field" }),
  })
  .refine((data) => data.newPassword === data.newPasswordConfirmation, {
    message: "password_confirmation_mismatch",
    path: ["newPasswordConfirmation"],
  });

export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
