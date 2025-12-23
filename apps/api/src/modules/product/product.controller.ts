import {
  FindProductPipe,
  FindProductQuery,
} from '@/common/pipes/FindProductPipe';
import { Controller, Get, Param, Query } from '@nestjs/common';
import { ProductService } from './product.service';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get('/sale')
  getSaleProductDatatable(@Query(FindProductPipe) query: FindProductQuery) {
    return this.productService.getSaleProductDatatable(query);
  }

  @Get()
  getAllProductDatatable(@Query(FindProductPipe) query: FindProductQuery) {
    return this.productService.getAllProductDatatable(query);
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
