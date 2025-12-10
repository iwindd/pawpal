import { Injectable } from '@nestjs/common';
import { BaseEventService } from '../../common/classes/BaseEventService';

@Injectable()
export class EventService {
  public admin = new BaseEventService();
  public user = new BaseEventService();
}
