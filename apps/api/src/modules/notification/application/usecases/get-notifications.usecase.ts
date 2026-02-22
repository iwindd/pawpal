import { Inject, Injectable } from '@nestjs/common';
import {
  INotificationRepository,
  NOTIFICATION_REPOSITORY,
} from '../../domain/repository.port';

@Injectable()
export class GetNotificationsUseCase {
  constructor(
    @Inject(NOTIFICATION_REPOSITORY)
    private readonly notificationRepo: INotificationRepository,
  ) {}

  async execute() {
    return this.notificationRepo.findAll();
  }
}
