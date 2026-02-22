import { DatatableQuery } from '@/common/pipes/DatatablePipe';
import { Inject, Injectable } from '@nestjs/common';
import {
  FIELD_REPOSITORY,
  IFieldRepository,
} from '../../domain/repository.port';

@Injectable()
export class GetProductFieldDatatableUseCase {
  constructor(
    @Inject(FIELD_REPOSITORY) private readonly fieldRepo: IFieldRepository,
  ) {}

  async execute(productId: string, query: DatatableQuery) {
    return this.fieldRepo.getProductFieldDatatable(productId, query);
  }
}
