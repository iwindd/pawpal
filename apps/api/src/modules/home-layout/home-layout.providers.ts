import { Provider } from '@nestjs/common';
import { CreateHomeLayoutUseCase } from './application/usecases/create-home-layout.usecase';
import { GetAllHomeLayoutDatatableUseCase } from './application/usecases/get-all-home-layout-datatable.usecase';
import { GetHomeLayoutUseCase } from './application/usecases/get-home-layout.usecase';
import { GetPublishedHomeLayoutUseCase } from './application/usecases/get-published-home-layout.usecase';
import { I_HOME_LAYOUT_REPOSITORY } from './domain/repository.port';
import { PrismaHomeLayoutRepository } from './infrastructure/prisma/prisma-home-layout.repository';

export const HomeLayoutProviders: Provider[] = [
  {
    provide: I_HOME_LAYOUT_REPOSITORY,
    useClass: PrismaHomeLayoutRepository,
  },
  CreateHomeLayoutUseCase,
  GetHomeLayoutUseCase,
  GetPublishedHomeLayoutUseCase,
  GetAllHomeLayoutDatatableUseCase,
];
