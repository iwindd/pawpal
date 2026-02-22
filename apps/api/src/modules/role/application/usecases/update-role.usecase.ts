import { Inject, Injectable } from '@nestjs/common';
import { RoleInput } from '@pawpal/shared';
import { IRoleRepository, ROLE_REPOSITORY } from '../../domain/repository.port';

@Injectable()
export class UpdateRoleUseCase {
  constructor(
    @Inject(ROLE_REPOSITORY) private readonly roleRepo: IRoleRepository,
  ) {}

  async execute(id: string, payload: RoleInput) {
    return this.roleRepo.update(id, payload);
  }
}
