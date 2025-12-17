import { Prisma } from '@/generated/prisma/client';
import { Decimal } from '@prisma/client/runtime/client';
import { WalletRepository } from '../../modules/wallet/wallet.repository';

export type WalletEntityProps = Prisma.UserWalletGetPayload<{
  select: typeof WalletEntity.SELECT;
}>;

export class WalletEntity {
  constructor(
    private readonly userWallet: WalletEntityProps,
    private readonly repo: WalletRepository,
  ) {}

  static get SELECT() {
    return {
      id: true,
      balance: true,
      walletType: true,
      user_id: true,
    } satisfies Prisma.UserWalletSelect;
  }

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
}
