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
import { ProductService } from '../product.service';

@Controller('admin/product')
@UseGuards(SessionAuthGuard, JwtAuthGuard, PermissionGuard)
@Permissions(PermissionEnum.TagManagement)
export class AdminProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  getProductDatatable(@Query(new DatatablePipe()) query: DatatableQuery) {
    return this.productService.getProductDatatable(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productService.findOne(id);
  }

  @Post()
  createProduct(
    @Body(new ZodPipe(productSchema)) payload: ProductInput,
    @AuthUser() user: Session,
  ) {
    return this.productService.createProduct(payload, user.id);
  }

  @Patch(':id')
  updateProduct(
    @Param('id') id: string,
    @Body(new ZodPipe(productSchema)) payload: ProductInput,
    @AuthUser() user: Session,
  ) {
    return this.productService.updateProduct(id, payload, user.id);
  }
}
