import { Permissions } from '@/common/decorators/permissions.decorator';
import { JwtAuthGuard } from '@/common/guards/auth/jwt-auth.guard';
import { SessionAuthGuard } from '@/common/guards/auth/session-auth.guard';
import { PermissionGuard } from '@/common/guards/permission.guard';
import { DatatablePipe, DatatableQuery } from '@/common/pipes/DatatablePipe';
import { ZodPipe } from '@/common/pipes/ZodPipe';
import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  PackageBulkInput,
  PackageInput,
  PermissionEnum,
  packageBulkSchema,
  packageSchema,
} from '@pawpal/shared';

import { BulkUpdatePackagesUseCase } from '../application/usecases/bulk-update-packages.usecase';
import { CreatePackageForProductUseCase } from '../application/usecases/create-package-for-product.usecase';
import { GetProductPackageDatatableUseCase } from '../application/usecases/get-product-package-datatable.usecase';
import { UpdatePackageUseCase } from '../application/usecases/update-package.usecase';

@Controller('admin/package')
@UseGuards(SessionAuthGuard, JwtAuthGuard, PermissionGuard)
@Permissions(PermissionEnum.ProductManagement)
export class AdminPackageController {
  constructor(
    private readonly getProductPackageDatatable: GetProductPackageDatatableUseCase,
    private readonly createPackageForProduct: CreatePackageForProductUseCase,
    private readonly updatePackage: UpdatePackageUseCase,
    private readonly bulkUpdatePackages: BulkUpdatePackagesUseCase,
  ) {}

  @Get('product/:id')
  getDatatable(
    @Param('id') id: string,
    @Query(DatatablePipe) query: DatatableQuery,
  ) {
    return this.getProductPackageDatatable.execute(id, query);
  }

  @Post('product/:id')
  create(
    @Param('id') id: string,
    @Body(new ZodPipe(packageSchema)) data: PackageInput,
  ) {
    return this.createPackageForProduct.execute(id, data);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body(new ZodPipe(packageSchema)) data: PackageInput,
  ) {
    return this.updatePackage.execute(id, data);
  }

  @Put('product/:id/bulk')
  bulkUpdate(
    @Param('id') id: string,
    @Body(new ZodPipe(packageBulkSchema)) data: PackageBulkInput,
  ) {
    return this.bulkUpdatePackages.execute(id, data);
  }
}
