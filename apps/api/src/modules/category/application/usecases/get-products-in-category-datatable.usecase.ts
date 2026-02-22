import { DatatableQuery } from '@/common/pipes/DatatablePipe';
import { Inject, Injectable } from '@nestjs/common';
import {
  CATEGORY_REPOSITORY,
  ICategoryRepository,
} from '../../domain/repository.port';

@Injectable()
export class GetProductsInCategoryDatatableUseCase {
  constructor(
    @Inject(CATEGORY_REPOSITORY)
    private readonly categoryRepo: ICategoryRepository,
  ) {}

  async execute(id: string, query: DatatableQuery) {
    return this.categoryRepo.getProductsInCategoryDatatable(id, query);
  }
}
