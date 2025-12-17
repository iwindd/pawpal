import { BaseEventService } from '@/common/classes/BaseEventService';
import { OnTopupTransactionUpdatedProps } from '@pawpal/shared';

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
}
