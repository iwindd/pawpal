import { ResourceResponseMapper } from '@/common/mappers/ResourceResponseMapper';
import { DatatableQuery } from '@/common/pipes/DatatablePipe';
import { ResourceType } from '@/generated/prisma/enums';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { IResourceRepository } from '../../domain/repository.port';

@Injectable()
export class PrismaResourceRepository implements IResourceRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findOne(id: string) {
    const resource = await this.prisma.resource.findUnique({
      where: { id },
      select: ResourceResponseMapper.SELECT,
    });
    if (!resource) throw new Error('resource_not_found');
    return ResourceResponseMapper.fromQuery(resource);
  }

  async getAllResourceDatatable(query: DatatableQuery) {
    const { data, total } = await this.prisma.resource.getDatatable({
      query,
      select: ResourceResponseMapper.SELECT,
      where: { type: ResourceType.RESOURCE_IMAGE },
    });
    return {
      data: data.map(ResourceResponseMapper.fromQuery),
      total,
    };
  }

  async createResource(key: string, userId: string) {
    const resource = await this.prisma.resource.create({
      data: {
        url: key,
        user: { connect: { id: userId } },
      },
      select: ResourceResponseMapper.SELECT,
    });
    return ResourceResponseMapper.fromQuery(resource);
  }

  async createResourceImage(key: string, userId: string) {
    const resource = await this.prisma.resource.create({
      data: {
        url: key,
        user: { connect: { id: userId } },
        type: ResourceType.RESOURCE_IMAGE,
      },
      select: ResourceResponseMapper.SELECT,
    });
    return ResourceResponseMapper.fromQuery(resource);
  }

  async findResourceForCopy(resourceId: string) {
    return this.prisma.resource.findUnique({
      where: { id: resourceId, type: ResourceType.RESOURCE_IMAGE },
      select: { id: true, url: true },
    });
  }
}
