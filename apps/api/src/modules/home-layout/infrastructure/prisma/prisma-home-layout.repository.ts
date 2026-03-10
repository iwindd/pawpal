import { DatatableQuery } from '@/common/pipes/DatatablePipe';
import {
  HomeLayout,
  HomeLayoutStatus,
  Prisma,
} from '@/generated/prisma/client';
import { PrismaService } from '@/modules/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import {
  DatatableResponse,
  ENUM_HOME_SECTION_TYPE,
  HomeLayoutSectionItem,
} from '@pawpal/shared';
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

  private async hydrateResources(homeLayout: HomeLayout): Promise<HomeLayout> {
    if (!homeLayout?.sections) return homeLayout;

    const sections = homeLayout.sections as unknown as HomeLayoutSectionItem[];
    const resourceIds = new Set<string>();

    // Collect resource IDs
    for (const section of sections) {
      if (section.type === ENUM_HOME_SECTION_TYPE.ITEM_GROUP) {
        for (const item of section.config.items) {
          if (item.resource_id) resourceIds.add(item.resource_id);
        }
      }
    }

    if (resourceIds.size === 0) return homeLayout;

    // Fetch all resources at once
    const resources = await this.prisma.resource.findMany({
      where: { id: { in: Array.from(resourceIds) } },
      select: { id: true, url: true },
    });

    const resourceMap = new Map(resources.map((r) => [r.id, r.url]));

    // Inject image_url back into sections
    const hydratedSections = sections.map((section) => {
      if (section.type === ENUM_HOME_SECTION_TYPE.ITEM_GROUP) {
        return {
          ...section,
          config: {
            ...section.config,
            items: section.config.items.map((item) => ({
              ...item,
              image_url: resourceMap.get(item.resource_id) || undefined,
            })),
          },
        };
      }
      return section;
    });

    return {
      ...homeLayout,
      sections: hydratedSections as unknown as Prisma.JsonValue,
    };
  }

  async getPublished(): Promise<HomeLayout | null> {
    const homeLayout = await this.prisma.homeLayout.findFirst({
      where: { status: HomeLayoutStatus.PUBLISHED },
      include: {
        updater: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    if (!homeLayout) return null;

    return await this.hydrateResources(homeLayout);
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
