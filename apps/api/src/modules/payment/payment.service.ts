import { Injectable, Logger } from '@nestjs/common';
import { WalletService } from '../wallet/wallet.service';

@Injectable()
export class PaymentService {
  private readonly logger = new Logger(PaymentService.name);
  constructor(private readonly walletService: WalletService) {}

  async topup(userId: string, amount: number, paymentMethod: string) {
    const charge = await this.walletService.createCharge(
      userId,
      amount,
      paymentMethod,
    );

    // TODO: Implement payment logic
    await this.walletService.successCharge(charge.id);

    return charge;
  }
}
