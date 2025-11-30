import { z } from "zod";

export const promptpayManualSchema = z.object({
  number: z
    .string()
    .min(1, { message: "promptpay_number_required" })
    .regex(/^\d{10,13}$/, { message: "invalid_promptpay_number" }),
  name: z
    .string()
    .min(1, { message: "promptpay_name_required" })
    .max(100, { message: "promptpay_name_too_long" }),
});

export type PromptpayManualInput = z.infer<typeof promptpayManualSchema>;
