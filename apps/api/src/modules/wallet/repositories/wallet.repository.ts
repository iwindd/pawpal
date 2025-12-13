import { Prisma } from '@/generated/prisma/client';
import {
  TransactionStatus,
  TransactionType,
  WalletType,
} from '@/generated/prisma/enums';
import { Injectable, Logger } from '@nestjs/common';
import { Decimal } from '@prisma/client/runtime/client';
import { PrismaService } from '../../prisma/prisma.service';
import { WalletEntity } from '../entities/wallet.entity';

export const DEFAULT_WALLET_SELECT = {
  id: true,
  balance: true,
  walletType: true,
  user_id: true,
} satisfies Prisma.UserWalletSelect;

@Injectable()
export class WalletRepository {
  private readonly logger = new Logger(WalletRepository.name);
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Create wallet entity from user wallet
   * @param userWallet user wallet
   * @returns wallet entity
   */
  public from(
    userWallet: Prisma.UserWalletGetPayload<{
      select: typeof DEFAULT_WALLET_SELECT;
    }>,
  ) {
    return new WalletEntity(userWallet, this);
  }

  /**
   * Get wallet by user id
   * @param userId user id
   * @param walletType wallet type (default: MAIN)
   * @returns wallet
   */
  public async find(userId: string, walletType: WalletType = WalletType.MAIN) {
    const userWallet = await this.prisma.userWallet.findFirst({
      where: {
        user_id: userId,
        walletType: walletType,
      },
      select: DEFAULT_WALLET_SELECT,
    });

    if (!userWallet) {
      return this.from(
        await this.prisma.userWallet.create({
          data: {
            user_id: userId,
            walletType: walletType,
            balance: 0,
          },
          select: DEFAULT_WALLET_SELECT,
        }),
      );
    }

    return this.from(userWallet);
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

  /**
   * Create charge
   * @param userId user id
   * @param amount amount to charge
   * @param paymentGatewayId payment gateway id
   * @param orderId order id (optional)
   * @param status transaction status (default: CREATED)
   * @param walletType wallet type (default: MAIN)
   * @returns created charge
   */
  public async createCharge(
    userId: string,
    amount: Decimal,
    paymentGatewayId: string,
    orderId?: string,
    status: TransactionStatus = TransactionStatus.CREATED,
    walletType: WalletType = WalletType.MAIN,
  ) {
    const wallet = await this.find(userId, walletType);
    const charge = await this.prisma.userWalletTransaction.create({
      data: {
        type: orderId
          ? TransactionType.TOPUP_FOR_PURCHASE
          : TransactionType.TOPUP,
        wallet_id: wallet.id,
        balance_before: wallet.balance,
        balance_after: wallet.balance.plus(amount),
        payment_gateway_id: paymentGatewayId,
        status,
        ...(orderId ? { order_id: orderId } : {}),
      },
      select: {
        id: true,
        type: true,
        amount: true,
        status: true,
        payment: {
          select: {
            id: true,
            metadata: true,
          },
        },
        createdAt: true,
        order: {
          select: {
            id: true,
          },
        },
      },
    });

    return charge;
  }
}
