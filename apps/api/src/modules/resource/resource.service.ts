import { DatatableQuery } from '@/common/pipes/DatatablePipe';
import { Injectable } from '@nestjs/common';
import { ResourceResponse } from '@pawpal/shared';
import { CloudflareService } from '../cloudflare/cloudflare.service';
import { PrismaService } from '../prisma/prisma.service';

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
    private readonly storage: CloudflareService,
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

  async getAllResourceDatatable(query: DatatableQuery) {
    return await this.prisma.resource.getDatatable({
      query,
      select: this.resourceResponseSelect,
    });
  }

  /**
   * Upload resource image to cloudflare
   * @param file file to upload
   * @param user_id user id
   * @returns resource response
   */
  async uploadResource(
    file: Express.Multer.File,
    user_id: string,
  ): Promise<ResourceResponse> {
    const { key } = await this.storage.uploadResourceImage(file);
    const resource = await this.prisma.resource.create({
      data: {
        url: key,
        user: {
          connect: {
            id: user_id,
          },
        },
      },
      select: this.resourceResponseSelect,
    });

    return {
      ...resource,
      createdAt: resource.createdAt.toISOString(),
    };
  }

  /**
   * Upload resource images to cloudflare
   * @param files files to upload
   * @param user_id user id
   * @returns array of resource responses
   */
  async uploadResources(
    files: Array<Express.Multer.File>,
    user_id: string,
  ): Promise<ResourceResponse[]> {
    const promises = files.map(async (file) => {
      const { key } = await this.storage.uploadResourceImage(file);
      return this.prisma.resource.create({
        data: {
          url: key,
          user: {
            connect: {
              id: user_id,
            },
          },
        },
        select: this.resourceResponseSelect,
      });
    });

    const resources = await Promise.all(promises);

    return resources.map((resource) => ({
      ...resource,
      createdAt: resource.createdAt.toISOString(),
    }));
  }
}
