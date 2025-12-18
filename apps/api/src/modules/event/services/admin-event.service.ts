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
  public async onFinishedJobTransaction() {
    return this.emit('onFinishedJobTransaction');
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
  public async onFinishedJobOrder() {
    return this.emit('onFinishedJobOrder');
  }

  /**
   * Emit a new order event
   */
  public async onNewOrder() {
    return this.emit('onNewOrder');
  }

  /**
   * Emit a finished order event
   */
  public async onFinishedOrder() {
    return this.emit('onFinishedOrder');
  }
}
