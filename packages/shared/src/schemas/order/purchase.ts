import { z } from "zod";

export const purchaseSchema = z.object({
  userId: z.string().min(1, { message: "invalid_user_info" }).trim(),
  packageId: z.string().min(1, { message: "invalid_package" }).trim(),
  amount: z
    .number()
    .min(1, { message: "invalid_amount" })
    .max(99, { message: "invalid_amount" }),
  paymentMethod: z
    .string()
    .min(1, { message: "invalid_payment_method" })
    .trim(),
});

export type PurchaseInput = z.infer<typeof purchaseSchema>;

export type TestVariablePurchase = {};
