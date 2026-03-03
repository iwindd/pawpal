import { DatatableQuery } from '@/common/pipes/DatatablePipe';
import { Inject, Injectable } from '@nestjs/common';
import {
  IProductRepository,
  PRODUCT_REPOSITORY,
} from '../../domain/repository.port';

@Injectable()
export class GetProductsByTagUseCase {
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepo: IProductRepository,
  ) {}

  async execute(slug: string, query: DatatableQuery) {
    return this.productRepo.getByTagSlug(slug, query);
  }
}
