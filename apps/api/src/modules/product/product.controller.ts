import { Controller, Get, Query } from '@nestjs/common';
import { ProductResponse } from '@pawpal/shared';
import { ProductService } from './product.service';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get('/new')
  async getNewProducts(
    @Query('limit') limit: number,
  ): Promise<ProductResponse[]> {
    return this.productService.getNewProducts(Number(limit));
  }

  @Get('/sale')
  async getSaleProducts(
    @Query('limit') limit: number,
  ): Promise<ProductResponse[]> {
    return this.productService.getSaleProducts(Number(limit));
  }

  @Get()
  async getAllProducts(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 12,
    @Query('search') search?: string,
    @Query('category') category?: string,
  ): Promise<{ products: ProductResponse[]; total: number; hasMore: boolean }> {
    return this.productService.getAllProducts({
      page: Number(page),
      limit: Number(limit),
      search,
      category,
    });
  }

  @Get('admin/test')
  test(): { message: string; status: string } {
    return {
      message: 'Product service is working correctly',
      status: 'success',
    };
  }
}
