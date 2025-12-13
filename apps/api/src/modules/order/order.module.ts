import { Module } from '@nestjs/common';
import { PaymentModule } from '../payment/payment.module';
import { WalletModule } from '../wallet/wallet.module';
import { AdminOrderController } from './admin-order.controller';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';

@Module({
  controllers: [OrderController, AdminOrderController],
  providers: [OrderService],
  exports: [OrderService],
  imports: [PaymentModule, WalletModule],
})
export class OrderModule {}
