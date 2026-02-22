import { Inject, Injectable } from '@nestjs/common';
import { RoleInput } from '@pawpal/shared';
import { IRoleRepository, ROLE_REPOSITORY } from '../../domain/repository.port';

@Injectable()
export class CreateRoleUseCase {
  constructor(
    @Inject(ROLE_REPOSITORY) private readonly roleRepo: IRoleRepository,
  ) {}

  async execute(payload: RoleInput) {
    return this.roleRepo.create(payload);
  }
}
