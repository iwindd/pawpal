import { Controller, Get } from '@nestjs/common';
import { ProductResponse } from '@pawpal/shared';
import { ProductService } from './product.service';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get('/latest')
  async getLatestProducts(): Promise<ProductResponse[]> {
    return this.productService.getLatestProducts();
  }
}
