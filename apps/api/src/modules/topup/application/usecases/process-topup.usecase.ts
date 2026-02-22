import { TransactionResponseMapper } from '@/common/mappers/TransactionResponseMapper';
import { TransactionStatus } from '@/generated/prisma/enums';
import {
  BadGatewayException,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { Session } from '@pawpal/shared';
import generatePayload from 'promptpay-qr';
import { EventService } from '../../../event/application/event.service';
import { PaymentGatewayService } from '../../../payment-gateway/payment-gateway.service';
import { GetWalletUseCase } from '../../../wallet/application/usecases/get-wallet.usecase';
import {
  ITopupRepository,
  TOPUP_REPOSITORY,
} from '../../domain/repository.port';

@Injectable()
export class ProcessTopupUseCase {
  private readonly logger = new Logger(ProcessTopupUseCase.name);

  constructor(
    @Inject(TOPUP_REPOSITORY)
    private readonly topupRepo: ITopupRepository,
    private readonly paymentGatewayService: PaymentGatewayService,
    private readonly eventService: EventService,
    private readonly getWallet: GetWalletUseCase,
  ) {}

  async execute(user: Session, amount: any, topupId: string, orderId?: string) {
    const isActive = await this.paymentGatewayService.isActive(topupId);
    if (!isActive) throw new BadGatewayException(`${topupId} is not active`);

    if (topupId === 'promptpay-manual') {
      return this.createPromptpayManualCharge(user, amount, orderId);
    }

    this.logger.error(`Payment method ${topupId} is not supported`);
    throw new BadGatewayException(
      `Payment method ${topupId} is not supported.`,
    );
  }

  private async createPromptpayManualCharge(
    user: Session,
    amount: any,
    orderId?: string,
  ) {
    const gateway =
      await this.paymentGatewayService.getGateway('promptpay-manual');
    const metadata = gateway.metadata as { name?: string; number?: string };

    if (!metadata?.number || !metadata?.name) {
      throw new BadGatewayException('Metadata not found');
    }

    const wallet = await this.getWallet.execute(user.id);
    const charge = await this.topupRepo.createCharge(
      user.id,
      amount,
      gateway.id,
      wallet.id,
      wallet.balance,
      orderId,
      TransactionStatus.CREATED,
    );

    this.eventService.admin.onNewJobTransaction(
      TransactionResponseMapper.fromQuery(charge),
    );

    return {
      ...charge,
      qrcode: generatePayload(metadata.number, {
        amount: amount.toNumber(),
      }),
    };
  }
}
