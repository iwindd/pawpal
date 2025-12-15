import { DatatablePipe, DatatableQuery } from '@/common/pipes/DatatablePipe';
import { Controller, Get, Param, Query } from '@nestjs/common';
import { OrderService } from './order.service';

@Controller('admin/order')
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
}
