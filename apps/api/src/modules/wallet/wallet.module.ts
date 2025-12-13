import { Global, Module } from '@nestjs/common';
import { OrderModule } from '../order/order.module';
import { AdminWalletController } from './admin-wallet.controller';
import { UserWalletTransactionRepository } from './repositories/userWalletTransaction.repository';
import { WalletRepository } from './repositories/wallet.repository';
import { WalletService } from './wallet.service';

@Global()
@Module({
  controllers: [AdminWalletController],
  exports: [WalletService, WalletRepository, UserWalletTransactionRepository],
  providers: [WalletService, WalletRepository, UserWalletTransactionRepository],
  imports: [OrderModule],
})
export class WalletModule {}
