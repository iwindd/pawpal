import { TransactionStatus, TransactionType, WalletType } from '@pawpal/shared';

export interface AssignedUser {
  id: string;
  displayName: string;
}

export interface WalletInfo {
  id: string;
  userId: string;
  walletType: WalletType | string;
}

export interface OrderInfo {
  id: string;
  total: any; // Decimal
}

export class Transaction {
  constructor(
    public readonly id: string,
    public readonly balanceAfter: any, // Decimal
    public readonly balanceBefore: any, // Decimal
    public readonly type: TransactionType | string,
    public readonly status: TransactionStatus | string,
    public readonly currency: string,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
    public readonly paymentGatewayId: string | null,
    public readonly assignedId: string | null,
    public readonly assigned: AssignedUser | null,
    public readonly assignedAt: Date | null,
    public readonly order: OrderInfo | null,
    public readonly wallet: WalletInfo,
  ) {}

  get amount() {
    // We expect Decimal from Prisma mapping, so we use their `.minus` and `.abs()`
    // We use a safe check here or simply assume Decimal interface
    const diff = this.balanceAfter.minus(this.balanceBefore);
    return diff.abs();
  }

  get userId() {
    return this.wallet.userId;
  }

  get walletId() {
    return this.wallet.id;
  }

  get walletType() {
    return this.wallet.walletType;
  }

  get orderId() {
    if (!this.order) {
      return null;
    }
    return this.order.id;
  }

  get total() {
    if (!this.order) {
      return null;
    }
    return this.order.total;
  }

  // To match the interface expected elsewhere, we decouple this from the mapper implementation,
  // or just pass a generic structure that the mapper can ingest.
  public toMapperPayload() {
    return {
      id: this.id,
      balanceAfter: this.balanceAfter,
      balanceBefore: this.balanceBefore,
      type: this.type,
      status: this.status,
      currency: this.currency,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      paymentGatewayId: this.paymentGatewayId,
      assignedId: this.assignedId,
      assigned: this.assigned,
      assignedAt: this.assignedAt,
      order: this.order,
      wallet: this.wallet,
      orderId: this.orderId,
      amount: this.amount,
      total: this.total,
    };
  }
}
