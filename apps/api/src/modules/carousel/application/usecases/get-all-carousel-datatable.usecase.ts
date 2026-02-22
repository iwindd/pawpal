import { DatatableQuery } from '@/common/pipes/DatatablePipe';
import { Inject, Injectable } from '@nestjs/common';
import {
  CAROUSEL_REPOSITORY,
  ICarouselRepository,
} from '../../domain/repository.port';

@Injectable()
export class GetAllCarouselDatatableUseCase {
  constructor(
    @Inject(CAROUSEL_REPOSITORY)
    private readonly carouselRepo: ICarouselRepository,
  ) {}

  async execute(query: DatatableQuery) {
    return this.carouselRepo.getAllCarouselDatatable(query);
  }
}
