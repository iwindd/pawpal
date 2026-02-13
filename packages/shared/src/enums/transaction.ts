export const ENUM_TRANSACTION_STATUS = {
  CREATED: "CREATED",
  PENDING: "PENDING",
  SUCCEEDED: "SUCCEEDED",
  FAILED: "FAILED",
};
export type TransactionStatus = keyof typeof ENUM_TRANSACTION_STATUS;

export const ENUM_TRANSACTION_TYPE = {
  TOPUP: "TOPUP",
  PURCHASE: "PURCHASE",
  TOPUP_FOR_PURCHASE: "TOPUP_FOR_PURCHASE",
};
export type TransactionType = keyof typeof ENUM_TRANSACTION_TYPE;

/**
 * alias
 */
export const ENUM_TOPUP_STATUS = ENUM_TRANSACTION_STATUS;
export const ENUM_TOPUP_TYPE = ENUM_TRANSACTION_TYPE;
export type TopupStatus = keyof typeof ENUM_TRANSACTION_STATUS;
export type TopupType = keyof typeof ENUM_TRANSACTION_TYPE;
