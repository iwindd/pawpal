import z from "zod";

export const ENUM_TRANSACTION_STATUS = {
  PENDING: "PENDING",
  SUCCESS: "SUCCESS",
  FAILED: "FAILED",
};

export const ENUM_TRANSACTION_TYPE = {
  TOPUP: "TOPUP",
};

export type TransactionStatus = keyof typeof ENUM_TRANSACTION_STATUS;
export type TransactionType = keyof typeof ENUM_TRANSACTION_TYPE;

export const transactionStatusSchema = z.object({
  status: z.enum([
    ENUM_TRANSACTION_STATUS.PENDING,
    ENUM_TRANSACTION_STATUS.SUCCESS,
    ENUM_TRANSACTION_STATUS.FAILED,
  ]),
});

export type TransactionStatusInput = z.infer<typeof transactionStatusSchema>;
