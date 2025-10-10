import { Module } from '@nestjs/common';
import { AdminCarouselController } from './admin-carousel.controller';
import { CarouselService } from './carousel.service';

@Module({
  controllers: [AdminCarouselController],
  providers: [CarouselService],
})
export class CarouselModule {}
