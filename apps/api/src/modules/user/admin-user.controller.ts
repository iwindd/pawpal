import { AuditInfo } from '@/common/decorators/audit.decorator';
import { Permissions } from '@/common/decorators/permissions.decorator';
import { JwtAuthGuard } from '@/common/guards/auth/jwt-auth.guard';
import { SessionAuthGuard } from '@/common/guards/auth/session-auth.guard';
import { PermissionGuard } from '@/common/guards/permission.guard';
import { PrismaAuditInfo } from '@/common/interfaces/prisma-audit.interface';
import { ZodPipe } from '@/common/pipes/ZodPipe';
import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import {
  AdminCreateUserInput,
  PermissionEnum,
  adminCreateUserSchema,
} from '@pawpal/shared';
import { UserService } from './user.service';

@Controller('admin/user')
@UseGuards(SessionAuthGuard, JwtAuthGuard, PermissionGuard)
@Permissions([
  PermissionEnum.EmployeeManagement,
  PermissionEnum.CustomerManagement,
])
export class AdminUserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(
    @Body(new ZodPipe(adminCreateUserSchema)) payload: AdminCreateUserInput,
    @AuditInfo() auditInfo: PrismaAuditInfo,
  ) {
    return this.userService.adminCreateUser(payload, auditInfo);
  }
}
