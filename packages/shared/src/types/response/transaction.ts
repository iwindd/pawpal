import { TransactionStatus, TransactionType } from "../../enums/transaction";
import { WalletType } from "../../enums/wallet";

export interface AdminTransactionResponse {
  id: string;
  type: TransactionType;
  amount: number;
  balance_before: number;
  balance_after: number;
  status: TransactionStatus;
  currency: string;
  payment_gateway_id: string;
  order_id?: string;
  createdAt: string;
  updatedAt: string;
}

export interface OnTopupTransactionUpdatedProps {
  id: string;
  status: TransactionStatus;
  balance: number;
  walletType: WalletType;
}
