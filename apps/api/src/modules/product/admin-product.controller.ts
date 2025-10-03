import { ZodValidationPipe } from '@/common/ZodValidationPipe';
import { Controller, Get, Query, UsePipes } from '@nestjs/common';
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
}
