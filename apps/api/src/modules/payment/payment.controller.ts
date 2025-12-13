import { AuthUser } from '@/common/decorators/user.decorator';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { SessionAuthGuard } from '@/common/guards/session-auth.guard';
import { ZodPipe } from '@/common/pipes/ZodPipe';
import {
  Body,
  Controller,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  PaymentChargeCreateInput,
  PaymentChargeCreateSchema,
  Session,
} from '@pawpal/shared';
import { PaymentService } from './payment.service';

@Controller('payment')
@UseGuards(SessionAuthGuard, JwtAuthGuard)
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('topup')
  createPayment(
    @Body(new ZodPipe(PaymentChargeCreateSchema))
    payload: PaymentChargeCreateInput,
    @AuthUser() user: Session,
  ) {
    return this.paymentService.topup(user, payload.amount, payload.payment_id);
  }

  @Patch('topup/:chargeId')
  confirmPayment(@Param('chargeId') chargeId: string) {
    return this.paymentService.confirm(chargeId);
  }
}
