import { Controller, Get } from '@nestjs/common';
import { GetNotificationsUseCase } from '../application/usecases/get-notifications.usecase';

@Controller('admin/notification')
export class AdminNotificationController {
  constructor(private readonly getNotifications: GetNotificationsUseCase) {}

  @Get()
  findAll() {
    return this.getNotifications.execute();
  }
}
