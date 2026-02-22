import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { ENUM_ORDER_STATUS } from '@pawpal/shared';
import { EventService } from '../../../event/application/event.service';
import { UpdateWalletBalanceUseCase } from '../../../wallet/application/usecases/update-wallet-balance.usecase';
import {
  IOrderRepository,
  ORDER_REPOSITORY,
} from '../../domain/repository.port';

@Injectable()
export class CancelOrderUseCase {
  private readonly logger = new Logger(CancelOrderUseCase.name);

  constructor(
    @Inject(ORDER_REPOSITORY)
    private readonly orderRepo: IOrderRepository,
    private readonly eventService: EventService,
    private readonly updateWalletBalance: UpdateWalletBalanceUseCase,
  ) {}

  async execute(id: string, processedBy: string) {
    const order = await this.orderRepo.find(id);
    if (!order) throw new BadRequestException('invalid_order');

    const purchaseTransaction = order.purchaseTransaction;
    if (!purchaseTransaction) throw new BadRequestException('invalid_order');

    await this.orderRepo.failTransaction(purchaseTransaction.id);

    await this.updateWalletBalance.execute(
      purchaseTransaction.balanceBefore,
      order.userId,
      purchaseTransaction.wallet.walletType as any,
    );

    await this.orderRepo.cancel(id, processedBy);

    this.eventService.user.onPurchaseTransactionUpdated(order.userId, {
      id: order.id,
      status: ENUM_ORDER_STATUS.CANCELLED as any,
      wallet: {
        balance: purchaseTransaction.balanceBefore.toNumber(),
        type: purchaseTransaction.wallet.walletType as any,
      },
    });

    this.logger.log(`Canceling order ${order.id}`);

    const orderResponse = await this.orderRepo.toOrderResponse(order.id);
    return orderResponse;
  }
}
