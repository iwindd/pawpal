import { Injectable } from '@nestjs/common';
import { AdminEventService } from './services/admin-event.service';
import { UserEventService } from './services/user-event.service';

@Injectable()
export class EventService {
  public admin = new AdminEventService();
  public user = new UserEventService();
}
