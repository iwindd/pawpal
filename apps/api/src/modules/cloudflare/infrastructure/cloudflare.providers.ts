import { Provider } from '@nestjs/common';
import { CopyObjectUseCase } from '../application/usecases/copy-object.usecase';
import { UploadResourceImageUseCase } from '../application/usecases/upload-resource-image.usecase';
import { STORAGE_SERVICE } from '../domain/storage.port';
import { R2StorageService } from '../infrastructure/r2/r2-storage.service';

export const cloudflareProviders: Provider[] = [
  { provide: STORAGE_SERVICE, useClass: R2StorageService },
  UploadResourceImageUseCase,
  CopyObjectUseCase,
];
