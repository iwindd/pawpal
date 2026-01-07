import { Module } from '@nestjs/common';
import { TopupModule } from '../topup/topup.module';
import { AdminOrderController } from './controllers/admin-order.controller';
import { OrderController } from './controllers/order.controller';
import { OrderRepository } from './order.repository';
import { OrderService } from './order.service';

@Module({
  imports: [TopupModule],
  controllers: [OrderController, AdminOrderController],
  providers: [OrderService, OrderRepository],
  exports: [OrderService, OrderRepository],
})
export class OrderModule {}
