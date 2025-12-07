import { Injectable } from '@nestjs/common';
import { Server } from 'socket.io';

@Injectable()
export class EventService {
  public admin = new BaseEventService();
}

class BaseEventService {
  private io: Server;

  setServer(io: Server) {
    this.io = io;
  }

  emit(event: string, data?: any) {
    this.io?.emit(event, data);
  }
}
