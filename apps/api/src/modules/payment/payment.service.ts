import { TransactionStatus } from '@/generated/prisma/enums';
import { BadGatewayException, Injectable, Logger } from '@nestjs/common';
import { Session } from '@pawpal/shared';
import { Decimal } from '@prisma/client/runtime/client';
import generatePayload from 'promptpay-qr';
import { EventService } from '../event/event.service';
import { PaymentGatewayService } from '../payment-gateway/payment-gateway.service';
import { UserWalletTransactionRepository } from '../wallet/repositories/userWalletTransaction.repository';
import { WalletRepository } from '../wallet/repositories/wallet.repository';

@Injectable()
export class PaymentService {
  private readonly logger = new Logger(PaymentService.name);
  constructor(
    private readonly paymentGatewayService: PaymentGatewayService,
    private readonly walletRepo: WalletRepository,
    private readonly userWalletTransactionRepo: UserWalletTransactionRepository,
    private readonly eventService: EventService,
  ) {}

  async topup(
    user: Session,
    amount: Decimal,
    paymentId: string,
    orderId?: string,
  ) {
    const isActive = await this.paymentGatewayService.isActive(paymentId);
    if (!isActive) throw new BadGatewayException(`${paymentId} is not active`);

    switch (paymentId) {
      case 'promptpay-manual':
        return this.createPromptpayManualCharge(user, amount, orderId);
      default:
        this.logger.error(
          `Payment method ${paymentId} is not supported. Falling back to default.`,
        );
        throw new BadGatewayException(
          `Payment method ${paymentId} is not supported.`,
        );
    }
  }

  async confirm(chargeId: string) {
    const charge = await this.userWalletTransactionRepo.find(chargeId);

    if (charge.status !== TransactionStatus.CREATED)
      throw new BadGatewayException('Charge is already processed');

    await charge.updateStatus(TransactionStatus.PENDING);
    this.eventService.admin.onNewJobTransaction();

    return charge.toJson();
  }

  private async createPromptpayManualCharge(
    user: Session,
    amount: Decimal,
    orderId?: string,
  ) {
    const gateway =
      await this.paymentGatewayService.getGateway('promptpay-manual');

    const metadata = gateway.metadata as { name?: string; number?: string };

    if (!metadata) throw new BadGatewayException('Metadata not found');
    if (!metadata.number) throw new BadGatewayException('Metadata not found');
    if (!metadata.name) throw new BadGatewayException('Metadata not found');

    const wallet = await this.walletRepo.find(user.id);
    const charge = await wallet.createCharge(amount, gateway.id, orderId);

    if (charge.status != TransactionStatus.CREATED) {
      this.eventService.admin.onNewJobTransaction();
    }

    return {
      ...charge,
      qrcode: generatePayload(metadata.number, {
        amount: amount.toNumber(),
      }),
    };
  }
}
