import { Logger } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, type Socket } from 'socket.io';
import { EventService } from './event.service';

@WebSocketGateway({
  cors: {
    // TODO:: Setup cors
    origin: '*',
  },
})
export class AdminEventGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;
  private readonly logger: Logger = new Logger(AdminEventGateway.name);

  constructor(private readonly eventService: EventService) {}

  afterInit(server: Server): void {
    this.server = server;
    this.eventService.admin.setServer(server);
  }

  handleConnection(client: Socket): void {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket): void {
    this.logger.log(`Client disconnected: ${client.id}`);
  }
}
