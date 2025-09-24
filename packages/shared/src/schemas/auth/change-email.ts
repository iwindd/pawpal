import { z } from "zod";

export const changeEmailSchema = z.object({
  newEmail: z.email({ message: "invalid_email_format" }),
  password: z.string().min(1, { message: "required_field" }),
});

export type ChangeEmailInput = z.infer<typeof changeEmailSchema>;
