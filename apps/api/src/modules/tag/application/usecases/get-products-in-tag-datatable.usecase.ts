import { DatatableQuery } from '@/common/pipes/DatatablePipe';
import { Inject, Injectable } from '@nestjs/common';
import { ITagRepository, TAG_REPOSITORY } from '../../domain/repository.port';

@Injectable()
export class GetProductsInTagDatatableUseCase {
  constructor(
    @Inject(TAG_REPOSITORY) private readonly tagRepo: ITagRepository,
  ) {}

  async execute(id: string, query: DatatableQuery) {
    return this.tagRepo.getProductsInTagDatatable(id, query);
  }
}
