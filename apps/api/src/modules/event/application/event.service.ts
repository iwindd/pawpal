import { Injectable } from '@nestjs/common';
import { AdminEventService } from './admin-event.service';
import { UserEventService } from './user-event.service';

@Injectable()
export class EventService {
  public admin = new AdminEventService();
  public user = new UserEventService();
}
