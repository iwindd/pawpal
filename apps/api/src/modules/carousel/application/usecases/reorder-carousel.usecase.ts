import { Inject, Injectable } from '@nestjs/common';
import { CarouselReorderInput } from '@pawpal/shared';
import {
  CAROUSEL_REPOSITORY,
  ICarouselRepository,
} from '../../domain/repository.port';

@Injectable()
export class ReorderCarouselUseCase {
  constructor(
    @Inject(CAROUSEL_REPOSITORY)
    private readonly carouselRepo: ICarouselRepository,
  ) {}

  async execute(payload: CarouselReorderInput) {
    return this.carouselRepo.reorder(payload);
  }
}
