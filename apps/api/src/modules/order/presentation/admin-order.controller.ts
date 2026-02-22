import { Permissions } from '@/common/decorators/permissions.decorator';
import { AuthUser } from '@/common/decorators/user.decorator';
import { JwtAuthGuard } from '@/common/guards/auth/jwt-auth.guard';
import { SessionAuthGuard } from '@/common/guards/auth/session-auth.guard';
import { PermissionGuard } from '@/common/guards/permission.guard';
import { DatatablePipe, DatatableQuery } from '@/common/pipes/DatatablePipe';
import {
  Controller,
  Get,
  Param,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import { PermissionEnum, Session } from '@pawpal/shared';

import { CancelOrderUseCase } from '../application/usecases/cancel-order.usecase';
import { CompleteOrderUseCase } from '../application/usecases/complete-order.usecase';
import { GetOrderUseCase } from '../application/usecases/get-order.usecase';
import { GetTopupOrderDatatableUseCase } from '../application/usecases/get-topup-order-datatable.usecase';

@Controller('admin/order')
@UseGuards(SessionAuthGuard, JwtAuthGuard, PermissionGuard)
@Permissions(PermissionEnum.OrderManagement)
export class AdminOrderController {
  constructor(
    private readonly getTopupOrderDatatableUseCase: GetTopupOrderDatatableUseCase,
    private readonly getOrderUseCase: GetOrderUseCase,
    private readonly completeOrderUseCase: CompleteOrderUseCase,
    private readonly cancelOrderUseCase: CancelOrderUseCase,
  ) {}

  @Get('/topup')
  getTopupOrderDatatable(@Query(DatatablePipe) query: DatatableQuery) {
    return this.getTopupOrderDatatableUseCase.execute(query);
  }

  @Get(':id')
  getOrder(@Param('id') id: string) {
    return this.getOrderUseCase.execute(id);
  }

  @Patch(':id/completed')
  completeOrder(@Param('id') id: string, @AuthUser() user: Session) {
    return this.completeOrderUseCase.execute(id, user.id);
  }

  @Patch(':id/cancelled')
  cancelOrder(@Param('id') id: string, @AuthUser() user: Session) {
    return this.cancelOrderUseCase.execute(id, user.id);
  }
}
