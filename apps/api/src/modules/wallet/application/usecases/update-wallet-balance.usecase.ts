import { WalletType } from '@/generated/prisma/enums';
import { Inject, Injectable } from '@nestjs/common';
import {
  IWalletRepository,
  WALLET_REPOSITORY,
} from '../../domain/repository.port';

@Injectable()
export class UpdateWalletBalanceUseCase {
  constructor(
    @Inject(WALLET_REPOSITORY)
    private readonly walletRepo: IWalletRepository,
  ) {}

  async execute(
    amount: any,
    userId: string,
    walletType: WalletType | string = WalletType.MAIN,
  ) {
    return this.walletRepo.updateWalletBalanceOrThrow(
      amount,
      userId,
      walletType,
    );
  }
}
