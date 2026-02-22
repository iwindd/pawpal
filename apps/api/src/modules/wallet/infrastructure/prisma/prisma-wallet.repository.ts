import { Prisma } from '@/generated/prisma/client';
import { WalletType } from '@/generated/prisma/enums';
import { Injectable, Logger } from '@nestjs/common';
import { Decimal } from '@prisma/client/runtime/client';
import { PrismaService } from '../../../prisma/prisma.service';
import { Wallet } from '../../domain/entities/wallet';
import { IWalletRepository } from '../../domain/repository.port';

@Injectable()
export class PrismaWalletRepository implements IWalletRepository {
  private readonly logger = new Logger(PrismaWalletRepository.name);
  constructor(private readonly prisma: PrismaService) {}

  static get DEFAULT_SELECT() {
    return {
      id: true,
      balance: true,
      walletType: true,
      userId: true,
    } satisfies Prisma.UserWalletSelect;
  }

  public from(
    userWallet: Prisma.UserWalletGetPayload<{
      select: typeof PrismaWalletRepository.DEFAULT_SELECT;
    }>,
  ): Wallet {
    return new Wallet(
      userWallet.id,
      userWallet.userId,
      userWallet.balance,
      userWallet.walletType as any,
    );
  }

  public async find(
    userId: string,
    walletType: WalletType | string = WalletType.MAIN,
  ): Promise<Wallet> {
    const userWallet = await this.prisma.userWallet.findFirst({
      where: {
        userId: userId,
        walletType: walletType as WalletType,
      },
      select: PrismaWalletRepository.DEFAULT_SELECT,
    });

    if (!userWallet) {
      const createdWallet = await this.prisma.userWallet.create({
        data: {
          userId: userId,
          walletType: walletType as WalletType,
          balance: 0,
        },
        select: PrismaWalletRepository.DEFAULT_SELECT,
      });
      return this.from(createdWallet);
    }

    return this.from(userWallet);
  }

  public async findAll(userId: string): Promise<Wallet[]> {
    const userWallets = await this.prisma.userWallet.findMany({
      where: {
        userId: userId,
      },
      select: PrismaWalletRepository.DEFAULT_SELECT,
    });

    if (userWallets.length <= 0) {
      const defaultWallet = await this.find(userId, WalletType.MAIN);
      return [defaultWallet];
    }

    return userWallets.map((userWallet) => this.from(userWallet));
  }

  public async updateWalletBalanceOrThrow(
    amount: Decimal,
    userId: string,
    walletType: WalletType | string = WalletType.MAIN,
  ): Promise<Wallet> {
    this.logger.log(`Setting ${+amount} to wallet ${userId} (${walletType})`);
    const updatedWallet = await this.prisma.userWallet.update({
      where: {
        userId_walletType: {
          userId: userId,
          walletType: walletType as WalletType,
        },
      },
      data: {
        balance: amount,
      },
      select: PrismaWalletRepository.DEFAULT_SELECT,
    });

    return this.from(updatedWallet);
  }

  public async getMissingAmount(
    requiredAmount: Decimal,
    userId: string,
    walletType: WalletType | string = WalletType.MAIN,
  ): Promise<Decimal> {
    const userWallet = await this.prisma.userWallet.findFirst({
      where: {
        userId: userId,
        walletType: walletType as WalletType,
      },
    });

    if (!userWallet?.balance) return requiredAmount;
    if (userWallet.balance.greaterThanOrEqualTo(requiredAmount)) {
      return new Decimal(0);
    }

    return requiredAmount.minus(userWallet.balance);
  }
}
