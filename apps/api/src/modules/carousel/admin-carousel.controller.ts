import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import {
  CarouselInput,
  CarouselResponse,
  DatatableQueryDto,
  DatatableResponse,
} from '@pawpal/shared';
import { CarouselService } from './carousel.service';

@Controller('admin/carousel')
export class AdminCarouselController {
  constructor(private readonly carouselService: CarouselService) {}

  @Post()
  async create(@Body() payload: CarouselInput): Promise<CarouselResponse> {
    return await this.carouselService.create(payload);
  }

  @Get('published')
  async getPublished(
    @Query() params: DatatableQueryDto,
  ): Promise<DatatableResponse<CarouselResponse>> {
    return await this.carouselService.getPublished(params);
  }
}
