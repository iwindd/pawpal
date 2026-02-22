import { Inject, Injectable } from '@nestjs/common';
import { CarouselInput, Session } from '@pawpal/shared';
import {
  CAROUSEL_REPOSITORY,
  ICarouselRepository,
} from '../../domain/repository.port';

@Injectable()
export class CreateCarouselUseCase {
  constructor(
    @Inject(CAROUSEL_REPOSITORY)
    private readonly carouselRepo: ICarouselRepository,
  ) {}

  async execute(payload: CarouselInput, user: Session) {
    return this.carouselRepo.create(payload, user);
  }
}
