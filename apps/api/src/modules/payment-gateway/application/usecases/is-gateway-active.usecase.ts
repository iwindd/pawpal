import { Inject, Injectable } from '@nestjs/common';
import {
  IPaymentGatewayRepository,
  PAYMENT_GATEWAY_REPOSITORY,
} from '../../domain/repository.port';

@Injectable()
export class IsGatewayActiveUseCase {
  constructor(
    @Inject(PAYMENT_GATEWAY_REPOSITORY)
    private readonly repo: IPaymentGatewayRepository,
  ) {}

  async execute(id: string) {
    return this.repo.isActive(id);
  }
}
