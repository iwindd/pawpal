import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { ENUM_ORDER_STATUS } from '@pawpal/shared';
import { EventService } from '../../../event/event.service';
import {
  IOrderRepository,
  ORDER_REPOSITORY,
} from '../../domain/repository.port';

@Injectable()
export class CompleteOrderUseCase {
  private readonly logger = new Logger(CompleteOrderUseCase.name);

  constructor(
    @Inject(ORDER_REPOSITORY)
    private readonly orderRepo: IOrderRepository,
    private readonly eventService: EventService,
  ) {}

  async execute(id: string, processedBy: string) {
    const order = await this.orderRepo.find(id, {
      status: ENUM_ORDER_STATUS.PENDING as any,
    });
    if (!order) throw new BadRequestException('invalid_order');

    const purchaseTransaction = order.purchaseTransaction;
    if (!purchaseTransaction) throw new BadRequestException('invalid_order');

    await this.orderRepo.successTransaction(
      purchaseTransaction.id,
      processedBy,
    );

    await this.orderRepo.complete(id, processedBy);
    const orderResponse = await this.orderRepo.toOrderResponse(order.id);

    this.eventService.admin.onFinishedJobOrder(orderResponse);
    this.eventService.user.onPurchaseTransactionUpdated(order.userId, {
      id: order.id,
      status: ENUM_ORDER_STATUS.COMPLETED as any,
      wallet: {
        balance: purchaseTransaction.balanceAfter.toNumber(),
        type: purchaseTransaction.wallet.walletType as any,
      },
    });

    this.logger.log(`Completed order ${order.id}`);
    return orderResponse;
  }
}
