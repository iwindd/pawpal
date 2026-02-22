import { TransactionResponseMapper } from '@/common/mappers/TransactionResponseMapper';
import { FieldAfterParse } from '@/common/pipes/PurchasePipe';
import { Inject, Injectable } from '@nestjs/common';
import { PurchaseInput, Session } from '@pawpal/shared';
import { EventService } from '../../../event/application/event.service';
import { ProcessTopupUseCase } from '../../../topup/application/usecases/process-topup.usecase';
import { GetWalletUseCase } from '../../../wallet/application/usecases/get-wallet.usecase';
import { UpdateWalletBalanceUseCase } from '../../../wallet/application/usecases/update-wallet-balance.usecase';
import {
  IOrderRepository,
  ORDER_REPOSITORY,
} from '../../domain/repository.port';

@Injectable()
export class CreateOrderUseCase {
  constructor(
    @Inject(ORDER_REPOSITORY)
    private readonly orderRepo: IOrderRepository,
    private readonly processTopup: ProcessTopupUseCase,
    private readonly eventService: EventService,
    private readonly getWallet: GetWalletUseCase,
    private readonly updateWalletBalance: UpdateWalletBalanceUseCase,
  ) {}

  async execute(user: Session, body: PurchaseInput<FieldAfterParse>) {
    const productPackage = await this.orderRepo.getProductPackage(
      body.packageId,
    );
    if (!productPackage) throw new Error('Package not found');

    const totalPrice = productPackage.price.mul(body.amount);
    const userWallet = await this.getWallet.execute(user.id);
    const topupAmount = body.includeWalletBalance
      ? userWallet.calculateMissingAmount(totalPrice)
      : totalPrice;

    const { order, transaction, balanceAfter } =
      await this.orderRepo.createOrderAndTransaction(
        user.id,
        body,
        productPackage,
        totalPrice,
        userWallet,
        topupAmount,
      );

    if (topupAmount.greaterThan(0)) {
      return {
        type: 'topup',
        charge: await this.processTopup.execute(
          user,
          topupAmount,
          body.paymentMethod,
          order.id,
        ),
      };
    } else {
      await this.updateWalletBalance.execute(
        balanceAfter,
        userWallet.userId,
        userWallet.walletType,
      );
      await this.orderRepo.setPending(order.id);

      const orderResponse = await this.orderRepo.toOrderResponse(order.id);

      this.eventService.admin.onNewJobOrder(orderResponse);

      return {
        type: 'purchase',
        transaction: TransactionResponseMapper.fromQuery(transaction),
        wallet: {
          balance: userWallet.balance.toNumber(),
          type: userWallet.walletType,
        },
      };
    }
  }
}
