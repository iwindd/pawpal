import { DatatablePipe, DatatableQuery } from '@/common/pipes/DatatablePipe';
import { Controller, Get, Param, Query } from '@nestjs/common';
import { EmployeeService } from './employee.service';

@Controller('admin/employee')
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}

  @Get()
  getEmployeeDatatable(@Query(DatatablePipe) query: DatatableQuery) {
    return this.employeeService.getEmployeeDatatable(query);
  }

  @Get(':userId/processed-topup-history')
  getProcessedTopupHistoryDatatable(
    @Query(DatatablePipe) query: DatatableQuery,
    @Param('userId') userId: string,
  ) {
    return this.employeeService.getProcessedTopupHistoryDatatable(
      userId,
      query,
    );
  }

  @Get(':userId/processed-order-history')
  getOrderHistoryDatatable(
    @Query(DatatablePipe) query: DatatableQuery,
    @Param('userId') userId: string,
  ) {
    return this.employeeService.getProcessedOrderHistoryDatatable(
      userId,
      query,
    );
  }
}
