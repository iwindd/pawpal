import { DatatablePipe, DatatableQuery } from '@/common/pipes/DatatablePipe';
import { ZodPipe } from '@/common/pipes/ZodPipe';
import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { PackageInput, packageSchema } from '@pawpal/shared';
import { PackageService } from './package.service';

@Controller('admin/package')
export class AdminPackageController {
  constructor(private readonly packageService: PackageService) {}

  @Get('product/:id')
  getProductPackages(
    @Param('id') id: string,
    @Query(DatatablePipe) query: DatatableQuery,
  ) {
    return this.packageService.getProductPackages(id, query);
  }

  @Post('product/:id')
  createPackageForProducts(
    @Param('id') id: string,
    @Body(new ZodPipe(packageSchema)) data: PackageInput,
  ) {
    return this.packageService.createPackageForProduct(id, data);
  }
}
