import {
  FindProductPipe,
  FindProductQuery,
} from '@/common/pipes/FindProductPipe';
import { Controller, Get, Param, Query } from '@nestjs/common';

import { GetAllProductDatatableUseCase } from '../application/usecases/get-all-product-datatable.usecase';
import { GetProductBySlugUseCase } from '../application/usecases/get-product-by-slug.usecase';
import { GetSaleProductDatatableUseCase } from '../application/usecases/get-sale-product-datatable.usecase';

@Controller('product')
export class ProductController {
  constructor(
    private readonly getAllProductDatatable: GetAllProductDatatableUseCase,
    private readonly getSaleProductDatatable: GetSaleProductDatatableUseCase,
    private readonly getProductBySlug: GetProductBySlugUseCase,
  ) {}

  @Get('/sale')
  getSaleDatatable(@Query(FindProductPipe) query: FindProductQuery) {
    return this.getSaleProductDatatable.execute(query);
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
