import { WalletType } from '@/generated/prisma/enums';
import { Injectable, Logger } from '@nestjs/common';
import { Decimal } from '@prisma/client/runtime/client';
import { PrismaService } from '../prisma/prisma.service';
import { WalletEntity } from './wallet.entity';

@Injectable()
export class WalletRepository {
  private readonly logger = new Logger(`WalletRepository`);
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Get wallet by user id
   * @param userId user id
   * @param walletType wallet type (default: MAIN)
   * @returns wallet
   */
  public async getWallet(
    userId: string,
    walletType: WalletType = WalletType.MAIN,
  ) {
    const userWallet = await this.prisma.userWallet.findFirst({
      where: {
        user_id: userId,
        walletType: walletType,
      },
    });

    if (!userWallet) {
      return new WalletEntity(
        await this.prisma.userWallet.create({
          data: {
            user_id: userId,
            walletType: walletType,
            balance: 0,
          },
        }),
        this,
      );
    }

    return new WalletEntity(userWallet, this);
  }

  /**
   * Update wallet balance
   * @param amount amount to update
   * @param userId user id
   * @param walletType wallet type (default: MAIN)
   * @returns updated wallet
   */
  public async updateWalletBalanceOrThrow(
    amount: Decimal,
    userId: string,
    walletType: WalletType = WalletType.MAIN,
  ) {
    this.logger.log(`Setting ${+amount} to wallet ${userId} (${walletType})`);
    return this.prisma.userWallet.update({
      where: {
        user_id_walletType: {
          user_id: userId,
          walletType: walletType,
        },
      },
      data: {
        balance: amount,
      },
    });
  }

  /**
   * Get missing amount to reach required amount
   * @param requiredAmount required amount
   * @param userId user id
   * @param walletType wallet type (default: MAIN)
   * @returns missing amount
   */
  public async getMissingAmount(
    requiredAmount: Decimal,
    userId: string,
    walletType: WalletType = WalletType.MAIN,
  ) {
    const userWallet = await this.prisma.userWallet.findFirst({
      where: {
        user_id: userId,
        walletType: walletType,
      },
    });

    if (!userWallet?.balance) return requiredAmount;
    if (userWallet.balance.greaterThanOrEqualTo(requiredAmount))
      return new Decimal(0);

    return requiredAmount.minus(userWallet.balance);
  }
}
