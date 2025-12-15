import { DatatablePipe, DatatableQuery } from '@/common/pipes/DatatablePipe';
import { Controller, Get, Query, UsePipes } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('admin/user')
export class AdminUserController {
  constructor(private readonly userService: UserService) {}

  @Get('/customer')
  @UsePipes(DatatablePipe)
  getUsers(@Query() queryParams: DatatableQuery) {
    return this.userService.getUserDatatable(queryParams);
  }

  @Get('/employee')
  @UsePipes(DatatablePipe)
  getEmployees(@Query() queryParams: DatatableQuery) {
    return this.userService.getEmployeeDatatable(queryParams);
  }
}
