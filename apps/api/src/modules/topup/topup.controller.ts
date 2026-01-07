import { AuthUser } from '@/common/decorators/user.decorator';
import { JwtAuthGuard } from '@/common/guards/auth/jwt-auth.guard';
import { NoProgressGuard } from '@/common/guards/auth/no-progress-guard.guard';
import { SessionAuthGuard } from '@/common/guards/auth/session-auth.guard';
import { DatatablePipe, DatatableQuery } from '@/common/pipes/DatatablePipe';
import { ZodPipe } from '@/common/pipes/ZodPipe';
import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  PaymentChargeCreateInput,
  PaymentChargeCreateSchema,
  Session,
} from '@pawpal/shared';
import { Decimal } from '@prisma/client/runtime/client';
import { TopupService } from './topup.service';

@Controller('topup')
@UseGuards(SessionAuthGuard, JwtAuthGuard)
export class TopupController {
  constructor(private readonly topupService: TopupService) {}

  @Get()
  async getTopupHistoryDatatable(
    @Query(DatatablePipe) query: DatatableQuery,
    @AuthUser() user: Session,
  ) {
    return this.topupService.getTopupHistoryDatatable(user.id, query);
  }

  @Post()
  @UseGuards(NoProgressGuard)
  createPayment(
    @Body(new ZodPipe(PaymentChargeCreateSchema))
    payload: PaymentChargeCreateInput,
    @AuthUser() user: Session,
  ) {
    return this.topupService.topup(
      user,
      new Decimal(payload.amount),
      payload.payment_id,
    );
  }

  @Patch(':chargeId')
  confirmPayment(@Param('chargeId') chargeId: string) {
    return this.topupService.confirm(chargeId);
  }
}
