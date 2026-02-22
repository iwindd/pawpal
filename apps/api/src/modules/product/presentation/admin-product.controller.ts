import { Permissions } from '@/common/decorators/permissions.decorator';
import { AuthUser } from '@/common/decorators/user.decorator';
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
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  PermissionEnum,
  ProductInput,
  productSchema,
  Session,
} from '@pawpal/shared';

import { CreateProductUseCase } from '../application/usecases/create-product.usecase';
import { GetProductDatatableUseCase } from '../application/usecases/get-product-datatable.usecase';
import { GetProductUseCase } from '../application/usecases/get-product.usecase';
import { UpdateProductUseCase } from '../application/usecases/update-product.usecase';

@Controller('admin/product')
@UseGuards(SessionAuthGuard, JwtAuthGuard, PermissionGuard)
@Permissions(PermissionEnum.TagManagement)
export class AdminProductController {
  constructor(
    private readonly getProductDatatable: GetProductDatatableUseCase,
    private readonly getProduct: GetProductUseCase,
    private readonly createProduct: CreateProductUseCase,
    private readonly updateProduct: UpdateProductUseCase,
  ) {}

  @Get()
  getDatatable(@Query(new DatatablePipe()) query: DatatableQuery) {
    return this.getProductDatatable.execute(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.getProduct.execute(id);
  }

  @Post()
  create(
    @Body(new ZodPipe(productSchema)) payload: ProductInput,
    @AuthUser() user: Session,
  ) {
    return this.createProduct.execute(payload, user.id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body(new ZodPipe(productSchema)) payload: ProductInput,
    @AuthUser() user: Session,
  ) {
    return this.updateProduct.execute(id, payload, user.id);
  }
}
