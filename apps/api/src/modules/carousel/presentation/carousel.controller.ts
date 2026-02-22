import { Controller, Get } from '@nestjs/common';
import { GetPublishedCarouselDatatableUseCase } from '../application/usecases/get-published-carousel-datatable.usecase';

@Controller('carousel')
export class CarouselController {
  constructor(
    private readonly getPublishedCarouselDatatable: GetPublishedCarouselDatatableUseCase,
  ) {}

  @Get()
  async getPublished() {
    return this.getPublishedCarouselDatatable.execute();
  }
}
