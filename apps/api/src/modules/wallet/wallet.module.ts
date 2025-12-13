import { Global, Module } from '@nestjs/common';
import { AdminWalletController } from './admin-wallet.controller';
import { WalletRepository } from './wallet.repository';
import { WalletService } from './wallet.service';

@Global()
@Module({
  controllers: [AdminWalletController],
  exports: [WalletService, WalletRepository],
  providers: [WalletService, WalletRepository],
})
export class WalletModule {}
