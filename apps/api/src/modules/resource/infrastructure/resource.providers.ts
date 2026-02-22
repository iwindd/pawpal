import { Provider } from '@nestjs/common';
import { RESOURCE_REPOSITORY } from '../domain/repository.port';
import { PrismaResourceRepository } from './prisma/prisma-resource.repository';

import { CopyResourceToProductUseCase } from '../application/usecases/copy-resource-to-product.usecase';
import { GetResourceDatatableUseCase } from '../application/usecases/get-resource-datatable.usecase';
import { GetResourceUseCase } from '../application/usecases/get-resource.usecase';
import { UploadResourceUseCase } from '../application/usecases/upload-resource.usecase';
import { UploadResourcesUseCase } from '../application/usecases/upload-resources.usecase';

export const resourceProviders: Provider[] = [
  { provide: RESOURCE_REPOSITORY, useClass: PrismaResourceRepository },
  GetResourceUseCase,
  GetResourceDatatableUseCase,
  UploadResourceUseCase,
  UploadResourcesUseCase,
  CopyResourceToProductUseCase,
];
