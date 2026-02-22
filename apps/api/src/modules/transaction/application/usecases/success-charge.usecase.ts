import { OrderResponseMapper } from '@/common/mappers/OrderResponseMapper';
import { TransactionStatus, TransactionType } from '@/generated/prisma/client';
import { Inject, Injectable } from '@nestjs/common';
import { EventService } from '../../../event/event.service';
import { UpdateWalletBalanceUseCase } from '../../../wallet/application/usecases/update-wallet-balance.usecase';
import {
  ITransactionRepository,
  TRANSACTION_REPOSITORY,
} from '../../domain/repository.port';

@Injectable()
export class SuccessChargeUseCase {
  constructor(
    @Inject(TRANSACTION_REPOSITORY)
    private readonly transactionRepo: ITransactionRepository,
    private readonly updateWalletBalance: UpdateWalletBalanceUseCase,
    private readonly eventService: EventService,
  ) {}

  async execute(transactionId: string, processedBy: string) {
    const transaction = await this.transactionRepo.find(transactionId);

    // Using string comparison since Prisma literal enum imports were removed from pure TS domain
    if (transaction.type === TransactionType.PURCHASE) {
      throw new Error('Transaction is not topup transaction');
    }

    const updatedTransaction = await this.transactionRepo.successInstruction(
      transactionId,
      processedBy,
    );

    switch (transaction.type) {
      case TransactionType.TOPUP: {
        this.updateWalletBalance.execute(
          transaction.balanceAfter,
          transaction.userId,
          transaction.walletType as any,
        );

        this.eventService.admin.onFinishedJobTransaction(
          transaction.toMapperPayload() as any,
        );
        this.eventService.user.onTopupTransactionUpdated(transaction.userId, {
          id: transaction.id,
          status: TransactionStatus.SUCCEEDED as any,
          balance: transaction.balanceAfter.toNumber(),
          walletType: transaction.walletType as any,
        });
        break;
      }
      case TransactionType.TOPUP_FOR_PURCHASE: {
        await this.transactionRepo.setOrderPending(transaction.orderId!);

        const total = transaction.total.minus(transaction.balanceAfter).abs();

        await this.transactionRepo.create({
          amount: total,
          balanceBefore: transaction.balanceAfter,
          balanceAfter: total,
          type: TransactionType.PURCHASE,
          status: TransactionStatus.PENDING,
          wallet: { connect: { id: transaction.walletId } },
          order: { connect: { id: transaction.orderId } },
        });

        this.updateWalletBalance.execute(
          total,
          transaction.userId,
          transaction.walletType as any,
        );

        const orderData = await this.transactionRepo.getOrderResponse(
          transaction.orderId!,
        );

        this.eventService.admin.onNewJobOrder(
          OrderResponseMapper.fromQuery(orderData),
        );
        break;
      }
    }

    return updatedTransaction;
  }
}
