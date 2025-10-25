import { BadGatewayException, Injectable, Logger } from '@nestjs/common';
import { WalletService } from '../wallet/wallet.service';

@Injectable()
export class PaymentService {
  private readonly logger = new Logger(PaymentService.name);
  constructor(private readonly walletService: WalletService) {}

  async topup(userId: string, amount: number, paymentMethod: string) {
    switch (paymentMethod) {
      case 'promptpay-manual':
        this.logger.warn(
          `Processing top-up of ${amount} for user ${userId} via Promtpay Manual`,
        );
        break;
      case 'true-money-wallet-voucher':
        this.logger.warn(
          `Processing top-up of ${amount} for user ${userId} via TrueMoney Wallet Voucher`,
        );
        break;
      default:
        this.logger.error(
          `Payment method ${paymentMethod} is not supported. Falling back to default.`,
        );
        throw new BadGatewayException(
          `Payment method ${paymentMethod} is not supported.`,
        );
    }
  }
}
