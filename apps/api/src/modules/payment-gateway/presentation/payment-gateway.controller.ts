import { ZodPipe } from '@/common/pipes/ZodPipe';
import { Body, Controller, Get, Param, Patch } from '@nestjs/common';
import { PromptpayManualInput, promptpayManualSchema } from '@pawpal/shared';

import { FindAllActiveGatewaysUseCase } from '../application/usecases/find-all-active-gateways.usecase';
import { GetGatewayUseCase } from '../application/usecases/get-gateway.usecase';
import { UpdatePromptpayManualMetadataUseCase } from '../application/usecases/update-promptpay-manual-metadata.usecase';

@Controller('payment-gateway')
export class PaymentGatewayController {
  constructor(
    private readonly findAllActiveGateways: FindAllActiveGatewaysUseCase,
    private readonly getGateway: GetGatewayUseCase,
    private readonly updatePromptpayManualMetadata: UpdatePromptpayManualMetadataUseCase,
  ) {}

  @Get()
  findAllActive() {
    return this.findAllActiveGateways.execute();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.getGateway.execute(id);
  }

  @Patch('promptpayManualMetadata')
  updateMetadata(
    @Body(new ZodPipe(promptpayManualSchema)) payload: PromptpayManualInput,
  ) {
    return this.updatePromptpayManualMetadata.execute(payload);
  }
}
