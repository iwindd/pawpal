import { Provider } from '@nestjs/common';
import { ROLE_REPOSITORY } from '../domain/repository.port';
import { PrismaRoleRepository } from './prisma/prisma-role.repository';

import { CreateRoleUseCase } from '../application/usecases/create-role.usecase';
import { GetPermissionsUseCase } from '../application/usecases/get-permissions.usecase';
import { GetRoleDatatableUseCase } from '../application/usecases/get-role-datatable.usecase';
import { GetRoleUseCase } from '../application/usecases/get-role.usecase';
import { RemoveRoleUseCase } from '../application/usecases/remove-role.usecase';
import { UpdateRoleUseCase } from '../application/usecases/update-role.usecase';

export const roleProviders: Provider[] = [
  { provide: ROLE_REPOSITORY, useClass: PrismaRoleRepository },
  GetRoleDatatableUseCase,
  GetRoleUseCase,
  GetPermissionsUseCase,
  CreateRoleUseCase,
  UpdateRoleUseCase,
  RemoveRoleUseCase,
];
