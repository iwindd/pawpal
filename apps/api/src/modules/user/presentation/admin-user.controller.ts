import { AuditInfo } from '@/common/decorators/audit.decorator';
import { Permissions } from '@/common/decorators/permissions.decorator';
import { JwtAuthGuard } from '@/common/guards/auth/jwt-auth.guard';
import { SessionAuthGuard } from '@/common/guards/auth/session-auth.guard';
import { PermissionGuard } from '@/common/guards/permission.guard';
import { PrismaAuditInfo } from '@/common/interfaces/prisma-audit.interface';
import { ZodPipe } from '@/common/pipes/ZodPipe';
import { Body, Controller, Param, Post, Put, UseGuards } from '@nestjs/common';
import {
  AdminCreateUserInput,
  AdminUpdateUserRoleInput,
  PermissionEnum,
  adminCreateUserSchema,
  adminUpdateUserRoleSchema,
} from '@pawpal/shared';
import { AdminCreateUserUseCase } from '../application/usecases/admin-create-user.usecase';
import { AdminUpdateUserRolesUseCase } from '../application/usecases/admin-update-user-roles.usecase';

@Controller('admin/user')
@UseGuards(SessionAuthGuard, JwtAuthGuard, PermissionGuard)
@Permissions([
  PermissionEnum.EmployeeManagement,
  PermissionEnum.CustomerManagement,
])
export class AdminUserController {
  constructor(
    private readonly adminCreateUser: AdminCreateUserUseCase,
    private readonly adminUpdateUserRoles: AdminUpdateUserRolesUseCase,
  ) {}

  @Post()
  create(
    @Body(new ZodPipe(adminCreateUserSchema)) payload: AdminCreateUserInput,
    @AuditInfo() auditInfo: PrismaAuditInfo,
  ) {
    return this.adminCreateUser.execute(payload, auditInfo);
  }

  @Put(':id/roles')
  updateRoles(
    @Param('id') id: string,
    @Body(new ZodPipe(adminUpdateUserRoleSchema))
    payload: AdminUpdateUserRoleInput,
    @AuditInfo() auditInfo: PrismaAuditInfo,
  ) {
    return this.adminUpdateUserRoles.execute(id, payload, auditInfo);
  }
}
