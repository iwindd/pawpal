import { Global, Module } from '@nestjs/common';
import { AdminProductController } from './admin-product.controller';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';

@Global()
@Module({
  controllers: [ProductController, AdminProductController],
  providers: [ProductService],
  exports: [ProductService],
})
export class ProductModule {}
