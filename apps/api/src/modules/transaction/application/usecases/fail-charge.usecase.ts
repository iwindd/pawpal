import { TransactionStatus } from '@/generated/prisma/enums';
import { Inject, Injectable } from '@nestjs/common';
import { EventService } from '../../../event/application/event.service';
import { CancelOrderUseCase } from '../../../order/application/usecases/cancel-order.usecase';
import {
  ITransactionRepository,
  TRANSACTION_REPOSITORY,
} from '../../domain/repository.port';

@Injectable()
export class FailChargeUseCase {
  constructor(
    @Inject(TRANSACTION_REPOSITORY)
    private readonly transactionRepo: ITransactionRepository,
    private readonly eventService: EventService,
    private readonly cancelOrderUseCase: CancelOrderUseCase,
  ) {}

  async execute(transactionId: string, processedBy: string) {
    const transaction = await this.transactionRepo.find(transactionId);

    const updatedTransaction = await this.transactionRepo.failInstruction(
      transactionId,
      processedBy,
    );

    if (transaction.orderId) {
      await this.cancelOrderUseCase.execute(transaction.orderId, processedBy);
    }

    this.eventService.admin.onFinishedJobTransaction(
      transaction.toMapperPayload() as any,
    );
    this.eventService.user.onTopupTransactionUpdated(transaction.userId, {
      id: transaction.id,
      status: TransactionStatus.FAILED,
      balance: transaction.balanceBefore.toNumber(),
      walletType: transaction.walletType as any,
    });

    return updatedTransaction;
  }
}
