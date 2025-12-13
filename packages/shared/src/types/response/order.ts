import { PaymentChargeCreatedResponse } from "./payment-gateway";

export interface AdminOrderResponse {
  id: string;
  total: string;
  status: "PAID" | "PROCESSING" | "COMPLETED" | "CANCELLED";
  createdAt: Date;
  updatedAt: Date;
  user: {
    id: string;
    email: string;
    displayName: string;
  };
  orderPackages: {
    id: string;
    amount: number;
    price: string;
    package: {
      id: string;
      name: string;
      product: {
        id: string;
        name: string;
        category: {
          id: string;
          name: string;
        };
      };
    };
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
