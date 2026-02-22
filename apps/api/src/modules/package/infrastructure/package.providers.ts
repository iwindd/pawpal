import { Provider } from '@nestjs/common';
import { PACKAGE_REPOSITORY } from '../domain/repository.port';
import { PrismaPackageRepository } from './prisma/prisma-package.repository';

import { BulkUpdatePackagesUseCase } from '../application/usecases/bulk-update-packages.usecase';
import { CreatePackageForProductUseCase } from '../application/usecases/create-package-for-product.usecase';
import { GetPackageFieldsUseCase } from '../application/usecases/get-package-fields.usecase';
import { GetProductPackageDatatableUseCase } from '../application/usecases/get-product-package-datatable.usecase';
import { UpdatePackageUseCase } from '../application/usecases/update-package.usecase';

export const packageProviders: Provider[] = [
  { provide: PACKAGE_REPOSITORY, useClass: PrismaPackageRepository },
  GetPackageFieldsUseCase,
  GetProductPackageDatatableUseCase,
  CreatePackageForProductUseCase,
  UpdatePackageUseCase,
  BulkUpdatePackagesUseCase,
];
