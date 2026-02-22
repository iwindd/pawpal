import { Provider } from '@nestjs/common';
import { CATEGORY_REPOSITORY } from '../domain/repository.port';
import { PrismaCategoryRepository } from './prisma/prisma-category.repository';

import { CreateCategoryUseCase } from '../application/usecases/create-category.usecase';
import { GetCategoryDatatableUseCase } from '../application/usecases/get-category-datatable.usecase';
import { GetCategoryUseCase } from '../application/usecases/get-category.usecase';
import { GetProductsInCategoryDatatableUseCase } from '../application/usecases/get-products-in-category-datatable.usecase';
import { RemoveCategoryUseCase } from '../application/usecases/remove-category.usecase';
import { UpdateCategoryUseCase } from '../application/usecases/update-category.usecase';

export const categoryProviders: Provider[] = [
  { provide: CATEGORY_REPOSITORY, useClass: PrismaCategoryRepository },
  GetCategoryDatatableUseCase,
  GetCategoryUseCase,
  CreateCategoryUseCase,
  UpdateCategoryUseCase,
  RemoveCategoryUseCase,
  GetProductsInCategoryDatatableUseCase,
];
