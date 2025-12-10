import { Logger } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { SocketWithSession } from '../adapters/socket-io-adapter';
import { SocketAuthAdminMiddleware } from '../middlewares/SocketAuthAdminMiddleware';
import { SocketAuthUserMiddleware } from '../middlewares/SocketAuthUserMiddleware';
import { BaseEventService } from './BaseEventService';

export abstract class BaseEventGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;

  protected readonly logger: Logger;
  public users: Map<string, SocketWithSession> = new Map();

  constructor(
    private readonly eventService: BaseEventService,
    private readonly middleware:
      | SocketAuthAdminMiddleware
      | SocketAuthUserMiddleware,
  ) {
    this.logger = new Logger(this.constructor.name);
  }

  afterInit(server: Server) {
    server.use(async (socket, next) => this.middleware.use(socket, next));
    this.eventService.setServer(server);
    this.eventService.setEmitToUser(this.emitToUser.bind(this));
    this.logger.log('Server initialized');
  }

  handleConnection(client: SocketWithSession) {
    this.users.set(client.data.user.id, client);

    this.logger.debug(`User \`${client.data.user.id}\` connected`);
  }

  handleDisconnect(client: SocketWithSession) {
    this.users.delete(client.data.user.id);

    this.logger.debug(`User \`${client.data.user.id}\` disconnected`);
  }

  emitToUser(userId: string, event: string, data?: any) {
    const client = this.users.get(userId);
    if (!client) {
      return this.logger.debug(`User \`${userId}\` not found`);
    }

    this.logger.debug(
      `User \`${userId}\` emit \`${event}\` event (${JSON.stringify(data)})`,
    );
    client.emit(event, data);
  }
}
