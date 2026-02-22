import { Provider } from '@nestjs/common';
import { WALLET_REPOSITORY } from '../domain/repository.port';
import { PrismaWalletRepository } from './prisma/prisma-wallet.repository';

import { GetAllWalletsUseCase } from '../application/usecases/get-all-wallets.usecase';
import { GetMissingAmountUseCase } from '../application/usecases/get-missing-amount.usecase';
import { GetWalletUseCase } from '../application/usecases/get-wallet.usecase';
import { UpdateWalletBalanceUseCase } from '../application/usecases/update-wallet-balance.usecase';

export const walletProviders: Provider[] = [
  {
    provide: WALLET_REPOSITORY,
    useClass: PrismaWalletRepository,
  },
  GetWalletUseCase,
  GetAllWalletsUseCase,
  UpdateWalletBalanceUseCase,
  GetMissingAmountUseCase,
];
