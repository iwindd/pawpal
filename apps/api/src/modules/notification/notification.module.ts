import { Module } from '@nestjs/common';
import { AdminNotificationController } from './admin-notification.controller';
import { NotificationService } from './notification.service';

@Module({
  controllers: [AdminNotificationController],
  providers: [NotificationService],
})
export class NotificationModule {}
