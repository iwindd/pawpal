import { Injectable } from '@nestjs/common';
import { DatatableResponse, ResourceResponse } from '@pawpal/shared';
import { PrismaService } from '../prisma/prisma.service';
import { LocalStorageService } from './local-storage.service';

@Injectable()
export class ResourceService {
  private readonly resourceResponseSelect = {
    id: true,
    url: true,
    createdAt: true,
    type: true,
    user: {
      select: {
        id: true,
        displayName: true,
      },
    },
  };

  constructor(
    private readonly prisma: PrismaService,
    private readonly storage: LocalStorageService,
  ) {}

  async findOne(id: string): Promise<ResourceResponse | null> {
    const resource = await this.prisma.resource.findUnique({
      where: { id },
      select: this.resourceResponseSelect,
    });

    if (!resource) throw new Error('resource_not_found');

    return {
      ...resource,
      createdAt: resource.createdAt.toISOString(),
    };
  }

  async findAllResources(params: {
    page: number;
    limit: number;
  }): Promise<DatatableResponse<ResourceResponse>> {
    const { page, limit } = params;
    const skip = (page - 1) * limit;

    const total = await this.prisma.resource.count();
    const resources = await this.prisma.resource.findMany({
      skip,
      take: limit,
      orderBy: {
        createdAt: 'desc',
      },
      select: this.resourceResponseSelect,
    });

    return {
      total,
      data: resources.map((resource) => ({
        ...resource,
        createdAt: resource.createdAt.toISOString(),
      })),
    };
  }

  async uploadResource(
    file: Express.Multer.File,
    user_id: string,
  ): Promise<ResourceResponse> {
    const { key } = await this.storage.uploadFile(file);
    const resource = await this.prisma.resource.create({
      data: {
        url: key,
        user_id,
      },
      select: this.resourceResponseSelect,
    });

    return {
      ...resource,
      createdAt: resource.createdAt.toISOString(),
    };
  }
}
