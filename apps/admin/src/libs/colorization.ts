import {
  ENUM_ORDER_STATUS,
  ENUM_TRANSACTION_STATUS,
  ENUM_TRANSACTION_TYPE,
  OrderStatus,
  TransactionStatus,
  TransactionType,
} from "@pawpal/shared";

export class Colorization {
  static orderStatus(status: OrderStatus) {
    switch (status) {
      case ENUM_ORDER_STATUS.PENDING:
        return "orange";
      case ENUM_ORDER_STATUS.COMPLETED:
        return "green";
      case ENUM_ORDER_STATUS.CANCELLED:
        return "red";
      default:
        return "gray";
    }
  }

  static transactionType(type: TransactionType) {
    switch (type) {
      case ENUM_TRANSACTION_TYPE.TOPUP:
        return "orange";
      case ENUM_TRANSACTION_TYPE.PURCHASE:
        return "pawpink";
      case ENUM_TRANSACTION_TYPE.TOPUP_FOR_PURCHASE:
        return "orange";
      default:
        return "gray";
    }
  }

  static transactionStatus(status: TransactionStatus) {
    switch (status) {
      case ENUM_TRANSACTION_STATUS.PENDING:
        return "yellow";
      case ENUM_TRANSACTION_STATUS.SUCCESS:
        return "green";
      case ENUM_TRANSACTION_STATUS.FAILED:
        return "red";
      default:
        return "gray";
    }
  }
}
