import { Inject, Injectable } from '@nestjs/common';
import {
  ITransactionRepository,
  TRANSACTION_REPOSITORY,
} from '../../domain/repository.port';

@Injectable()
export class GetTransactionUseCase {
  constructor(
    @Inject(TRANSACTION_REPOSITORY)
    private readonly transactionRepo: ITransactionRepository,
  ) {}

  async execute(id: string) {
    return this.transactionRepo.getTransactionDetail(id);
  }
}
