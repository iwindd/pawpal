import { Logger } from '@nestjs/common';
import { Server } from 'socket.io';

export class BaseEventService {
  private io: Server;
  private readonly logger = new Logger(BaseEventService.name);
  private emitToUserFn?: (userId: string, event: string, data: any) => void;

  setServer(io: Server) {
    this.io = io;
  }

  emit(event: string, data?: any) {
    this.logger.debug(`Emitting \`${event}\` event`);
    this.io?.emit(event, data);
  }

  emitToUser(userId: string, event: string, data?: any) {
    this.emitToUserFn?.(userId, event, data);
  }

  setEmitToUser(fn: (userId: string, event: string, data: any) => void) {
    this.emitToUserFn = fn;
  }
}
