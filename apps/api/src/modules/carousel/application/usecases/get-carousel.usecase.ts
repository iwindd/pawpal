import { Inject, Injectable } from '@nestjs/common';
import {
  CAROUSEL_REPOSITORY,
  ICarouselRepository,
} from '../../domain/repository.port';

@Injectable()
export class GetCarouselUseCase {
  constructor(
    @Inject(CAROUSEL_REPOSITORY)
    private readonly carouselRepo: ICarouselRepository,
  ) {}

  async execute(id: string) {
    return this.carouselRepo.findOne(id);
  }
}
