import { AuthUser } from '@/common/decorators/user.decorator';
import { JwtAuthGuard } from '@/common/guards/auth/jwt-auth.guard';
import { SessionAuthGuard } from '@/common/guards/auth/session-auth.guard';
import { DatatablePipe, DatatableQuery } from '@/common/pipes/DatatablePipe';
import {
  Controller,
  Get,
  Param,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import { Session } from '@pawpal/shared';
import { OrderService } from '../order.service';

@Controller('admin/order')
@UseGuards(SessionAuthGuard, JwtAuthGuard)
export class AdminOrderController {
  constructor(private readonly orderService: OrderService) {}

  @Get('/topup')
  getTopupOrderDatatable(@Query(DatatablePipe) query: DatatableQuery) {
    return this.orderService.getTopupOrderDatatable(query);
  }

  @Get(':id')
  getOrder(@Param('id') id: string) {
    return this.orderService.findOne(id);
  }

  @Patch(':id/completed')
  completeOrder(@Param('id') id: string, @AuthUser() user: Session) {
    return this.orderService.completeOrder(id, user.id);
  }

  @Patch(':id/cancelled')
  cancelOrder(@Param('id') id: string, @AuthUser() user: Session) {
    return this.orderService.cancelOrder(id, user.id);
  }
}
