import { BaseEventService } from '@/common/classes/BaseEventService';
import { AdminOrderResponse, AdminTransactionResponse } from '@pawpal/shared';

export class AdminEventService extends BaseEventService {
  constructor() {
    super();
  }

  /**
   * Emit a new job transaction event
   */
  public async onNewJobTransaction(payload: AdminTransactionResponse) {
    return this.emit('onNewJobTransaction', payload);
  }

  /**
   * Emit a finished job transaction event
   */
  public async onFinishedJobTransaction(payload: AdminTransactionResponse) {
    return this.emit('onFinishedJobTransaction', payload);
  }

  /**
   * Emit a new job order event
   */
  public async onNewJobOrder(payload: AdminOrderResponse) {
    return this.emit('onNewJobOrder', payload);
  }

  /**
   * Emit a finished job order event
   */
  public async onFinishedJobOrder(payload: AdminOrderResponse) {
    return this.emit('onFinishedJobOrder', payload);
  }
}
