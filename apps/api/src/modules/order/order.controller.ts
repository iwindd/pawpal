import { AuthUser } from '@/common/decorators/user.decorator';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { SessionAuthGuard } from '@/common/guards/session-auth.guard';
import { PurchasePipe } from '@/common/pipes/PurchasePipe';
import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { PurchaseInput, Session } from '@pawpal/shared';
import { OrderService } from './order.service';

@Controller('order')
@UseGuards(SessionAuthGuard, JwtAuthGuard)
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  async createOrder(
    @Body(PurchasePipe) body: PurchaseInput,
    @AuthUser() user: Session,
  ) {
    return this.orderService.createOrder(user.id, body);
  }

  @Get('admin/test')
  test(): { message: string; status: string } {
    return {
      message: 'Order service is working correctly',
      status: 'success',
    };
  }
}
