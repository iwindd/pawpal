import { Module } from '@nestjs/common';
import { notificationProviders } from './infrastructure/notification.providers';
import { AdminNotificationController } from './presentation/admin-notification.controller';

@Module({
  controllers: [AdminNotificationController],
  providers: [...notificationProviders],
})
export class NotificationModule {}
