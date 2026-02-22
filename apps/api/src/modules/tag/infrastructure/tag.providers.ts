import { Provider } from '@nestjs/common';
import { TAG_REPOSITORY } from '../domain/repository.port';
import { PrismaTagRepository } from './prisma/prisma-tag.repository';

import { CreateTagUseCase } from '../application/usecases/create-tag.usecase';
import { GetProductsInTagDatatableUseCase } from '../application/usecases/get-products-in-tag-datatable.usecase';
import { GetTagDatatableUseCase } from '../application/usecases/get-tag-datatable.usecase';
import { GetTagUseCase } from '../application/usecases/get-tag.usecase';
import { UpdateTagUseCase } from '../application/usecases/update-tag.usecase';

export const tagProviders: Provider[] = [
  { provide: TAG_REPOSITORY, useClass: PrismaTagRepository },
  CreateTagUseCase,
  GetTagDatatableUseCase,
  GetProductsInTagDatatableUseCase,
  GetTagUseCase,
  UpdateTagUseCase,
];
