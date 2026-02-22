import { Inject, Injectable } from '@nestjs/common';
import { PackageInput } from '@pawpal/shared';
import {
  IPackageRepository,
  PACKAGE_REPOSITORY,
} from '../../domain/repository.port';

@Injectable()
export class CreatePackageForProductUseCase {
  constructor(
    @Inject(PACKAGE_REPOSITORY)
    private readonly packageRepo: IPackageRepository,
  ) {}

  async execute(productId: string, payload: PackageInput) {
    return this.packageRepo.createPackageForProduct(productId, payload);
  }
}
