import { Inject, Injectable } from '@nestjs/common';
import { IRoleRepository, ROLE_REPOSITORY } from '../../domain/repository.port';

@Injectable()
export class RemoveRoleUseCase {
  constructor(
    @Inject(ROLE_REPOSITORY) private readonly roleRepo: IRoleRepository,
  ) {}

  async execute(id: string) {
    return this.roleRepo.remove(id);
  }
}
