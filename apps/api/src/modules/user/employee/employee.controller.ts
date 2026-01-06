import { DatatablePipe, DatatableQuery } from '@/common/pipes/DatatablePipe';
import { Controller, Get, Query, UsePipes } from '@nestjs/common';
import { EmployeeService } from './employee.service';

@Controller('admin/employee')
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}

  @Get()
  @UsePipes(DatatablePipe)
  getEmployeeDatatable(@Query() queryParams: DatatableQuery) {
    return this.employeeService.getEmployeeDatatable(queryParams);
  }
}
