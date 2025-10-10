import { Body, Controller, Post } from '@nestjs/common';
import { CarouselInput, CarouselResponse } from '@pawpal/shared';
import { CarouselService } from './carousel.service';

@Controller('admin/carousel')
export class AdminCarouselController {
  constructor(private readonly carouselService: CarouselService) {}

  @Post()
  async create(@Body() payload: CarouselInput): Promise<CarouselResponse> {
    return await this.carouselService.create(payload);
  }
}
