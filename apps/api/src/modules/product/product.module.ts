import { Global, Module } from '@nestjs/common';
import { AdminProductController } from './controllers/admin-product.controller';
import { ProductController } from './controllers/product.controller';
import { ProductRepository } from './product.repository';
import { ProductService } from './product.service';

@Global()
@Module({
  controllers: [ProductController, AdminProductController],
  providers: [ProductService, ProductRepository],
  exports: [ProductService, ProductRepository],
})
export class ProductModule {}
