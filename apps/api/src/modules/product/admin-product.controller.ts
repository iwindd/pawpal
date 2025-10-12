import { ZodValidationPipe } from '@/common/ZodValidationPipe';
import { Controller, Get, Param, Query, UsePipes } from '@nestjs/common';
import {
  AdminProductResponse,
  DatatableQueryDto,
  DatatableQuerySchema,
  DatatableResponse,
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
}
