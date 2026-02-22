import { Provider } from '@nestjs/common';
import { TRANSACTION_REPOSITORY } from '../domain/repository.port';
import { PrismaTransactionRepository } from './prisma/prisma-transaction.repository';

import { AssignJobTransactionUseCase } from '../application/usecases/assign-job-transaction.usecase';
import { FailChargeUseCase } from '../application/usecases/fail-charge.usecase';
import { GetJobTransactionsDatatableUseCase } from '../application/usecases/get-job-transactions-datatable.usecase';
import { GetTransactionUseCase } from '../application/usecases/get-transaction.usecase';
import { SuccessChargeUseCase } from '../application/usecases/success-charge.usecase';

export const transactionProviders: Provider[] = [
  {
    provide: TRANSACTION_REPOSITORY,
    useClass: PrismaTransactionRepository,
  },
  GetTransactionUseCase,
  SuccessChargeUseCase,
  FailChargeUseCase,
  AssignJobTransactionUseCase,
  GetJobTransactionsDatatableUseCase,
];
