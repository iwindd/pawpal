import { Inject, Injectable } from '@nestjs/common';
import { PackageInput } from '@pawpal/shared';
import {
  IPackageRepository,
  PACKAGE_REPOSITORY,
} from '../../domain/repository.port';

@Injectable()
export class UpdatePackageUseCase {
  constructor(
    @Inject(PACKAGE_REPOSITORY)
    private readonly packageRepo: IPackageRepository,
  ) {}

  async execute(packageId: string, payload: PackageInput) {
    return this.packageRepo.update(packageId, payload);
  }
}
