import { Inject, Injectable } from '@nestjs/common';
import {
  IWalletRepository,
  WALLET_REPOSITORY,
} from '../../domain/repository.port';

@Injectable()
export class GetAllWalletsUseCase {
  constructor(
    @Inject(WALLET_REPOSITORY)
    private readonly walletRepo: IWalletRepository,
  ) {}

  async execute(userId: string) {
    return this.walletRepo.findAll(userId);
  }
}
