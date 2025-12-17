import { Global, Module } from '@nestjs/common';
import { WalletRepository } from './wallet.repository';
import { WalletService } from './wallet.service';

@Global()
@Module({
  exports: [WalletService, WalletRepository],
  providers: [WalletService, WalletRepository],
})
export class WalletModule {}
