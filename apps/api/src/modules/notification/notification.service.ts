import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class NotificationService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return {
      carousels: await this.prisma.carousel.count({
        where: { status: 'PUBLISHED' },
      }),
    };
  }
}
