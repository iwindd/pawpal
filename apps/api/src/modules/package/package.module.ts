import { Global, Module } from '@nestjs/common';
import { packageProviders } from './infrastructure/package.providers';
import { AdminPackageController } from './presentation/admin-package.controller';

import { GetPackageFieldsUseCase } from './application/usecases/get-package-fields.usecase';
import { PACKAGE_REPOSITORY } from './domain/repository.port';

@Global()
@Module({
  controllers: [AdminPackageController],
  providers: [...packageProviders],
  exports: [PACKAGE_REPOSITORY, GetPackageFieldsUseCase],
})
export class PackageModule {}
