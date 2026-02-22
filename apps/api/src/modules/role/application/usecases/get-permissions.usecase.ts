import { Inject, Injectable } from '@nestjs/common';
import { IRoleRepository, ROLE_REPOSITORY } from '../../domain/repository.port';

@Injectable()
export class GetPermissionsUseCase {
  constructor(
    @Inject(ROLE_REPOSITORY) private readonly roleRepo: IRoleRepository,
  ) {}

  async execute() {
    return this.roleRepo.getPermissions();
  }
}
