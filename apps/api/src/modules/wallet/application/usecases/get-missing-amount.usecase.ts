import { WalletType } from '@/generated/prisma/enums';
import { Inject, Injectable } from '@nestjs/common';
import {
  IWalletRepository,
  WALLET_REPOSITORY,
} from '../../domain/repository.port';

@Injectable()
export class GetMissingAmountUseCase {
  constructor(
    @Inject(WALLET_REPOSITORY)
    private readonly walletRepo: IWalletRepository,
  ) {}

  async execute(
    requiredAmount: any,
    userId: string,
    walletType: WalletType | string = WalletType.MAIN,
  ) {
    return this.walletRepo.getMissingAmount(requiredAmount, userId, walletType);
  }
}
