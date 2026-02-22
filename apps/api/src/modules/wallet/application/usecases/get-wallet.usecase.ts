import { WalletType } from '@/generated/prisma/enums';
import { Inject, Injectable } from '@nestjs/common';
import {
  IWalletRepository,
  WALLET_REPOSITORY,
} from '../../domain/repository.port';

@Injectable()
export class GetWalletUseCase {
  constructor(
    @Inject(WALLET_REPOSITORY)
    private readonly walletRepo: IWalletRepository,
  ) {}

  async execute(
    userId: string,
    walletType: WalletType | string = WalletType.MAIN,
  ) {
    return this.walletRepo.find(userId, walletType);
  }
}
