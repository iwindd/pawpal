import { z } from "zod";

export const adminResetEmailSchema = z.object({
  newEmail: z.email({ message: "invalid_email_format" }),
});

export type AdminResetEmailInput = z.infer<typeof adminResetEmailSchema>;
