import { Provider } from '@nestjs/common';
import { FIELD_REPOSITORY } from '../domain/repository.port';
import { PrismaFieldRepository } from './prisma/prisma-field.repository';

import { BulkUpdateFieldsUseCase } from '../application/usecases/bulk-update-fields.usecase';
import { CreateProductFieldUseCase } from '../application/usecases/create-product-field.usecase';
import { GetProductFieldDatatableUseCase } from '../application/usecases/get-product-field-datatable.usecase';
import { ReorderProductFieldUseCase } from '../application/usecases/reorder-product-field.usecase';
import { UpdateFieldUseCase } from '../application/usecases/update-field.usecase';

export const fieldProviders: Provider[] = [
  { provide: FIELD_REPOSITORY, useClass: PrismaFieldRepository },
  CreateProductFieldUseCase,
  UpdateFieldUseCase,
  GetProductFieldDatatableUseCase,
  ReorderProductFieldUseCase,
  BulkUpdateFieldsUseCase,
];
