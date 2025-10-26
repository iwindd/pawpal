import {
  FindProductPipe,
  FindProductQuery,
} from '@/common/pipes/FindProductPipe';
import { Controller, Get, Param, Query } from '@nestjs/common';
import { ProductListItem } from '@pawpal/shared';
import { ProductService } from './product.service';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get('/new')
  async getNewProducts(
    @Query('limit') limit: number,
  ): Promise<ProductListItem[]> {
    return this.productService.getNewProducts(Number(limit));
  }

  @Get('/sale')
  async getSaleProducts(
    @Query('limit') limit: number,
  ): Promise<ProductListItem[]> {
    return this.productService.getSaleProducts(Number(limit));
  }

  @Get()
  async getAllProducts(@Query(FindProductPipe) query: FindProductQuery) {
    return this.productService.getAllProducts(query);
  }

  @Get(':slug')
  getProductBySlug(@Param('slug') slug: string) {
    return this.productService.getProductBySlug(slug);
  }

  @Get('admin/test')
  test(): { message: string; status: string } {
    return {
      message: 'Product service is working correctly',
      status: 'success',
    };
  }
}
