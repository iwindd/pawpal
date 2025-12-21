import { ResourceResponseMapper } from '@/common/mappers/ResourceResponseMapper';
import { DatatableQuery } from '@/common/pipes/DatatablePipe';
import { ResourceType } from '@/generated/prisma/enums';
import { CloudflareUtil } from '@/utils/cloudflareUtil';
import { Utils } from '@/utils/utils';
import { BadRequestException, Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { CloudflareService } from '../cloudflare/cloudflare.service';
import { PrismaService } from '../prisma/prisma.service';
@Injectable()
export class ResourceService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly storage: CloudflareService,
  ) {}

  /**
   * Get resource by id
   * @param id resource id
   * @returns resource response
   */
  async findOne(id: string) {
    const resource = await this.prisma.resource.findUnique({
      where: { id },
      select: ResourceResponseMapper.SELECT,
    });

    if (!resource) throw new Error('resource_not_found');

    return ResourceResponseMapper.fromQuery(resource);
  }

  /**
   * Get all resources datatable
   * @param query datatable query
   * @returns datatable response
   */
  async getAllResourceDatatable(query: DatatableQuery) {
    CloudflareUtil.logger.debug(query);
    const { data, total } = await this.prisma.resource.getDatatable({
      query,
      select: ResourceResponseMapper.SELECT,
      where: {
        type: ResourceType.RESOURCE_IMAGE,
      },
    });

    return {
      data: data.map(ResourceResponseMapper.fromQuery),
      total,
    };
  }

  /**
   * Upload resource image to cloudflare
   * @param file file to upload
   * @param user_id user id
   * @returns resource response
   */
  async uploadResource(file: Express.Multer.File, user_id: string) {
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
      select: ResourceResponseMapper.SELECT,
    });

    return ResourceResponseMapper.fromQuery(resource);
  }

  /**
   * Upload resource images to cloudflare
   * @param files files to upload
   * @param user_id user id
   * @returns array of resource responses
   */
  async uploadResources(files: Array<Express.Multer.File>, user_id: string) {
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
          type: ResourceType.RESOURCE_IMAGE,
        },
        select: ResourceResponseMapper.SELECT,
      });
    });

    const resources = await Promise.all(promises);

    return resources.map(ResourceResponseMapper.fromQuery);
  }

  /**
   * Use an image as a product image
   * @param resourceId Resource ID
   * @param productSlug Product Slug
   * @returns
   */
  public async copyResourceToProduct(resourceId: string) {
    const resource = await this.prisma.resource.findUnique({
      where: { id: resourceId, type: ResourceType.RESOURCE_IMAGE },
      select: {
        id: true,
        url: true,
      },
    });

    if (!resource) throw new BadRequestException('resource_not_found');

    const extension = Utils.getExtension(resource.url);
    const imageName = `${uuidv4()}.${extension}`;
    const newKey = CloudflareUtil.getR2Path('product', imageName);

    await this.storage.copyObject(resource.url, newKey);

    return {
      key: newKey,
    };
  }
}
