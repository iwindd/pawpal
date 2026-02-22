import { BaseEventService } from '@/common/classes/BaseEventService';
import {
  OnPurchaseTransactionUpdatedProps,
  OnTopupTransactionUpdatedProps,
} from '@pawpal/shared';

export class UserEventService extends BaseEventService {
  constructor() {
    super();
  }

  public async onTopupTransactionUpdated(
    userId: string,
    payload: OnTopupTransactionUpdatedProps,
  ) {
    return this.emitToUser(userId, 'onTopupTransactionUpdated', payload);
  }

  public async onPurchaseTransactionUpdated(
    userId: string,
    payload: OnPurchaseTransactionUpdatedProps,
  ) {
    return this.emitToUser(userId, 'onPurchaseTransactionUpdated', payload);
  }
}
