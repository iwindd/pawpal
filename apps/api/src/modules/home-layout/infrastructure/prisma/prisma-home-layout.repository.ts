import { DatatableQuery } from '@/common/pipes/DatatablePipe';
import {
  HomeLayout,
  HomeLayoutStatus,
  Prisma,
} from '@/generated/prisma/client';
import { PrismaService } from '@/modules/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { DatatableResponse } from '@pawpal/shared';
import { IHomeLayoutRepository } from '../../domain/repository.port';

@Injectable()
export class PrismaHomeLayoutRepository implements IHomeLayoutRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Prisma.HomeLayoutCreateInput): Promise<HomeLayout> {
    return await this.prisma.homeLayout.create({
      data,
      include: {
        updater: true,
      },
    });
  }

  async getById(id: string): Promise<HomeLayout | null> {
    return await this.prisma.homeLayout.findUnique({
      where: { id },
      include: {
        updater: true,
      },
    });
  }

  async getPublished(): Promise<HomeLayout | null> {
    return await this.prisma.homeLayout.findFirst({
      where: { status: HomeLayoutStatus.PUBLISHED },
      include: {
        updater: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async archiveAllPublished(excludeId?: string): Promise<void> {
    const whereClause: Prisma.HomeLayoutWhereInput = {
      status: HomeLayoutStatus.PUBLISHED,
    };
    if (excludeId) {
      whereClause.id = { not: excludeId };
    }
    await this.prisma.homeLayout.updateMany({
      where: whereClause,
      data: { status: HomeLayoutStatus.ARCHIVED },
    });
  }

  async getDatatable(
    query: DatatableQuery,
  ): Promise<DatatableResponse<HomeLayout>> {
    return this.prisma.homeLayout.getDatatable({
      query,
      select: {
        id: true,
        version: true,
        name: true,
        status: true,
        updater: {
          select: {
            id: true,
            displayName: true,
          },
        },
        createdAt: true,
      },
    });
  }
}
