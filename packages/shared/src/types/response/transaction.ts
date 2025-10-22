export interface AdminTransactionResponse {
  id: string;
  type: "TOPUP";
  amount: number;
  balance_before: number;
  balance_after: number;
  status: "PENDING" | "SUCCESS" | "FAILED";
  currency: "THB";
  payment_method: string;
  order_id?: string;
  createdAt: string;
  updatedAt: string;
}
