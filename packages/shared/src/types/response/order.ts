import { FieldType } from "../../enums/field";
import { OrderStatus } from "../../enums/order";
import { TransactionStatus, TransactionType } from "../../enums/transaction";
import { PaymentChargeCreatedResponse } from "./payment-gateway";

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
    balance_before: number;
    balance_after: number;
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
    }
  | {
      type: "topup";
      charge: PaymentChargeCreatedResponse;
    };
