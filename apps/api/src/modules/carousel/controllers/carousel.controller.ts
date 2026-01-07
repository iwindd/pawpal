import { Controller, Get } from '@nestjs/common';
import { CarouselService } from '../carousel.service';

@Controller('carousel')
export class CarouselController {
  constructor(private readonly carouselService: CarouselService) {}

  @Get()
  async getPublishedCarouselDatatable() {
    return await this.carouselService.getPublishedCarouselDatatable();
  }
}
