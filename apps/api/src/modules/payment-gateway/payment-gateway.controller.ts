import { ZodPipe } from '@/common/pipes/ZodPipe';
import { Body, Controller, Get, Param, Patch } from '@nestjs/common';
import { PromptpayManualInput, promptpayManualSchema } from '@pawpal/shared';
import { PaymentGatewayService } from './payment-gateway.service';

@Controller('payment-gateway') // TODO: Permission Guard
export class PaymentGatewayController {
  constructor(private readonly paymentGatewayService: PaymentGatewayService) {}

  @Get()
  findAllActive() {
    return this.paymentGatewayService.findAllActive();
  }
  @Get(':id')
  getGateway(@Param('id') id: string) {
    return this.paymentGatewayService.getGateway(id);
  }

  @Patch('promptpayManualMetadata')
  updatePromptpayManualMetadata(
    @Body(new ZodPipe(promptpayManualSchema)) payload: PromptpayManualInput,
  ) {
    return this.paymentGatewayService.updatePromptpayManualMetadata(payload);
  }
}
