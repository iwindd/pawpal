import { Module } from '@nestjs/common';
import { PaymentModule } from '../payment/payment.module';
import { AdminOrderController } from './controllers/admin-order.controller';
import { OrderController } from './controllers/order.controller';
import { OrderRepository } from './order.repository';
import { OrderService } from './order.service';

@Module({
  controllers: [OrderController, AdminOrderController],
  providers: [OrderService, OrderRepository],
  exports: [OrderService, OrderRepository],
  imports: [PaymentModule],
})
export class OrderModule {}
