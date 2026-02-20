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
import { PackageService } from './package.service';

@Controller('admin/package')
@UseGuards(SessionAuthGuard, JwtAuthGuard, PermissionGuard)
@Permissions(PermissionEnum.ProductManagement)
export class AdminPackageController {
  constructor(private readonly packageService: PackageService) {}

  @Get('product/:id')
  getProductPackageDatatable(
    @Param('id') id: string,
    @Query(DatatablePipe) query: DatatableQuery,
  ) {
    return this.packageService.getProductPackageDatatable(id, query);
  }

  @Post('product/:id')
  createPackageForProducts(
    @Param('id') id: string,
    @Body(new ZodPipe(packageSchema)) data: PackageInput,
  ) {
    return this.packageService.createPackageForProduct(id, data);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body(new ZodPipe(packageSchema)) data: PackageInput,
  ) {
    return this.packageService.update(id, data);
  }

  @Put('product/:id/bulk')
  bulkUpdatePackages(
    @Param('id') id: string,
    @Body(new ZodPipe(packageBulkSchema)) data: PackageBulkInput,
  ) {
    return this.packageService.bulkUpdatePackages(id, data);
  }
}
