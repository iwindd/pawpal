import { PromptpayManualInput } from '@pawpal/shared';

export const PAYMENT_GATEWAY_REPOSITORY = Symbol('PAYMENT_GATEWAY_REPOSITORY');

export interface IPaymentGatewayRepository {
  findAllActive(): Promise<any>;
  getGateway(id: string): Promise<any>;
  isActive(id: string): Promise<boolean | undefined>;
  updatePromptpayManualMetadata(metadata: PromptpayManualInput): Promise<any>;
}
