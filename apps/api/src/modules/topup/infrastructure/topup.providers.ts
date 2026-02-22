import { Provider } from '@nestjs/common';
import { TOPUP_REPOSITORY } from '../domain/repository.port';
import { PrismaTopupRepository } from './prisma/prisma-topup.repository';

import { ConfirmTopupUseCase } from '../application/usecases/confirm-topup.usecase';
import { GetTopupHistoryDatatableUseCase } from '../application/usecases/get-topup-history-datatable.usecase';
import { ProcessTopupUseCase } from '../application/usecases/process-topup.usecase';

export const topupProviders: Provider[] = [
  {
    provide: TOPUP_REPOSITORY,
    useClass: PrismaTopupRepository,
  },
  GetTopupHistoryDatatableUseCase,
  ProcessTopupUseCase,
  ConfirmTopupUseCase,
];
