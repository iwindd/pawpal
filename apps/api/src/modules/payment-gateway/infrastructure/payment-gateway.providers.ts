import { Provider } from '@nestjs/common';
import { PAYMENT_GATEWAY_REPOSITORY } from '../domain/repository.port';
import { PrismaPaymentGatewayRepository } from './prisma/prisma-payment-gateway.repository';

import { FindAllActiveGatewaysUseCase } from '../application/usecases/find-all-active-gateways.usecase';
import { GetGatewayUseCase } from '../application/usecases/get-gateway.usecase';
import { IsGatewayActiveUseCase } from '../application/usecases/is-gateway-active.usecase';
import { UpdatePromptpayManualMetadataUseCase } from '../application/usecases/update-promptpay-manual-metadata.usecase';

export const paymentGatewayProviders: Provider[] = [
  {
    provide: PAYMENT_GATEWAY_REPOSITORY,
    useClass: PrismaPaymentGatewayRepository,
  },
  FindAllActiveGatewaysUseCase,
  GetGatewayUseCase,
  IsGatewayActiveUseCase,
  UpdatePromptpayManualMetadataUseCase,
];
