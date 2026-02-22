import { Module } from '@nestjs/common';
import { TopupModule } from '../topup/topup.module';
import { CancelOrderUseCase } from './application/usecases/cancel-order.usecase';
import { ORDER_REPOSITORY } from './domain/repository.port';
import { orderProviders } from './infrastructure/order.providers';
import { AdminOrderController } from './presentation/admin-order.controller';
import { OrderController } from './presentation/order.controller';

@Module({
  imports: [TopupModule],
  controllers: [OrderController, AdminOrderController],
  providers: [...orderProviders],
  exports: [ORDER_REPOSITORY, CancelOrderUseCase],
})
export class OrderModule {}
