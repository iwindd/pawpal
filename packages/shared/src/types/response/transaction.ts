import { TransactionStatus, TransactionType } from "../../enums/transaction";
import { WalletType } from "../../enums/wallet";

export interface AdminTransactionResponse {
  id: string;
  type: TransactionType;
  amount: number;
  balanceBefore: number;
  balanceAfter: number;
  status: TransactionStatus;
  currency: string;
  paymentGatewayId: string;
  orderId?: string;
  createdAt: string;
  updatedAt: string;

  // Relations
  customer?: any; // Replace with proper type later if needed
  wallet?: any;
  order?: any;
  paymentGateway?: any;
}

export interface OnTopupTransactionUpdatedProps {
  id: string;
  status: TransactionStatus;
  balance: number;
  walletType: WalletType;
}
