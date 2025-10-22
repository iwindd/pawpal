export const ENUM_TRANSACTION_STATUS = {
  PENDING: "PENDING",
  SUCCESS: "SUCCESS",
  FAILED: "FAILED",
};

export const ENUM_TRANSACTION_TYPE = {
  TOPUP: "TOPUP",
};

export type TransactionStatus = keyof typeof ENUM_TRANSACTION_STATUS;
export type TransactionType = keyof typeof ENUM_TRANSACTION_TYPE;
