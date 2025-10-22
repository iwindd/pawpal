import {
  TransactionStatus,
  TransactionType,
} from "../../schemas/wallet/transaction";

export interface AdminTransactionResponse {
  id: string;
  type: TransactionType;
  amount: number;
  balance_before: number;
  balance_after: number;
  status: TransactionStatus;
  currency: "THB";
  payment_method: string;
  order_id?: string;
  createdAt: string;
  updatedAt: string;
}
