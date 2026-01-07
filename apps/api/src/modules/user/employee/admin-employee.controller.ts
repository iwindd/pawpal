import { DatatablePipe, DatatableQuery } from '@/common/pipes/DatatablePipe';
import { Body, Controller, Get, Param, Patch, Query } from '@nestjs/common';
import {
  ChangeEmailInput,
  ChangePasswordInput,
  UpdateProfileInput,
} from '@pawpal/shared';
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

  @Patch(':userId/profile')
  updateProfile(
    @Param('userId') userId: string,
    @Body() payload: UpdateProfileInput,
  ) {
    return this.userService.updateProfile(userId, payload);
  }

  @Patch(':userId/email')
  updateEmail(
    @Param('userId') userId: string,
    @Body() payload: Pick<ChangeEmailInput, 'newEmail'>,
  ) {
    return this.userService.adminResetEmail(userId, payload.newEmail);
  }

  @Patch(':userId/password')
  updatePassword(
    @Param('userId') userId: string,
    @Body() payload: Pick<ChangePasswordInput, 'newPassword'>,
  ) {
    return this.userService.adminResetPassword(userId, payload.newPassword);
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
