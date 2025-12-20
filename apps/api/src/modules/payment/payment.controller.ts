import { AuthUser } from '@/common/decorators/user.decorator';
import { JwtAuthGuard } from '@/common/guards/auth/jwt-auth.guard';
import { NoProgressGuard } from '@/common/guards/auth/no-progress-guard.guard';
import { SessionAuthGuard } from '@/common/guards/auth/session-auth.guard';
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
import { Decimal } from '@prisma/client/runtime/client';
import { PaymentService } from './payment.service';

@Controller('payment')
@UseGuards(SessionAuthGuard, JwtAuthGuard)
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('topup')
  @UseGuards(NoProgressGuard)
  createPayment(
    @Body(new ZodPipe(PaymentChargeCreateSchema))
    payload: PaymentChargeCreateInput,
    @AuthUser() user: Session,
  ) {
    return this.paymentService.topup(
      user,
      new Decimal(payload.amount),
      payload.payment_id,
    );
  }

  @Patch('topup/:chargeId')
  confirmPayment(@Param('chargeId') chargeId: string) {
    return this.paymentService.confirm(chargeId);
  }
}
