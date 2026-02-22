import { Inject, Injectable } from '@nestjs/common';
import { UploadResourceImageUseCase } from '../../../cloudflare/application/usecases/upload-resource-image.usecase';
import {
  IResourceRepository,
  RESOURCE_REPOSITORY,
} from '../../domain/repository.port';

@Injectable()
export class UploadResourceUseCase {
  constructor(
    @Inject(RESOURCE_REPOSITORY)
    private readonly resourceRepo: IResourceRepository,
    private readonly uploadResourceImage: UploadResourceImageUseCase,
  ) {}

  async execute(file: Express.Multer.File, userId: string) {
    const { key } = await this.uploadResourceImage.execute(file);
    return this.resourceRepo.createResource(key, userId);
  }
}
