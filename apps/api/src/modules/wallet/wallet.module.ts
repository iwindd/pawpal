import { Global, Module } from '@nestjs/common';
import { AdminWalletController } from './admin-wallet.controller';
import { WalletService } from './wallet.service';

@Global()
@Module({
  controllers: [AdminWalletController],
  exports: [WalletService],
  providers: [WalletService],
})
export class WalletModule {}
