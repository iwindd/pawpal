import { Global, Module } from '@nestjs/common';
import { WALLET_REPOSITORY } from './domain/repository.port';
import { walletProviders } from './infrastructure/wallet.providers';
import { WalletService } from './wallet.service'; // We will keep it for backwards-compatibility or inject UseCases where needed

// We will export the UseCases directly so that dependent modules don't have to inject WALLET_REPOSITORY and rely on concrete Prisma
import { GetAllWalletsUseCase } from './application/usecases/get-all-wallets.usecase';
import { GetMissingAmountUseCase } from './application/usecases/get-missing-amount.usecase';
import { GetWalletUseCase } from './application/usecases/get-wallet.usecase';
import { UpdateWalletBalanceUseCase } from './application/usecases/update-wallet-balance.usecase';

@Global()
@Module({
  providers: [WalletService, ...walletProviders],
  exports: [
    WalletService,
    WALLET_REPOSITORY,
    GetWalletUseCase,
    GetAllWalletsUseCase,
    UpdateWalletBalanceUseCase,
    GetMissingAmountUseCase,
  ],
})
export class WalletModule {}
