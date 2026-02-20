import { AuditInfo } from '@/common/decorators/audit.decorator';
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
  UseGuards,
} from '@nestjs/common';
import {
  ChangeEmailInput,
  ChangePasswordInput,
  PermissionEnum,
  Session,
  UpdateProfileInput,
} from '@pawpal/shared';

import { Permissions } from '@/common/decorators/permissions.decorator';
import { PermissionGuard } from '@/common/guards/permission.guard';
import { PrismaAuditInfo } from '@/common/interfaces/prisma-audit.interface';
import { UserService } from '../user.service';
import { EmployeeService } from './employee.service';

@Controller('admin/employee')
@UseGuards(SessionAuthGuard, JwtAuthGuard, PermissionGuard)
@Permissions(PermissionEnum.EmployeeManagement)
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
    @AuditInfo() auditInfo: PrismaAuditInfo,
  ) {
    return this.userService.updateProfile(userId, payload, auditInfo);
  }

  @Patch(':userId/email')
  updateEmail(
    @Param('userId') userId: string,
    @Body() { newEmail }: Pick<ChangeEmailInput, 'newEmail'>,
    @AuditInfo() auditInfo: PrismaAuditInfo,
  ) {
    return this.userService.adminResetEmail(userId, newEmail, auditInfo);
  }

  @Patch(':userId/password')
  updatePassword(
    @Param('userId') userId: string,
    @Body() { newPassword }: Pick<ChangePasswordInput, 'newPassword'>,
    @AuditInfo() auditInfo: PrismaAuditInfo,
  ) {
    return this.userService.adminResetPassword(userId, newPassword, auditInfo);
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

  @Get(':userId/suspensions')
  getSuspensionHistoryDatatable(
    @Query(DatatablePipe) query: DatatableQuery,
    @Param('userId') userId: string,
  ) {
    return this.userService.getSuspensionHistoryDatatable(userId, query);
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
