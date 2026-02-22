import { DatatableQuery } from '@/common/pipes/DatatablePipe';
import { Inject, Injectable } from '@nestjs/common';
import {
  IResourceRepository,
  RESOURCE_REPOSITORY,
} from '../../domain/repository.port';

@Injectable()
export class GetResourceDatatableUseCase {
  constructor(
    @Inject(RESOURCE_REPOSITORY)
    private readonly resourceRepo: IResourceRepository,
  ) {}

  async execute(query: DatatableQuery) {
    return this.resourceRepo.getAllResourceDatatable(query);
  }
}
