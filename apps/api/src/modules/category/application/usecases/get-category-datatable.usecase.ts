import { DatatableQuery } from '@/common/pipes/DatatablePipe';
import { Inject, Injectable } from '@nestjs/common';
import {
  CATEGORY_REPOSITORY,
  ICategoryRepository,
} from '../../domain/repository.port';

@Injectable()
export class GetCategoryDatatableUseCase {
  constructor(
    @Inject(CATEGORY_REPOSITORY)
    private readonly categoryRepo: ICategoryRepository,
  ) {}

  async execute(query: DatatableQuery) {
    return this.categoryRepo.findAll(query);
  }
}
