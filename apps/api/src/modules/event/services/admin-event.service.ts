import { BaseEventService } from '@/common/classes/BaseEventService';

export class AdminEventService extends BaseEventService {
  constructor() {
    super();
  }

  /**
   * Emit a new job transaction event
   */
  public async onNewJobTransaction() {
    return this.emit('onNewJobTransaction');
  }
}
