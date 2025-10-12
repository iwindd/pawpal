import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { SessionAuthGuard } from '@/common/guards/session-auth.guard';
import { Controller, Get, UseGuards } from '@nestjs/common';
import { CarouselService } from './carousel.service';

@Controller('carousel')
@UseGuards(SessionAuthGuard, JwtAuthGuard)
export class CarouselController {
  constructor(private readonly carouselService: CarouselService) {}

  @Get()
  async findAllPublished() {
    return await this.carouselService.findAllPublished();
  }
}
