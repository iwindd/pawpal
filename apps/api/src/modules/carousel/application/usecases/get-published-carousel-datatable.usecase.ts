import { Inject, Injectable } from '@nestjs/common';
import {
  CAROUSEL_REPOSITORY,
  ICarouselRepository,
} from '../../domain/repository.port';

@Injectable()
export class GetPublishedCarouselDatatableUseCase {
  constructor(
    @Inject(CAROUSEL_REPOSITORY)
    private readonly carouselRepo: ICarouselRepository,
  ) {}

  async execute() {
    return this.carouselRepo.getPublishedCarouselDatatable();
  }
}
