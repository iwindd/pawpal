import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { SessionAuthGuard } from '@/common/guards/session-auth.guard';
import { DatatablePipe, DatatableQuery } from '@/common/pipes/DatatablePipe';
import {
  Controller,
  Get,
  Param,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import { TransactionService } from './transaction.service';

@Controller('admin/transaction')
@UseGuards(JwtAuthGuard, SessionAuthGuard)
export class AdminTransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Get('job')
  async getJobTransactionsDatatable(
    @Query(DatatablePipe) query: DatatableQuery,
  ) {
    return this.transactionService.getJobTransactionsDatatable(query);
  }

  @Patch('job/:transactionId/success')
  async successJobTransaction(@Param('transactionId') transactionId: string) {
    return await this.transactionService.successCharge(transactionId);
  }

  @Patch('job/:transactionId/fail')
  async failJobTransaction(@Param('transactionId') transactionId: string) {
    return await this.transactionService.failCharge(transactionId);
  }
}
