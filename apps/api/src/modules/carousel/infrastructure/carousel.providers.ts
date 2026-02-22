import { Provider } from '@nestjs/common';
import { CAROUSEL_REPOSITORY } from '../domain/repository.port';
import { PrismaCarouselRepository } from './prisma/prisma-carousel.repository';

import { CreateCarouselUseCase } from '../application/usecases/create-carousel.usecase';
import { GetAllCarouselDatatableUseCase } from '../application/usecases/get-all-carousel-datatable.usecase';
import { GetCarouselUseCase } from '../application/usecases/get-carousel.usecase';
import { GetPublishedCarouselDatatableUseCase } from '../application/usecases/get-published-carousel-datatable.usecase';
import { ReorderCarouselUseCase } from '../application/usecases/reorder-carousel.usecase';
import { UpdateCarouselUseCase } from '../application/usecases/update-carousel.usecase';

export const carouselProviders: Provider[] = [
  { provide: CAROUSEL_REPOSITORY, useClass: PrismaCarouselRepository },
  CreateCarouselUseCase,
  GetAllCarouselDatatableUseCase,
  GetPublishedCarouselDatatableUseCase,
  GetCarouselUseCase,
  UpdateCarouselUseCase,
  ReorderCarouselUseCase,
];
