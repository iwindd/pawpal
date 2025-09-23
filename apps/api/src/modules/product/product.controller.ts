import { Controller, Get, Query } from '@nestjs/common';
import { ProductResponse } from '@pawpal/shared';
import { ProductService } from './product.service';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get('/latest')
  async getLatestProducts(
    @Query('limit') limit: number,
  ): Promise<ProductResponse[]> {
    return this.productService.getLatestProducts(Number(limit));
  }
}
