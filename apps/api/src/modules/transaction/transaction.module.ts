import { Module } from '@nestjs/common';
import { OrderModule } from '../order/order.module';
import { TransactionRepository } from './transaction.repository';
import { TransactionService } from './transaction.service';

@Module({
  providers: [TransactionService, TransactionRepository],
  exports: [TransactionService, TransactionRepository],
  imports: [OrderModule],
})
export class TransactionModule {}
