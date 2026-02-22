import { Inject, Injectable } from '@nestjs/common';
import {
  ITransactionRepository,
  TRANSACTION_REPOSITORY,
} from '../../domain/repository.port';

@Injectable()
export class AssignJobTransactionUseCase {
  constructor(
    @Inject(TRANSACTION_REPOSITORY)
    private readonly transactionRepo: ITransactionRepository,
  ) {}

  async execute(transactionId: string, processedBy: string) {
    return this.transactionRepo.assignJob(transactionId, processedBy);
  }
}
