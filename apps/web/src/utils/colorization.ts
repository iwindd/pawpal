import { ENUM_ORDER_STATUS, OrderStatus } from "@pawpal/shared";

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
}
