import {
  FindProductPipe,
  FindProductQuery,
} from '@/common/pipes/FindProductPipe';
import { Controller, Get, Param, Query } from '@nestjs/common';

import { GetAllProductDatatableUseCase } from '../application/usecases/get-all-product-datatable.usecase';
import { GetNewProductsUseCase } from '../application/usecases/get-new-products.usecase';
import { GetProductBySlugUseCase } from '../application/usecases/get-product-by-slug.usecase';
import { GetProductsByCategoryUseCase } from '../application/usecases/get-products-by-category.usecase';
import { GetProductsByTagUseCase } from '../application/usecases/get-products-by-tag.usecase';
import { GetSaleProductDatatableUseCase } from '../application/usecases/get-sale-product-datatable.usecase';
import { GetSaleProductsUseCase } from '../application/usecases/get-sale-products.usecase';

@Controller('product')
export class ProductController {
  constructor(
    private readonly getAllProductDatatable: GetAllProductDatatableUseCase,
    private readonly getSaleProductDatatable: GetSaleProductDatatableUseCase,
    private readonly getProductBySlug: GetProductBySlugUseCase,
    private readonly getNewProducts: GetNewProductsUseCase,
    private readonly getSaleProducts: GetSaleProductsUseCase,
    private readonly getProductsByTag: GetProductsByTagUseCase,
    private readonly getProductsByCategory: GetProductsByCategoryUseCase,
  ) {}

  @Get('/sale')
  getSaleDatatable(@Query(FindProductPipe) query: FindProductQuery) {
    return this.getSaleProductDatatable.execute(query);
  }

  @Get('/new')
  getNew() {
    return this.getNewProducts.execute();
  }

  @Get('/tag/:slug')
  getByTag(
    @Param('slug') slug: string,
    @Query(FindProductPipe) query: FindProductQuery,
  ) {
    return this.getProductsByTag.execute(slug, query);
  }

  @Get('/category/:slug')
  getByCategory(
    @Param('slug') slug: string,
    @Query(FindProductPipe) query: FindProductQuery,
  ) {
    return this.getProductsByCategory.execute(slug, query);
  }

  @Get()
  getAllDatatable(@Query(FindProductPipe) query: FindProductQuery) {
    return this.getAllProductDatatable.execute(query);
  }

  @Get(':slug')
  getBySlug(@Param('slug') slug: string) {
    return this.getProductBySlug.execute(slug);
  }
}
