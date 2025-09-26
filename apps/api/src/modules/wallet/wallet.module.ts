import { Global, Module } from '@nestjs/common';
import { WalletService } from './wallet.service';

@Global()
@Module({
  exports: [WalletService],
  providers: [WalletService],
})
export class WalletModule {}
