import { z } from "zod";

export const purchaseSchema = z.object({
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

export type PurchaseInput<T = any> = z.infer<typeof purchaseSchema> & {
  fields: T[];
};

export type TestVariablePurchase = {};
