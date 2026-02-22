import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { INotificationRepository } from '../../domain/repository.port';

@Injectable()
export class PrismaNotificationRepository implements INotificationRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return {
      carousels: await this.prisma.carousel.count({
        where: { status: 'PUBLISHED' },
      }),
    };
  }
}
