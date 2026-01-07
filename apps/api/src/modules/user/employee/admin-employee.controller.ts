import { DatatablePipe, DatatableQuery } from '@/common/pipes/DatatablePipe';
import { Controller, Get, Param, Query } from '@nestjs/common';
import { UserService } from '../user.service';
import { EmployeeService } from './employee.service';

@Controller('admin/employee')
export class AdminEmployeeController {
  constructor(
    private readonly employeeService: EmployeeService,
    private readonly userService: UserService,
  ) {}

  @Get()
  getEmployeeDatatable(@Query(DatatablePipe) query: DatatableQuery) {
    return this.employeeService.getEmployeeDatatable(query);
  }

  @Get(':userId/profile')
  getProfile(@Param('userId') userId: string) {
    return this.userService.getProfile(userId);
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
