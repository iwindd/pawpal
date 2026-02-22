import {
  TransactionStatus,
  TransactionType,
  WalletType,
} from '@/generated/prisma/enums';

// We map out the Topup primitive object detached from Prisma
export class Topup {
  constructor(
    public readonly id: string,
    public readonly amount: any,
    public readonly balanceBefore: any,
    public readonly balanceAfter: any,
    public readonly type: typeof TransactionType | string,
    public readonly status: typeof TransactionStatus | string,
    public readonly currency: string,
    public readonly createdAt: Date,
    public readonly confirmedAt: Date | null,
    public readonly failedAt: Date | null,
    public readonly paymentGateway: any,
    public readonly wallet: {
      id: string;
      userId: string;
      walletType: typeof WalletType | string;
    },
    public readonly orderId: string | null = null,
  ) {}

  public get isPending() {
    return this.status === 'PENDING';
  }
}
