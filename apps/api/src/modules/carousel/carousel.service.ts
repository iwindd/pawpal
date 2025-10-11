import datatableUtils from '@/utils/datatable';
import { Injectable } from '@nestjs/common';
import { CarouselStatus } from '@pawpal/prisma';
import {
  CarouselInput,
  CarouselResponse,
  DatatableQueryDto,
  DatatableResponse,
} from '@pawpal/shared';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CarouselService {
  private readonly carouselResponseSelect = {
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
  };

  constructor(private readonly prisma: PrismaService) {}
  async create(payload: CarouselInput): Promise<CarouselResponse> {
    console.log(payload.product_id || 'No product id');

    const carousel = await this.prisma.carousel.create({
      data: {
        title: payload.title,
        status: payload.status,
        resource_id: payload.resource_id,
        product_id: payload.product_id || null,
      },
      select: {
        ...this.carouselResponseSelect,
      },
    });

    return {
      ...carousel,
    };
  }

  async getPublished(
    params: DatatableQueryDto,
  ): Promise<DatatableResponse<CarouselResponse>> {
    const carousels = await this.prisma.carousel.findMany({
      where: {
        status: CarouselStatus.PUBLISHED,
      },
      orderBy: datatableUtils.buildOrderBy(params.sort),
      select: {
        ...this.carouselResponseSelect,
      },
    });

    return {
      data: carousels,
      total: carousels.length,
    };
  }
}
