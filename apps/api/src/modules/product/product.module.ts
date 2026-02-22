import { Global, Module } from '@nestjs/common';
import { ResourceModule } from '../resource/resource.module';
import { productProviders } from './infrastructure/product.providers';
import { AdminProductController } from './presentation/admin-product.controller';
import { ProductController } from './presentation/product.controller';

import { GetNewProductsUseCase } from './application/usecases/get-new-products.usecase';
import { GetSaleProductsUseCase } from './application/usecases/get-sale-products.usecase';
import { PRODUCT_REPOSITORY } from './domain/repository.port';

@Global()
@Module({
  imports: [ResourceModule],
  controllers: [ProductController, AdminProductController],
  providers: [...productProviders],
  exports: [PRODUCT_REPOSITORY, GetNewProductsUseCase, GetSaleProductsUseCase],
})
export class ProductModule {}
