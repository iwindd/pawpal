import {
  FindProductPipe,
  FindProductQuery,
} from '@/common/pipes/FindProductPipe';
import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { ProductService } from './product.service';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get('/new')
  getNewProducts(
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
  ) {
    return this.productService.getNewProducts(Math.min(limit || 4, 100));
  }

  @Get('/sale')
  getSaleProducts(
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
  ) {
    return this.productService.getSaleProducts(Math.min(limit || 4, 100));
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
