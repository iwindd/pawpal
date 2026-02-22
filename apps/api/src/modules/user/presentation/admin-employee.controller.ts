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
import { AdminResetEmailUseCase } from '../application/usecases/admin-reset-email.usecase';
import { AdminResetPasswordUseCase } from '../application/usecases/admin-reset-password.usecase';
import { GetEmployeeDatatableUseCase } from '../application/usecases/get-employee-datatable.usecase';
import { GetEmployeeProcessedOrderHistoryDatatableUseCase } from '../application/usecases/get-employee-processed-order-history-datatable.usecase';
import { GetEmployeeProcessedTopupHistoryDatatableUseCase } from '../application/usecases/get-employee-processed-topup-history-datatable.usecase';
import { GetSuspensionHistoryDatatableUseCase } from '../application/usecases/get-suspension-history-datatable.usecase';
import { GetUserProfileUseCase } from '../application/usecases/get-user-profile.usecase';
import { SuspendUserUseCase } from '../application/usecases/suspend-user.usecase';
import { UnsuspendUserUseCase } from '../application/usecases/unsuspend-user.usecase';
import { UpdateProfileUseCase } from '../application/usecases/update-profile.usecase';

@Controller('admin/employee')
@UseGuards(SessionAuthGuard, JwtAuthGuard, PermissionGuard)
@Permissions(PermissionEnum.EmployeeManagement)
export class AdminEmployeeController {
  constructor(
    private readonly getEmployeeDatatableUseCase: GetEmployeeDatatableUseCase,
    private readonly getEmployeeProcessedTopupHistoryDatatableUseCase: GetEmployeeProcessedTopupHistoryDatatableUseCase,
    private readonly getEmployeeProcessedOrderHistoryDatatableUseCase: GetEmployeeProcessedOrderHistoryDatatableUseCase,
    private readonly getUserProfileUseCase: GetUserProfileUseCase,
    private readonly updateProfileUseCase: UpdateProfileUseCase,
    private readonly adminResetEmailUseCase: AdminResetEmailUseCase,
    private readonly adminResetPasswordUseCase: AdminResetPasswordUseCase,
    private readonly getSuspensionHistoryDatatableUseCase: GetSuspensionHistoryDatatableUseCase,
    private readonly suspendUserUseCase: SuspendUserUseCase,
    private readonly unsuspendUserUseCase: UnsuspendUserUseCase,
  ) {}

  @Get()
  getEmployeeDatatable(@Query(DatatablePipe) query: DatatableQuery) {
    return this.getEmployeeDatatableUseCase.execute(query);
  }

  @Get(':userId/profile')
  getProfile(@Param('userId') userId: string) {
    return this.getUserProfileUseCase.execute(userId);
  }

  @Patch(':userId/profile')
  updateProfileHandler(
    @Param('userId') userId: string,
    @Body() payload: UpdateProfileInput,
    @AuditInfo() auditInfo: PrismaAuditInfo,
  ) {
    return this.updateProfileUseCase.execute(userId, payload, auditInfo);
  }

  @Patch(':userId/email')
  updateEmail(
    @Param('userId') userId: string,
    @Body() { newEmail }: Pick<ChangeEmailInput, 'newEmail'>,
    @AuditInfo() auditInfo: PrismaAuditInfo,
  ) {
    return this.adminResetEmailUseCase.execute(userId, newEmail, auditInfo);
  }

  @Patch(':userId/password')
  updatePassword(
    @Param('userId') userId: string,
    @Body() { newPassword }: Pick<ChangePasswordInput, 'newPassword'>,
    @AuditInfo() auditInfo: PrismaAuditInfo,
  ) {
    return this.adminResetPasswordUseCase.execute(
      userId,
      newPassword,
      auditInfo,
    );
  }

  @Get(':userId/processed-topup-history')
  getProcessedTopupHistoryDatatable(
    @Query(DatatablePipe) query: DatatableQuery,
    @Param('userId') userId: string,
  ) {
    return this.getEmployeeProcessedTopupHistoryDatatableUseCase.execute(
      userId,
      query,
    );
  }

  @Get(':userId/processed-order-history')
  getOrderHistoryDatatable(
    @Query(DatatablePipe) query: DatatableQuery,
    @Param('userId') userId: string,
  ) {
    return this.getEmployeeProcessedOrderHistoryDatatableUseCase.execute(
      userId,
      query,
    );
  }

  @Get(':userId/suspensions')
  getSuspensionHistoryDatatableHandler(
    @Query(DatatablePipe) query: DatatableQuery,
    @Param('userId') userId: string,
  ) {
    return this.getSuspensionHistoryDatatableUseCase.execute(userId, query);
  }

  @Patch(':userId/suspend')
  suspendUserHandler(
    @Param('userId') userId: string,
    @Body() payload: { note?: string },
    @AuthUser() admin: Session,
  ) {
    return this.suspendUserUseCase.execute(userId, admin.id, payload.note);
  }

  @Patch(':userId/unsuspend')
  unsuspendUserHandler(
    @Param('userId') userId: string,
    @Body() payload: { note?: string },
    @AuthUser() admin: Session,
  ) {
    return this.unsuspendUserUseCase.execute(userId, admin.id, payload.note);
  }
}
