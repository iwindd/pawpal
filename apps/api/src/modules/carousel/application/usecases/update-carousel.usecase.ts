import { Inject, Injectable } from '@nestjs/common';
import { CarouselInput } from '@pawpal/shared';
import {
  CAROUSEL_REPOSITORY,
  ICarouselRepository,
} from '../../domain/repository.port';

@Injectable()
export class UpdateCarouselUseCase {
  constructor(
    @Inject(CAROUSEL_REPOSITORY)
    private readonly carouselRepo: ICarouselRepository,
  ) {}

  async execute(id: string, payload: CarouselInput) {
    return this.carouselRepo.update(id, payload);
  }
}
