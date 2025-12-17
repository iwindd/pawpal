export const ENUM_TRANSACTION_STATUS = {
  CREATED: "CREATED",
  PENDING: "PENDING",
  SUCCESS: "SUCCESS",
  FAILED: "FAILED",
};
export type TransactionStatus = keyof typeof ENUM_TRANSACTION_STATUS;

export const ENUM_TRANSACTION_TYPE = {
  TOPUP: "TOPUP",
  PURCHASE: "PURCHASE",
  TOPUP_FOR_PURCHASE: "TOPUP_FOR_PURCHASE",
};
export type TransactionType = keyof typeof ENUM_TRANSACTION_TYPE;
