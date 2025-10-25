import { Controller, Get } from '@nestjs/common';
import { PaymentGatewayService } from './payment-gateway.service';

@Controller('payment-gateway')
export class PaymentGatewayController {
  constructor(private readonly paymentGatewayService: PaymentGatewayService) {}

  @Get()
  findAllActive() {
    return this.paymentGatewayService.findAllActive();
  }
}
