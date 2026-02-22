import { DatatableQuery } from '@/common/pipes/DatatablePipe';
import { Inject, Injectable } from '@nestjs/common';
import {
  ITransactionRepository,
  TRANSACTION_REPOSITORY,
} from '../../domain/repository.port';

@Injectable()
export class GetJobTransactionsDatatableUseCase {
  constructor(
    @Inject(TRANSACTION_REPOSITORY)
    private readonly transactionRepo: ITransactionRepository,
  ) {}

  async execute(query: DatatableQuery) {
    return this.transactionRepo.getJobTransactionsDatatable(query);
  }
}
