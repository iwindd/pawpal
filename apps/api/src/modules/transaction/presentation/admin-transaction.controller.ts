import { Permissions } from '@/common/decorators/permissions.decorator';
import { AuthUser } from '@/common/decorators/user.decorator';
import { JwtAuthGuard } from '@/common/guards/auth/jwt-auth.guard';
import { SessionAuthGuard } from '@/common/guards/auth/session-auth.guard';
import { PermissionGuard } from '@/common/guards/permission.guard';
import { DatatablePipe, DatatableQuery } from '@/common/pipes/DatatablePipe';
import {
  Controller,
  Get,
  Param,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import { PermissionEnum, Session } from '@pawpal/shared';

import { AssignJobTransactionUseCase } from '../application/usecases/assign-job-transaction.usecase';
import { FailChargeUseCase } from '../application/usecases/fail-charge.usecase';
import { GetJobTransactionsDatatableUseCase } from '../application/usecases/get-job-transactions-datatable.usecase';
import { GetTransactionUseCase } from '../application/usecases/get-transaction.usecase';
import { SuccessChargeUseCase } from '../application/usecases/success-charge.usecase';

@Controller('admin/transaction')
@UseGuards(SessionAuthGuard, JwtAuthGuard, PermissionGuard)
@Permissions(PermissionEnum.OrderManagement)
export class AdminTransactionController {
  constructor(
    private readonly getJobTransactionsDatatableUseCase: GetJobTransactionsDatatableUseCase,
    private readonly getTransactionUseCase: GetTransactionUseCase,
    private readonly successChargeUseCase: SuccessChargeUseCase,
    private readonly failChargeUseCase: FailChargeUseCase,
    private readonly assignJobTransactionUseCase: AssignJobTransactionUseCase,
  ) {}

  @Get('job')
  async getJobTransactionsDatatable(
    @Query(DatatablePipe) query: DatatableQuery,
  ) {
    return this.getJobTransactionsDatatableUseCase.execute(query);
  }

  @Get(':transactionId')
  async getTransaction(@Param('transactionId') transactionId: string) {
    return this.getTransactionUseCase.execute(transactionId);
  }

  @Patch('job/:transactionId/success')
  async successJobTransaction(
    @Param('transactionId') transactionId: string,
    @AuthUser() user: Session,
  ) {
    return await this.successChargeUseCase.execute(transactionId, user.id);
  }

  @Patch('job/:transactionId/fail')
  async failJobTransaction(
    @Param('transactionId') transactionId: string,
    @AuthUser() user: Session,
  ) {
    return await this.failChargeUseCase.execute(transactionId, user.id);
  }

  @Patch('job/:transactionId/assign')
  async assignJobTransaction(
    @Param('transactionId') transactionId: string,
    @AuthUser() user: Session,
  ) {
    return await this.assignJobTransactionUseCase.execute(
      transactionId,
      user.id,
    );
  }
}
