import {
  ENUM_TRANSACTION_TYPE,
  OrderStatus,
  TransactionStatus,
  TransactionType,
  WalletType,
} from '@pawpal/shared';

// We map the string types to avoid importing directly from Prisma.
export interface OrderTransactionWallet {
  balance: any; // Decimal
  walletType: WalletType;
}

export interface OrderTransaction {
  id: string;
  type: TransactionType;
  status: TransactionStatus;
  balanceBefore: any; // Decimal
  balanceAfter: any; // Decimal
  wallet: OrderTransactionWallet;
}

export class Order {
  constructor(
    public readonly id: string,
    public readonly status: OrderStatus,
    public readonly total: any, // Decimal
    public readonly userId: string,
    public readonly transactions: OrderTransaction[],
  ) {}

  public get purchaseTransaction(): OrderTransaction | undefined {
    return this.transactions.find(
      (transaction) => transaction.type === ENUM_TRANSACTION_TYPE.PURCHASE,
    );
  }
}
