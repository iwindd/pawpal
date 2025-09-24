import { z } from "zod";

export const changeEmailSchema = z.object({
  newEmail: z.email({ message: "invalid_email_format" }),
  password: z
    .string()
    .min(6, { message: "invalid_password" })
    .max(30, { message: "invalid_password" }),
});

export type ChangeEmailInput = z.infer<typeof changeEmailSchema>;
