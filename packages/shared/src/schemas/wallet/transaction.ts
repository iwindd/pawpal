import z from "zod";
import { ENUM_TRANSACTION_STATUS } from "../../enums/transaction";

export const transactionStatusSchema = z.object({
  status: z.enum([
    ENUM_TRANSACTION_STATUS.PENDING,
    ENUM_TRANSACTION_STATUS.SUCCESS,
    ENUM_TRANSACTION_STATUS.FAILED,
  ]),
});

export type TransactionStatusInput = z.infer<typeof transactionStatusSchema>;
