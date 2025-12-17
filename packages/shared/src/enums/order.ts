export const ENUM_ORDER_STATUS = {
  CREATED: "CREATED",
  PENDING: "PENDING",
  CANCELLED: "CANCELLED",
  COMPLETED: "COMPLETED",
};
export type OrderStatus = keyof typeof ENUM_ORDER_STATUS;
