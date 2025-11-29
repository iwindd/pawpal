import { BadGatewayException, Injectable, Logger } from '@nestjs/common';
import { Session } from '@pawpal/shared';
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

  async topup(user: Session, amount: number, paymentId: string) {
    const isActive = await this.paymentGatewayService.isActive(paymentId);
    if (!isActive) throw new BadGatewayException(`${paymentId} is not active`);

    switch (paymentId) {
      case 'promptpay-manual':
        return this.createPromptpayManualCharge(user, amount);
      case 'true-money-wallet-voucher':
        this.logger.warn(
          `Processing top-up of ${amount} for user ${user.id} via TrueMoney Wallet Voucher`,
        );
        throw new BadGatewayException(
          `Payment method ${paymentId} is not supported.`,
        );
      default:
        this.logger.error(
          `Payment method ${paymentId} is not supported. Falling back to default.`,
        );
        throw new BadGatewayException(
          `Payment method ${paymentId} is not supported.`,
        );
    }
  }

  private async createPromptpayManualCharge(user: Session, amount: number) {
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
    );

    return {
      ...charge,
      qrcode: generatePayload(metadata.number, {
        amount: amount,
      }),
    };
  }
}
