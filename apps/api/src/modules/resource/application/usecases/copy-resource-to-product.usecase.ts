import { CloudflareUtil } from '@/utils/cloudflareUtil';
import { Utils } from '@/utils/utils';
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { CopyObjectUseCase } from '../../../cloudflare/application/usecases/copy-object.usecase';
import {
  IResourceRepository,
  RESOURCE_REPOSITORY,
} from '../../domain/repository.port';

@Injectable()
export class CopyResourceToProductUseCase {
  constructor(
    @Inject(RESOURCE_REPOSITORY)
    private readonly resourceRepo: IResourceRepository,
    private readonly copyObject: CopyObjectUseCase,
  ) {}

  async execute(resourceId: string) {
    const resource = await this.resourceRepo.findResourceForCopy(resourceId);
    if (!resource) throw new BadRequestException('resource_not_found');

    const extension = Utils.getExtension(resource.url);
    const imageName = `${uuidv4()}.${extension}`;
    const newKey = CloudflareUtil.getR2Path('product', imageName);

    await this.copyObject.execute(resource.url, newKey);

    return { key: newKey };
  }
}
