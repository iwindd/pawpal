import { Module } from '@nestjs/common';
import { topupProviders } from './infrastructure/topup.providers';
import { TopupController } from './presentation/topup.controller';

import { EventModule } from '../event/event.module';
import { PaymentGatewayModule } from '../payment-gateway/payment-gateway.module';
import { WalletModule } from '../wallet/wallet.module';

// UseCases exported for external services that used to import TopupService to inject
import { ProcessTopupUseCase } from './application/usecases/process-topup.usecase';

@Module({
  imports: [WalletModule, PaymentGatewayModule, EventModule],
  controllers: [TopupController],
  providers: [...topupProviders],
  exports: [ProcessTopupUseCase],
})
export class TopupModule {}
