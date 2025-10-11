import { Injectable } from '@nestjs/common';
import { CarouselInput, CarouselResponse } from '@pawpal/shared';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CarouselService {
  constructor(private readonly prisma: PrismaService) {}
  async create(payload: CarouselInput): Promise<CarouselResponse> {
    const carousel = await this.prisma.carousel.create({
      data: {
        title: payload.title,
        status: payload.status,
        resource_id: payload.resource_id,
        product_id: payload.product_id,
      },
      select: {
        id: true,
        title: true,
        createdAt: true,
        product: {
          select: {
            id: true,
            name: true,
          },
        },
        image: {
          select: {
            id: true,
            url: true,
          },
        },
      },
    });
    return {
      ...carousel,
    };
  }
}
