import { Global, Module } from '@nestjs/common';
import { ProductService } from './product.service';

@Global()
@Module({
  providers: [ProductService],
  exports: [ProductService],
})
export class ProductModule {}
