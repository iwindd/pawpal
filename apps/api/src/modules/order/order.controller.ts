import { AuthUser } from '@/common/decorators/user.decorator';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { SessionAuthGuard } from '@/common/guards/session-auth.guard';
import { PurchasePipe } from '@/common/pipes/PurchasePipe';
import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { PurchaseInput, Session } from '@pawpal/shared';
import { PaymentService } from '../payment/payment.service';
import { WalletService } from '../wallet/wallet.service';
import { OrderService } from './order.service';

@Controller('order')
@UseGuards(SessionAuthGuard, JwtAuthGuard)
export class OrderController {
  constructor(
    private readonly orderService: OrderService,
    private readonly walletService: WalletService,
    private readonly paymentService: PaymentService,
  ) {}

  @Post()
  async createOrder(
    @Body(PurchasePipe) body: PurchaseInput,
    @AuthUser() user: Session,
  ) {
    return this.orderService.createOrder(user, body);
    /*     const [canPurchase, missingAmount] = await this.walletService.canPurchase(
      user.id,
      body.amount,
      true,
    );
    if (!canPurchase) {
      return {
        type: 'create_charge',
        ...(await this.paymentService.topup(
          user,
          missingAmount,
          body.paymentMethod,
        )),
      };
    }

    return {
      type: 'create_order',
      ...(await this.orderService.createOrder(user.id, body)),
    }; */
  }

  @Get('admin/test')
  test(): { message: string; status: string } {
    return {
      message: 'Order service is working correctly',
      status: 'success',
    };
  }
}
