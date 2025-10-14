import { ZodValidationPipe } from '@/common/ZodValidationPipe';
import { Controller, Get, Param, Query, UsePipes } from '@nestjs/common';
import {
  AdminOrderResponse,
  DatatableQueryDto,
  DatatableQuerySchema,
  DatatableResponse,
} from '@pawpal/shared';
import { OrderService } from './order.service';

@Controller('admin/order')
export class AdminOrderController {
  constructor(private readonly orderService: OrderService) {}

  @Get()
  @UsePipes(new ZodValidationPipe(DatatableQuerySchema))
  async getOrders(
    @Query() queryParams: DatatableQueryDto,
  ): Promise<DatatableResponse<AdminOrderResponse>> {
    return this.orderService.getOrdersForAdmin(queryParams);
  }

  @Get(':id')
  getOrder(@Param('id') id: string) {
    return this.orderService.findOne(id);
  }
}
