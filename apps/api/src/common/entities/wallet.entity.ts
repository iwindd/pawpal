import { Prisma, TransactionStatus } from '@/generated/prisma/client';
import { Decimal } from '@prisma/client/runtime/client';
import {
  DEFAULT_WALLET_SELECT,
  WalletRepository,
} from '../../modules/wallet/repositories/wallet.repository';

export type WalletEntityProps = Prisma.UserWalletGetPayload<{
  select: typeof DEFAULT_WALLET_SELECT;
}>;

export class WalletEntity {
  constructor(
    private readonly userWallet: WalletEntityProps,
    private readonly repo: WalletRepository,
  ) {}

  get id() {
    return this.userWallet.id;
  }

  get userId() {
    return this.userWallet.user_id;
  }

  get balance() {
    return this.userWallet.balance;
  }

  get walletType() {
    return this.userWallet.walletType;
  }

  /**
   * Update wallet balance
   * @param amount amount to update
   */
  public async updateBalance(amount: Decimal) {
    this.userWallet.balance = amount;

    return await this.repo.updateWalletBalanceOrThrow(
      amount,
      this.userWallet.user_id,
      this.userWallet.walletType,
    );
  }

  /**
   * Get missing amount to reach required amount
   * @param requiredAmount required amount
   * @param walletType wallet type (default: MAIN)
   * @returns missing amount
   */
  public async getMissingAmount(requiredAmount: Decimal) {
    return this.repo.getMissingAmount(
      requiredAmount,
      this.userWallet.user_id,
      this.userWallet.walletType,
    );
  }

  /**
   * Create charge
   * @param amount amount to charge
   * @param paymentGatewayId payment gateway id
   * @param orderId order id (optional)
   * @returns created charge
   */
  public async createCharge(
    amount: Decimal,
    paymentGatewayId: string,
    orderId?: string,
    status: TransactionStatus = TransactionStatus.CREATED,
  ) {
    return this.repo.createCharge(
      this.userWallet.user_id,
      amount,
      paymentGatewayId,
      orderId,
      status,
    );
  }
}
