import datatableUtils from '@/utils/datatable';
import { Injectable } from '@nestjs/common';
import { CarouselStatus } from '@pawpal/prisma';
import {
  CarouselInput,
  CarouselResponse,
  DatatableQueryDto,
  DatatableResponse,
  Session,
} from '@pawpal/shared';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CarouselService {
  private readonly carouselResponseSelect = {
    id: true,
    title: true,
    createdAt: true,
    updatedAt: true,
    status: true,
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
    creator: {
      select: {
        id: true,
        displayName: true,
      },
    },
  };

  constructor(private readonly prisma: PrismaService) {}
  async create(
    payload: CarouselInput,
    user: Session,
  ): Promise<CarouselResponse> {
    const carousel = await this.prisma.carousel.create({
      data: {
        title: payload.title,
        status: payload.status,
        resource_id: payload.resource_id,
        product_id: payload.product_id || null,
        creator_id: user.id,
      },
      select: {
        ...this.carouselResponseSelect,
      },
    });

    return {
      ...carousel,
    };
  }

  async findAll(
    queryParams: DatatableQueryDto,
  ): Promise<DatatableResponse<CarouselResponse>> {
    const { page, limit, sort, search } = queryParams;
    const skip = (page - 1) * limit;

    const where: any = {
      status: { not: CarouselStatus.PUBLISHED },
    };

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { product: { name: { contains: search, mode: 'insensitive' } } },
        { creator: { displayName: { contains: search, mode: 'insensitive' } } },
      ];
    }

    const total = await this.prisma.carousel.count({ where });
    const carousels = await this.prisma.carousel.findMany({
      where,
      skip,
      take: limit,
      orderBy: datatableUtils.buildOrderBy(sort),
      select: {
        ...this.carouselResponseSelect,
      },
    });

    return {
      data: carousels,
      total: total,
    };
  }

  async getPublished(
    queryParams: DatatableQueryDto,
  ): Promise<DatatableResponse<CarouselResponse>> {
    const { page, limit, sort, search } = queryParams;
    const skip = (page - 1) * limit;

    const where: any = {
      status: { equals: CarouselStatus.PUBLISHED },
    };

    if (search) {
      where.title = {
        contains: search,
        mode: 'insensitive',
      };

      where.product.name = {
        contains: search,
        mode: 'insensitive',
      };
    }

    const carousels = await this.prisma.carousel.findMany({
      where,
      skip,
      take: limit,
      orderBy: datatableUtils.buildOrderBy(sort),
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
