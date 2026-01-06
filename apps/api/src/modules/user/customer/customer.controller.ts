import { DatatablePipe, DatatableQuery } from '@/common/pipes/DatatablePipe';
import { Controller, Get, Query, UsePipes } from '@nestjs/common';
import { CustomerService } from './customer.service';

@Controller('admin/customer')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Get()
  @UsePipes(DatatablePipe)
  getCustomerDatatable(@Query() queryParams: DatatableQuery) {
    return this.customerService.getCustomerDatatable(queryParams);
  }
}
