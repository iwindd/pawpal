import { TransactionStatus } from '@/generated/prisma/enums';
import { BadGatewayException, Injectable, Logger } from '@nestjs/common';
import { Session } from '@pawpal/shared';
import { Decimal } from '@prisma/client/runtime/client';
import generatePayload from 'promptpay-qr';
import { PaymentGatewayService } from '../payment-gateway/payment-gateway.service';
import { WalletService } from '../wallet/wallet.service';

@Injectable()
export class PaymentService {
  private readonly logger = new Logger(PaymentService.name);
  constructor(
    private readonly walletService: WalletService,
    private readonly paymentGatewayService: PaymentGatewayService,
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
    const charge = await this.walletService.getChargeById(chargeId);
    if (!charge) throw new BadGatewayException('Charge not found');

    if (charge.status !== TransactionStatus.CREATED)
      throw new BadGatewayException('Charge is already processed');

    return this.walletService.changeTransactionStatus(chargeId, {
      status: TransactionStatus.PENDING,
    });
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

    const charge = await this.walletService.createCharge(
      user.id,
      amount,
      gateway,
      orderId,
    );

    return {
      ...charge,
      qrcode: generatePayload(metadata.number, {
        amount: amount.toNumber(),
      }),
    };
  }
}
