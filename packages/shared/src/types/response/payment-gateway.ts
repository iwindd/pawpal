import { TransactionStatus, TransactionType } from "../../enums/transaction";

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
  order_id?: string;
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

export interface AdminPaymentGatewayResponse {
  id: string;
  metadata: {
    name?: string;
    number?: string;
  };
}
