import {
  ENUM_ORDER_STATUS,
  ENUM_TRANSACTION_STATUS,
  ENUM_TRANSACTION_TYPE,
  OrderStatus,
  TransactionStatus,
  TransactionType,
} from "@pawpal/shared";
import dayjs from "dayjs";

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
        return "yellow";
      default:
        return "gray";
    }
  }

  static transactionStatus(status: TransactionStatus) {
    switch (status) {
      case ENUM_TRANSACTION_STATUS.PENDING:
        return "yellow";
      case ENUM_TRANSACTION_STATUS.SUCCEEDED:
        return "green";
      case ENUM_TRANSACTION_STATUS.FAILED:
        return "red";
      default:
        return "gray";
    }
  }

  /**
   * Get relative time from date
   * @param date Date to get relative time
   * @param colors Object of colors
   * @returns Color of relative time
   */
  static relativeTime(
    date: Date,
    colors: {
      successAfter?: number;
      warningAfter?: number;
      errorAfter?: number;
    },
  ) {
    const now = dayjs();
    const secondAgo = now.diff(dayjs(date), "second");
    const { errorAfter, warningAfter, successAfter } = colors;

    if (errorAfter && secondAgo >= errorAfter) return "red";
    if (warningAfter && secondAgo >= warningAfter) return "yellow";
    if (successAfter && secondAgo >= successAfter) return "green";
  }
}
