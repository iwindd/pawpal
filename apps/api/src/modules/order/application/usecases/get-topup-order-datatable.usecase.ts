import { DatatableQuery } from '@/common/pipes/DatatablePipe';
import { Inject, Injectable } from '@nestjs/common';
import {
  IOrderRepository,
  ORDER_REPOSITORY,
} from '../../domain/repository.port';

@Injectable()
export class GetTopupOrderDatatableUseCase {
  constructor(
    @Inject(ORDER_REPOSITORY)
    private readonly orderRepo: IOrderRepository,
  ) {}

  async execute(query: DatatableQuery) {
    return this.orderRepo.getTopupOrderDatatable(query);
  }
}
