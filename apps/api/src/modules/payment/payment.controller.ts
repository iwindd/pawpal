import { AuthUser } from '@/common/decorators/user.decorator';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { SessionAuthGuard } from '@/common/guards/session-auth.guard';
import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { Session } from '@pawpal/shared';
import { PaymentService } from './payment.service';

@Controller('payment')
@UseGuards(SessionAuthGuard, JwtAuthGuard)
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('topup')
  async topup(
    @Body() body: { amount: number; payment_method: string },
    @AuthUser() user: Session,
  ) {
    return this.paymentService.topup(user.id, body.amount, body.payment_method);
  }
}
