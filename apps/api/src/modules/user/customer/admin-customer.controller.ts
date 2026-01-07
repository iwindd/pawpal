import { DatatablePipe, DatatableQuery } from '@/common/pipes/DatatablePipe';
import { Controller, Get, Param, Query } from '@nestjs/common';
import { UserService } from '../user.service';
import { CustomerService } from './customer.service';

@Controller('admin/customer')
export class AdminCustomerController {
  constructor(
    private readonly customerService: CustomerService,
    private readonly userService: UserService,
  ) {}

  @Get()
  getCustomerDatatable(@Query(DatatablePipe) query: DatatableQuery) {
    return this.customerService.getCustomerDatatable(query);
  }

  @Get(':userId/profile')
  getProfile(@Param('userId') userId: string) {
    return this.userService.getProfile(userId);
  }

  @Get(':userId/topup-history')
  getTopupHistoryDatatable(
    @Query(DatatablePipe) query: DatatableQuery,
    @Param('userId') userId: string,
  ) {
    return this.customerService.getTopupHistoryDatatable(userId, query);
  }

  @Get(':userId/order-history')
  getOrderHistoryDatatable(
    @Query(DatatablePipe) query: DatatableQuery,
    @Param('userId') userId: string,
  ) {
    return this.customerService.getOrderHistoryDatatable(userId, query);
  }
}
