import { Controller, Get } from '@nestjs/common';
import { NotificationService } from './notification.service';

@Controller('admin/notification')
export class AdminNotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get()
  findAll() {
    return this.notificationService.findAll();
  }
}
