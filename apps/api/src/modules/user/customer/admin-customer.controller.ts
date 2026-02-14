import { AuthUser } from '@/common/decorators/user.decorator';
import { JwtAuthGuard } from '@/common/guards/auth/jwt-auth.guard';
import { SessionAuthGuard } from '@/common/guards/auth/session-auth.guard';
import { DatatablePipe, DatatableQuery } from '@/common/pipes/DatatablePipe';
import {
  Body,
  Controller,
  Get,
  Logger,
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

  @Patch(':userId/suspend')
  suspendUser(
    @Param('userId') userId: string,
    @Body() payload: { note?: string },
    @AuthUser() admin: Session,
  ) {
    this.logger.debug(admin, userId, payload);
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
