import { AuthUser } from '@/common/decorators/user.decorator';
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
} from '@nestjs/common';
import { ProductInput, productSchema, Session } from '@pawpal/shared';
import { ProductService } from '../product.service';

@Controller('admin/product')
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
