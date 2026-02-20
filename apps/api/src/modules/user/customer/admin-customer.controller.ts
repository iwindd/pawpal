import { AuditInfo } from '@/common/decorators/audit.decorator';
import { AuthUser } from '@/common/decorators/user.decorator';
import { JwtAuthGuard } from '@/common/guards/auth/jwt-auth.guard';
import { SessionAuthGuard } from '@/common/guards/auth/session-auth.guard';
import { PrismaAuditInfo } from '@/common/interfaces/prisma-audit.interface';
import { DatatablePipe, DatatableQuery } from '@/common/pipes/DatatablePipe';
import {
  Body,
  Controller,
  Get,
  Logger,
  Param,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ChangeEmailInput,
  ChangePasswordInput,
  Session,
  UpdateProfileInput,
} from '@pawpal/shared';
import { UserService } from '../user.service';
import { CustomerService } from './customer.service';

@Controller('admin/customer')
@UseGuards(SessionAuthGuard, JwtAuthGuard)
export class AdminCustomerController {
  private readonly logger = new Logger(AdminCustomerController.name);
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
