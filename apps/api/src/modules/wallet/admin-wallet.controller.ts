import { DatatablePipe, DatatableQuery } from '@/common/pipes/DatatablePipe';
import { ZodPipe } from '@/common/pipes/ZodPipe';
import { Body, Controller, Get, Param, Patch, Query } from '@nestjs/common';
import {
  TransactionStatusInput,
  transactionStatusSchema,
} from '@pawpal/shared';
import { WalletService } from './wallet.service';

@Controller('admin/wallet')
export class AdminWalletController {
  constructor(private readonly walletService: WalletService) {}

  @Get('pending')
  async getPendingTransactions(@Query(DatatablePipe) query: DatatableQuery) {
    return this.walletService.getPendingTransactions(query);
  }

  @Patch('pending/:transactionId')
  changeTransactionStatus(
    @Param('transactionId') transactionId: string,
    @Body(new ZodPipe(transactionStatusSchema)) payload: TransactionStatusInput,
  ) {
    return this.walletService.changeTransactionStatus(transactionId, payload);
  }
}
