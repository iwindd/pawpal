import { FindProductFiltersQuery } from '@/common/pipes/FindProductFiltersPipe';
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

  async execute(query: FindProductFiltersQuery) {
    this.logger.debug(query);
    return this.productRepo.getAllProductDatatable(query);
  }
}
