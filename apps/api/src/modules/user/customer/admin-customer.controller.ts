import { DatatablePipe, DatatableQuery } from '@/common/pipes/DatatablePipe';
import { Body, Controller, Get, Param, Patch, Query } from '@nestjs/common';
import {
  ChangeEmailInput,
  ChangePasswordInput,
  UpdateProfileInput,
} from '@pawpal/shared';
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
