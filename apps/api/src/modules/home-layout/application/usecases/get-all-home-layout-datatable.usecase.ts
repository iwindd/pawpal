import { DatatableQuery } from '@/common/pipes/DatatablePipe';
import { Inject, Injectable } from '@nestjs/common';
import {
  IHomeLayoutRepository,
  I_HOME_LAYOUT_REPOSITORY,
} from '../../domain/repository.port';

@Injectable()
export class GetAllHomeLayoutDatatableUseCase {
  constructor(
    @Inject(I_HOME_LAYOUT_REPOSITORY)
    private readonly repository: IHomeLayoutRepository,
  ) {}

  async execute(query: DatatableQuery) {
    return await this.repository.getDatatable(query);
  }
}
