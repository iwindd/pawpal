import { Module } from '@nestjs/common';
import { CopyObjectUseCase } from './application/usecases/copy-object.usecase';
import { UploadResourceImageUseCase } from './application/usecases/upload-resource-image.usecase';
import { STORAGE_SERVICE } from './domain/storage.port';
import { cloudflareProviders } from './infrastructure/cloudflare.providers';

@Module({
  providers: [...cloudflareProviders],
  exports: [STORAGE_SERVICE, UploadResourceImageUseCase, CopyObjectUseCase],
})
export class CloudflareModule {}
