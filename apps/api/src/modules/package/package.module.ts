import { Global, Module } from '@nestjs/common';
import { AdminPackageController } from './admin-package.controller';
import { PackageService } from './package.service';

@Global()
@Module({
  controllers: [AdminPackageController],
  providers: [PackageService],
  exports: [PackageService],
})
export class PackageModule {}
