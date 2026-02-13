import { TransactionStatus, TransactionType } from "../../enums/transaction";

export interface TopupResponse {
  id: string;
  type: TransactionType;
  amount: number;
  balanceBefore: number;
  balanceAfter: number;
  status: TransactionStatus;
  currency: string;
  payment: {
    id: string;
    label: string;
  };
  orderId?: string;
  createdAt: string;
}
