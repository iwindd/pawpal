import { Provider } from '@nestjs/common';
import { CancelOrderUseCase } from '../application/usecases/cancel-order.usecase';
import { CompleteOrderUseCase } from '../application/usecases/complete-order.usecase';
import { CreateOrderUseCase } from '../application/usecases/create-order.usecase';
import { GetOrderHistoryDatatableUseCase } from '../application/usecases/get-order-history-datatable.usecase';
import { GetOrderUseCase } from '../application/usecases/get-order.usecase';
import { GetTopupOrderDatatableUseCase } from '../application/usecases/get-topup-order-datatable.usecase';
import { ORDER_REPOSITORY } from '../domain/repository.port';
import { PrismaOrderRepository } from './prisma/prisma-order.repository';

export const orderProviders: Provider[] = [
  {
    provide: ORDER_REPOSITORY,
    useClass: PrismaOrderRepository,
  },
  CreateOrderUseCase,
  GetTopupOrderDatatableUseCase,
  GetOrderUseCase,
  CompleteOrderUseCase,
  CancelOrderUseCase,
  GetOrderHistoryDatatableUseCase,
];
