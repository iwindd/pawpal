import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import {
  IOrderRepository,
  ORDER_REPOSITORY,
} from '../../domain/repository.port';

@Injectable()
export class GetOrderUseCase {
  constructor(
    @Inject(ORDER_REPOSITORY)
    private readonly orderRepo: IOrderRepository,
  ) {}

  async execute(id: string) {
    const order = await this.orderRepo.find(id);
    if (!order) {
      throw new BadRequestException('Order not found');
    }
    return this.orderRepo.toOrderResponse(id);
  }
}
