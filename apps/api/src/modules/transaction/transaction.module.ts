import { Module } from '@nestjs/common';
import { OrderModule } from '../order/order.module';
import { TRANSACTION_REPOSITORY } from './domain/repository.port';
import { transactionProviders } from './infrastructure/transaction.providers';
import { AdminTransactionController } from './presentation/admin-transaction.controller';

@Module({
  controllers: [AdminTransactionController],
  providers: [...transactionProviders],
  exports: [TRANSACTION_REPOSITORY],
  imports: [OrderModule],
})
export class TransactionModule {}
