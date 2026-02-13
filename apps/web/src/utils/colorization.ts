import {
  ENUM_ORDER_STATUS,
  ENUM_TRANSACTION_STATUS,
  OrderStatus,
  TopupStatus,
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

  static topupStatus(status: TopupStatus) {
    switch (status) {
      case ENUM_TRANSACTION_STATUS.PENDING:
        return "orange";
      case ENUM_TRANSACTION_STATUS.SUCCEEDED:
        return "green";
      case ENUM_TRANSACTION_STATUS.FAILED:
        return "red";
      default:
        return "gray";
    }
  }
}
