import { Provider } from '@nestjs/common';
import { GetNotificationsUseCase } from '../application/usecases/get-notifications.usecase';
import { NOTIFICATION_REPOSITORY } from '../domain/repository.port';
import { PrismaNotificationRepository } from './prisma/prisma-notification.repository';

export const notificationProviders: Provider[] = [
  { provide: NOTIFICATION_REPOSITORY, useClass: PrismaNotificationRepository },
  GetNotificationsUseCase,
];
