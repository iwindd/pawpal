import { DatatablePipe, DatatableQuery } from '@/common/pipes/DatatablePipe';
import { Controller, Get, Query } from '@nestjs/common';
import { WalletService } from './wallet.service';

@Controller('admin/wallet')
export class AdminWalletController {
  constructor(private readonly walletService: WalletService) {}

  @Get('pending')
  async getPendingTransactions(@Query(DatatablePipe) query: DatatableQuery) {
    return this.walletService.getPendingTransactions(query);
  }
}
