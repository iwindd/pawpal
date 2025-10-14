import { Controller, Get } from '@nestjs/common';
import { CarouselService } from './carousel.service';

@Controller('carousel')
export class CarouselController {
  constructor(private readonly carouselService: CarouselService) {}

  @Get()
  async findAllPublished() {
    return await this.carouselService.findAllPublished();
  }
}
