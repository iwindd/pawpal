import { DatatableQuery } from '@/common/pipes/DatatablePipe';
import { Inject, Injectable } from '@nestjs/common';
import { IRoleRepository, ROLE_REPOSITORY } from '../../domain/repository.port';

@Injectable()
export class GetRoleDatatableUseCase {
  constructor(
    @Inject(ROLE_REPOSITORY) private readonly roleRepo: IRoleRepository,
  ) {}

  async execute(query: DatatableQuery) {
    return this.roleRepo.getDatatable(query);
  }
}
