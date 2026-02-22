import { DatatableQuery } from '@/common/pipes/DatatablePipe';
import { Inject, Injectable, Logger } from '@nestjs/common';
import {
  IProductRepository,
  PRODUCT_REPOSITORY,
} from '../../domain/repository.port';

@Injectable()
export class GetAllProductDatatableUseCase {
  private readonly logger = new Logger(GetAllProductDatatableUseCase.name);

  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepo: IProductRepository,
  ) {}

  async execute(query: DatatableQuery) {
    this.logger.debug(query);
    const filterCategory =
      query.filter || query.filter != 'all' ? null : query.filter;

    return this.productRepo.getAllProductDatatable(
      query,
      filterCategory ?? undefined,
    );
  }
}
