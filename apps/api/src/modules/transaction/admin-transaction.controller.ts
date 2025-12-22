import { AuthUser } from '@/common/decorators/user.decorator';
import { JwtAuthGuard } from '@/common/guards/auth/jwt-auth.guard';
import { SessionAuthGuard } from '@/common/guards/auth/session-auth.guard';
import { DatatablePipe, DatatableQuery } from '@/common/pipes/DatatablePipe';
import {
  Controller,
  Get,
  Param,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import { Session } from '@pawpal/shared';
import { TransactionService } from './transaction.service';

@Controller('admin/transaction')
@UseGuards(SessionAuthGuard, JwtAuthGuard)
export class AdminTransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Get('job')
  async getJobTransactionsDatatable(
    @Query(DatatablePipe) query: DatatableQuery,
  ) {
    return this.transactionService.getJobTransactionsDatatable(query);
  }

  @Patch('job/:transactionId/success')
  async successJobTransaction(
    @Param('transactionId') transactionId: string,
    @AuthUser() user: Session,
  ) {
    return await this.transactionService.successCharge(transactionId, user.id);
  }

  @Patch('job/:transactionId/fail')
  async failJobTransaction(
    @Param('transactionId') transactionId: string,
    @AuthUser() user: Session,
  ) {
    return await this.transactionService.failCharge(transactionId, user.id);
  }
}
