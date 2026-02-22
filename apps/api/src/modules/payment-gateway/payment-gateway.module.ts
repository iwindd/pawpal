import { Global, Module } from '@nestjs/common';
import { paymentGatewayProviders } from './infrastructure/payment-gateway.providers';
import { PaymentGatewayController } from './presentation/payment-gateway.controller';

@Global()
@Module({
  controllers: [PaymentGatewayController],
  providers: [...paymentGatewayProviders],
  exports: [...paymentGatewayProviders],
})
export class PaymentGatewayModule {}
