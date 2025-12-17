import { Module } from '@nestjs/common';
import { OrderModule } from '../order/order.module';
import { AdminTransactionController } from './admin-transaction.controller';
import { TransactionRepository } from './transaction.repository';
import { TransactionService } from './transaction.service';

@Module({
  controllers: [AdminTransactionController],
  providers: [TransactionService, TransactionRepository],
  exports: [TransactionService, TransactionRepository],
  imports: [OrderModule],
})
export class TransactionModule {}
