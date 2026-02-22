import { AuthUser } from '@/common/decorators/user.decorator';
import { JwtAuthGuard } from '@/common/guards/auth/jwt-auth.guard';
import { NoProgressGuard } from '@/common/guards/auth/no-progress-guard.guard';
import { SessionAuthGuard } from '@/common/guards/auth/session-auth.guard';
import { DatatablePipe, DatatableQuery } from '@/common/pipes/DatatablePipe';
import { PurchasePipe } from '@/common/pipes/PurchasePipe';
import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { PurchaseInput, Session } from '@pawpal/shared';

import { CreateOrderUseCase } from '../application/usecases/create-order.usecase';
import { GetOrderHistoryDatatableUseCase } from '../application/usecases/get-order-history-datatable.usecase';

@Controller('order')
@UseGuards(SessionAuthGuard, JwtAuthGuard)
export class OrderController {
  constructor(
    private readonly createOrderUseCase: CreateOrderUseCase,
    private readonly getOrderHistoryDatatableUseCase: GetOrderHistoryDatatableUseCase,
  ) {}

  @Get()
  async getOrderHistoryDatatable(
    @Query(DatatablePipe) query: DatatableQuery,
    @AuthUser() user: Session,
  ) {
    return this.getOrderHistoryDatatableUseCase.execute(user.id, query);
  }

  @Post()
  @UseGuards(NoProgressGuard)
  async createOrder(
    @Body(PurchasePipe) body: PurchaseInput,
    @AuthUser() user: Session,
  ) {
    return this.createOrderUseCase.execute(user, body);
  }
}
