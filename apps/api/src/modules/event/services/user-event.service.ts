import { BaseEventService } from '@/common/classes/BaseEventService';
import {
  OnPurchaseTransactionUpdatedProps,
  OnTopupTransactionUpdatedProps,
} from '@pawpal/shared';

export class UserEventService extends BaseEventService {
  constructor() {
    super();
  }

  /**
   * Emit a topup transaction updated event
   * @param userId user id
   * @param payload payload
   * @returns
   */
  public async onTopupTransactionUpdated(
    userId: string,
    payload: OnTopupTransactionUpdatedProps,
  ) {
    return this.emitToUser(userId, 'onTopupTransactionUpdated', payload);
  }

  /**
   * Emit a purchase transaction updated event
   * @param userId user id
   * @param payload payload
   * @returns
   */
  public async onPurchaseTransactionUpdated(
    userId: string,
    payload: OnPurchaseTransactionUpdatedProps,
  ) {
    return this.emitToUser(userId, 'onPurchaseTransactionUpdated', payload);
  }
}
