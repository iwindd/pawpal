import { Inject, Injectable } from '@nestjs/common';
import { PromptpayManualInput } from '@pawpal/shared';
import {
  IPaymentGatewayRepository,
  PAYMENT_GATEWAY_REPOSITORY,
} from '../../domain/repository.port';

@Injectable()
export class UpdatePromptpayManualMetadataUseCase {
  constructor(
    @Inject(PAYMENT_GATEWAY_REPOSITORY)
    private readonly repo: IPaymentGatewayRepository,
  ) {}

  async execute(metadata: PromptpayManualInput) {
    return this.repo.updatePromptpayManualMetadata(metadata);
  }
}
