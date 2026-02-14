import { AuthUser } from '@/common/decorators/user.decorator';
import { JwtAuthGuard } from '@/common/guards/auth/jwt-auth.guard';
import { SessionAuthGuard } from '@/common/guards/auth/session-auth.guard';
import { DatatablePipe, DatatableQuery } from '@/common/pipes/DatatablePipe';
import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ChangeEmailInput,
  ChangePasswordInput,
  Session,
  UpdateProfileInput,
} from '@pawpal/shared';
import { Request } from 'express';
import { UserService } from '../user.service';
import { EmployeeService } from './employee.service';

@Controller('admin/employee')
@UseGuards(SessionAuthGuard, JwtAuthGuard)
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
    @AuthUser() admin: Session,
    @Req() req: Request,
  ) {
    return this.userService.adminResetEmail(userId, payload.newEmail, {
      performedById: admin.id,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });
  }

  @Patch(':userId/password')
  updatePassword(
    @Param('userId') userId: string,
    @Body() payload: Pick<ChangePasswordInput, 'newPassword'>,
    @AuthUser() admin: Session,
    @Req() req: Request,
  ) {
    return this.userService.adminResetPassword(userId, payload.newPassword, {
      performedById: admin.id,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });
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

  @Patch(':userId/suspend')
  suspendUser(
    @Param('userId') userId: string,
    @Body() payload: { note?: string },
    @AuthUser() admin: Session,
  ) {
    return this.userService.suspendUser(userId, admin.id, payload.note);
  }

  @Patch(':userId/unsuspend')
  unsuspendUser(
    @Param('userId') userId: string,
    @Body() payload: { note?: string },
    @AuthUser() admin: Session,
  ) {
    return this.userService.unsuspendUser(userId, admin.id, payload.note);
  }
}
