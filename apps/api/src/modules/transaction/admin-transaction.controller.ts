import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { SessionAuthGuard } from '@/common/guards/session-auth.guard';
import { DatatablePipe, DatatableQuery } from '@/common/pipes/DatatablePipe';
import { ZodPipe } from '@/common/pipes/ZodPipe';
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
  TransactionStatusInput,
  transactionStatusSchema,
} from '@pawpal/shared';
import { TransactionService } from './transaction.service';

@Controller('admin/transaction')
@UseGuards(JwtAuthGuard, SessionAuthGuard)
export class AdminTransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Get('pending')
  async getPendingTransactionsDatatable(
    @Query(DatatablePipe) query: DatatableQuery,
  ) {
    return this.transactionService.getPendingTransactionsDatatable(query);
  }

  @Patch('pending/:transactionId')
  changeTransactionStatus(
    @Param('transactionId') transactionId: string,
    @Body(new ZodPipe(transactionStatusSchema)) payload: TransactionStatusInput,
  ) {
    return this.transactionService.changeTransactionStatus(
      transactionId,
      payload,
    );
  }
}
