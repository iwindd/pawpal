import { BaseEventService } from '@/common/classes/BaseEventService';
import { AdminOrderResponse, AdminTransactionResponse } from '@pawpal/shared';

export class AdminEventService extends BaseEventService {
  constructor() {
    super();
  }

  public async onNewJobTransaction(payload: AdminTransactionResponse) {
    return this.emit('onNewJobTransaction', payload);
  }

  public async onFinishedJobTransaction(payload: AdminTransactionResponse) {
    return this.emit('onFinishedJobTransaction', payload);
  }

  public async onNewJobOrder(payload: AdminOrderResponse) {
    return this.emit('onNewJobOrder', payload);
  }

  public async onFinishedJobOrder(payload: AdminOrderResponse) {
    return this.emit('onFinishedJobOrder', payload);
  }
}
