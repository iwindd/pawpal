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
  paymentGatewayId?: string;
  orderId?: string;
  createdAt: string;
  updatedAt: string;
  failedAt?: string;
  failedBy?: {
    id: string;
    displayName: string;
  };
  succeededAt?: string;
  succeededBy?: {
    id: string;
    displayName: string;
  };
  assigned?: {
    id: string;
    displayName: string;
  };
  assignedAt?: string;
  customer?: {
    id: string;
    displayName: string;
  };
  paymentGateway?: {
    name: string;
  };
}

export interface OnTopupTransactionUpdatedProps {
  id: string;
  status: TransactionStatus;
  balance: number;
  walletType: WalletType;
}
