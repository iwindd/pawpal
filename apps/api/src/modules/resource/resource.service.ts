import { Injectable } from '@nestjs/common';
import { ResourceResponse } from '@pawpal/shared';
import { PrismaService } from '../prisma/prisma.service';
import { LocalStorageService } from './local-storage.service';

@Injectable()
export class ResourceService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly storage: LocalStorageService,
  ) {}

  async getResources(): Promise<ResourceResponse[]> {
    const resources = await this.prisma.resource.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      select: {
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
      },
    });
    return resources.map((resource) => ({
      ...resource,
      createdAt: resource.createdAt.toISOString(),
    }));
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
      select: {
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
      },
    });

    return {
      ...resource,
      createdAt: resource.createdAt.toISOString(),
    };
  }
}
