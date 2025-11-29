import {
  TransactionStatus,
  TransactionType,
} from "../../schemas/wallet/transaction";

export interface PaymentGatewayResponse {
  id: string;
  label: string;
  text: string;
  isActive: boolean;
}

export interface PaymentChargeCreatedResponse {
  id: string;
  type: TransactionType;
  amount: number;
  status: TransactionStatus;
  payment: {
    id: string;
    metadata?: {
      name?: string;
      number?: string;
    };
  };
  createdAt: string;
  qrcode?: string;
}
