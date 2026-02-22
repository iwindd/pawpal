import { Inject, Injectable } from '@nestjs/common';
import {
  IPackageRepository,
  PACKAGE_REPOSITORY,
} from '../../domain/repository.port';

@Injectable()
export class GetPackageFieldsUseCase {
  constructor(
    @Inject(PACKAGE_REPOSITORY)
    private readonly packageRepo: IPackageRepository,
  ) {}

  async execute(packageId: string) {
    return this.packageRepo.getFields(packageId);
  }
}
