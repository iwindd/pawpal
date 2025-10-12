import { Module } from '@nestjs/common';
import { AdminCarouselController } from './admin-carousel.controller';
import { CarouselController } from './carousel.controller';
import { CarouselService } from './carousel.service';

@Module({
  controllers: [AdminCarouselController, CarouselController],
  providers: [CarouselService],
})
export class CarouselModule {}
