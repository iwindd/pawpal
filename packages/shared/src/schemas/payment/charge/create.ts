import { z } from "zod";

export const PaymentChargeCreateSchema = z.object({
  amount: z.number().min(1),
  payment_id: z.string().min(1),
});

export type PaymentChargeCreateInput = z.infer<
  typeof PaymentChargeCreateSchema
>;
