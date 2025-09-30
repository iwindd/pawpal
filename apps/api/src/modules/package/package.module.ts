import { Global, Module } from '@nestjs/common';
import { PackageService } from './package.service';

@Global()
@Module({
  providers: [PackageService],
  exports: [PackageService],
})
export class PackageModule {}
