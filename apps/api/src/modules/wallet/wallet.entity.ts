import { UserWallet } from '@/generated/prisma/client';
import { Decimal } from '@prisma/client/runtime/client';
import { WalletRepository } from './wallet.repository';

export class WalletEntity {
  constructor(
    private readonly userWallet: UserWallet,
    private readonly repo: WalletRepository,
  ) {}

  get id() {
    return this.userWallet.id;
  }

  get balance() {
    return this.userWallet.balance;
  }

  /**
   * Update wallet balance
   * @param amount amount to update
   */
  public async updateBalance(amount: Decimal) {
    await this.repo.updateWalletBalanceOrThrow(
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
