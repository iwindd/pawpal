import { Module } from '@nestjs/common';
import { CarouselService } from './carousel.service';
import { AdminCarouselController } from './controllers/admin-carousel.controller';
import { CarouselController } from './controllers/carousel.controller';

@Module({
  controllers: [AdminCarouselController, CarouselController],
  providers: [CarouselService],
})
export class CarouselModule {}
