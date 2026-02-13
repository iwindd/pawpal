import { FieldType } from "../../enums/field";
import { OrderStatus } from "../../enums/order";
import { TransactionStatus, TransactionType } from "../../enums/transaction";
import { WalletType } from "../../enums/wallet";
import { PaymentChargeCreatedResponse } from "./payment-gateway";
import { AdminTransactionResponse } from "./transaction";

export type OrderResponse = AdminOrderResponse;

export interface AdminOrderResponse {
  id: string;
  total: number;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;

  customer: {
    id: string;
    email: string;
    displayName: string;
  };
  cart: {
    id: string;
    amount: number;
    price: number;
    package: {
      id: string;
      name: string;
    };
    product: {
      id: string;
      name: string;
    };
    category: {
      id: string;
      name: string;
    };
  }[];
  fields: {
    label: string;
    metadata: any;
    placeholder: string;
    type: FieldType;
    value: string;
  }[];
  transactions: {
    id: string;
    type: TransactionType;
    status: TransactionStatus;
    balanceBefore: number;
    balanceAfter: number;
    createdAt: string;
    payment?: {
      id: string;
      name: string;
    } | null;
  }[];
}

export type OrderResponseType =
  | {
      type: "purchase";
      wallet: {
        balance: number;
        type: WalletType;
      };
      transaction: AdminTransactionResponse;
    }
  | {
      type: "topup";
      charge: PaymentChargeCreatedResponse;
    };

export interface OnPurchaseTransactionUpdatedProps {
  id: string;
  status: OrderStatus;
  wallet: {
    balance: number;
    type: WalletType;
  };
}
