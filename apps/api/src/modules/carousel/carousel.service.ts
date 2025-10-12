import datatableUtils from '@/utils/datatable';
import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { CarouselStatus } from '@pawpal/prisma';
import {
  CarouselInput,
  CarouselReorderInput,
  CarouselResponse,
  DatatableQueryDto,
  DatatableResponse,
  Session,
} from '@pawpal/shared';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CarouselService {
  private readonly logger = new Logger(CarouselService.name);
  private readonly carouselResponseSelect = {
    id: true,
    title: true,
    createdAt: true,
    updatedAt: true,
    status: true,
    product: {
      select: {
        id: true,
        slug: true,
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
    order: true,
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

  async findOne(id: string): Promise<CarouselResponse> {
    const carousel = await this.prisma.carousel.findUnique({
      where: { id },
      select: {
        ...this.carouselResponseSelect,
      },
    });
    if (!carousel) throw new BadRequestException('carousel_not_found');
    return carousel;
  }

  async findAllPublished(): Promise<DatatableResponse<CarouselResponse>> {
    const carousels = await this.prisma.carousel.findMany({
      take: 10,
      where: {
        status: { equals: CarouselStatus.PUBLISHED },
      },
      orderBy: {
        order: 'asc',
      },
      select: {
        ...this.carouselResponseSelect,
      },
    });

    return {
      data: carousels,
      total: carousels.length,
    };
  }

  async update(id: string, payload: CarouselInput): Promise<CarouselResponse> {
    const updatedCarousel = await this.prisma.carousel.update({
      where: { id },
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

    return updatedCarousel;
  }

  async reorder({
    fromIndex,
    toIndex,
    carousel_id,
  }: CarouselReorderInput): Promise<void> {
    try {
      const operator = fromIndex < toIndex ? 'decrement' : 'increment';
      const range =
        fromIndex < toIndex
          ? { gt: fromIndex, lte: toIndex }
          : { gte: toIndex, lt: fromIndex };

      await this.prisma.$transaction(async () => {
        await this.prisma.carousel.updateMany({
          where: { order: range },
          data: { order: { [operator]: 1 } },
        });
        await this.prisma.carousel.update({
          where: { id: carousel_id },
          data: { order: toIndex },
        });
      });
      this.logger.log(
        `Reordered carousel item ${carousel_id} from ${fromIndex} to ${toIndex}`,
      );
    } catch (error) {
      this.logger.error('Error reordering carousel items:', error);
      throw new BadRequestException('Failed to reorder carousel items');
    }
  }
}
