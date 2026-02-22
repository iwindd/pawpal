import { WalletType } from '@pawpal/shared';
import { Wallet } from './entities/wallet';

export const WALLET_REPOSITORY = Symbol('WALLET_REPOSITORY');

export interface IWalletRepository {
  /**
   * Get wallet by user id
   */
  find(userId: string, walletType?: WalletType | string): Promise<Wallet>;

  /**
   * Get all wallets by user id
   */
  findAll(userId: string): Promise<Wallet[]>;

  /**
   * Update wallet balance
   */
  updateWalletBalanceOrThrow(
    amount: any,
    userId: string,
    walletType?: WalletType | string,
  ): Promise<Wallet>;

  /**
   * Get missing amount to reach required amount
   */
  getMissingAmount(
    requiredAmount: any,
    userId: string,
    walletType?: WalletType | string,
  ): Promise<any>;
}
