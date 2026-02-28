import { Provider } from '@nestjs/common';
import { PRODUCT_REPOSITORY } from '../domain/repository.port';
import { PrismaProductRepository } from './prisma/prisma-product.repository';

// Application UseCases
import { CreateProductUseCase } from '../application/usecases/create-product.usecase';
import { GetAllProductDatatableUseCase } from '../application/usecases/get-all-product-datatable.usecase';
import { GetNewProductsUseCase } from '../application/usecases/get-new-products.usecase';
import { GetProductBySlugUseCase } from '../application/usecases/get-product-by-slug.usecase';
import { GetProductDatatableUseCase } from '../application/usecases/get-product-datatable.usecase';
import { GetProductStockUseCase } from '../application/usecases/get-product-stock.usecase';
import { GetProductUseCase } from '../application/usecases/get-product.usecase';
import { GetSaleProductDatatableUseCase } from '../application/usecases/get-sale-product-datatable.usecase';
import { GetSaleProductsUseCase } from '../application/usecases/get-sale-products.usecase';
import { UpdateProductStockUseCase } from '../application/usecases/update-product-stock.usecase';
import { UpdateProductUseCase } from '../application/usecases/update-product.usecase';

export const productProviders: Provider[] = [
  {
    provide: PRODUCT_REPOSITORY,
    useClass: PrismaProductRepository,
  },
  GetNewProductsUseCase,
  GetSaleProductsUseCase,
  GetProductBySlugUseCase,
  GetAllProductDatatableUseCase,
  GetSaleProductDatatableUseCase,
  GetProductDatatableUseCase,
  GetProductUseCase,
  CreateProductUseCase,
  UpdateProductUseCase,
  UpdateProductStockUseCase,
  GetProductStockUseCase,
];
