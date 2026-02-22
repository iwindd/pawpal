import { Inject, Injectable } from '@nestjs/common';
import { PackageBulkInput } from '@pawpal/shared';
import {
  IPackageRepository,
  PACKAGE_REPOSITORY,
} from '../../domain/repository.port';

@Injectable()
export class BulkUpdatePackagesUseCase {
  constructor(
    @Inject(PACKAGE_REPOSITORY)
    private readonly packageRepo: IPackageRepository,
  ) {}

  async execute(productId: string, payload: PackageBulkInput) {
    return this.packageRepo.bulkUpdatePackages(productId, payload);
  }
}
