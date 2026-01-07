import { TransactionStatus, TransactionType } from "../../enums/transaction";

export interface TopupResponse {
  id: string;
  type: TransactionType;
  amount: number;
  balance_before: number;
  balance_after: number;
  status: TransactionStatus;
  currency: string;
  payment: {
    id: string;
    label: string;
  };
  order_id?: string;
  createdAt: string;
}
