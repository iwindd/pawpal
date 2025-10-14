import { ZodValidationPipe } from '@/common/ZodValidationPipe';
import { Body, Controller, Delete, Get, Param, Post, Query, UsePipes } from '@nestjs/common';
import {
    AdminProductResponse,
    DatatableQueryDto,
    DatatableQuerySchema,
    DatatableResponse,
    ProductInput,
    productSchema
} from '@pawpal/shared';
import { ProductService } from './product.service';

@Controller('admin/product')
export class AdminProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  @UsePipes(new ZodValidationPipe(DatatableQuerySchema))
  async getProducts(
    @Query() queryParams: DatatableQueryDto,
  ): Promise<DatatableResponse<AdminProductResponse>> {
    return this.productService.getProducts(queryParams);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productService.findOne(id);
  }

  @Post()
  @UsePipes(new ZodValidationPipe(productSchema))
  create(@Body() createProductDto: ProductInput): Promise<AdminProductResponse> {
    return this.productService.create(createProductDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<{ success: boolean }> {
    return this.productService.remove(id);
  }
}
