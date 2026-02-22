import { Module } from '@nestjs/common';
import { carouselProviders } from './infrastructure/carousel.providers';
import { AdminCarouselController } from './presentation/admin-carousel.controller';
import { CarouselController } from './presentation/carousel.controller';

@Module({
  controllers: [AdminCarouselController, CarouselController],
  providers: [...carouselProviders],
})
export class CarouselModule {}
