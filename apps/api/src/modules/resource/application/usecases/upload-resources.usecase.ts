import { Inject, Injectable } from '@nestjs/common';
import { UploadResourceImageUseCase } from '../../../cloudflare/application/usecases/upload-resource-image.usecase';
import {
  IResourceRepository,
  RESOURCE_REPOSITORY,
} from '../../domain/repository.port';

@Injectable()
export class UploadResourcesUseCase {
  constructor(
    @Inject(RESOURCE_REPOSITORY)
    private readonly resourceRepo: IResourceRepository,
    private readonly uploadResourceImage: UploadResourceImageUseCase,
  ) {}

  async execute(files: Array<Express.Multer.File>, userId: string) {
    const promises = files.map(async (file) => {
      const { key } = await this.uploadResourceImage.execute(file);
      return this.resourceRepo.createResourceImage(key, userId);
    });
    return Promise.all(promises);
  }
}
