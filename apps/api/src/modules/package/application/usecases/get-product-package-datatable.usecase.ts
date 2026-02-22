import { DatatableQuery } from '@/common/pipes/DatatablePipe';
import { Inject, Injectable } from '@nestjs/common';
import {
  IPackageRepository,
  PACKAGE_REPOSITORY,
} from '../../domain/repository.port';

@Injectable()
export class GetProductPackageDatatableUseCase {
  constructor(
    @Inject(PACKAGE_REPOSITORY)
    private readonly packageRepo: IPackageRepository,
  ) {}

  async execute(productId: string, query: DatatableQuery) {
    return this.packageRepo.getProductPackageDatatable(productId, query);
  }
}
