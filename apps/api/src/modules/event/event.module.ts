import { Global, Module } from '@nestjs/common';
import { AdminEventGateway } from './admin-event.gateway';
import { EventService } from './event.service';

@Global()
@Module({
  providers: [AdminEventGateway, EventService],
  exports: [EventService],
})
export class EventModule {}
