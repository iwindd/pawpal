import { Inject, Injectable } from '@nestjs/common';
import {
  IPaymentGatewayRepository,
  PAYMENT_GATEWAY_REPOSITORY,
} from '../../domain/repository.port';

@Injectable()
export class FindAllActiveGatewaysUseCase {
  constructor(
    @Inject(PAYMENT_GATEWAY_REPOSITORY)
    private readonly repo: IPaymentGatewayRepository,
  ) {}

  execute() {
    return this.repo.findAllActive();
  }
}
