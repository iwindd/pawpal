import { AuthUser } from '@/common/decorators/user.decorator';
import { JwtAuthGuard } from '@/common/guards/auth/jwt-auth.guard';
import { SessionAuthGuard } from '@/common/guards/auth/session-auth.guard';
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
  }

  @Get('admin/test')
  test(): { message: string; status: string } {
    return {
      message: 'Order service is working correctly',
      status: 'success',
    };
  }
}
