import { DatatableQuery } from '@/common/pipes/DatatablePipe';
import { Inject, Injectable, Logger } from '@nestjs/common';
import {
  IOrderRepository,
  ORDER_REPOSITORY,
} from '../../domain/repository.port';

@Injectable()
export class GetOrderHistoryDatatableUseCase {
  private readonly logger = new Logger(GetOrderHistoryDatatableUseCase.name);

  constructor(
    @Inject(ORDER_REPOSITORY)
    private readonly orderRepo: IOrderRepository,
  ) {}

  async execute(userId: string, query?: DatatableQuery) {
    this.logger.debug(query);
    return this.orderRepo.getOrderHistoryDatatable(userId, query);
  }
}
