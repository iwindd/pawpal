import { AuthUser } from '@/common/decorators/user.decorator';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { SessionAuthGuard } from '@/common/guards/session-auth.guard';
import { ZodValidationPipe } from '@/common/ZodValidationPipe';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import {
  CarouselInput,
  CarouselReorderInput,
  carouselReorderSchema,
  CarouselResponse,
  DatatableQueryDto,
  DatatableQuerySchema,
  DatatableResponse,
  Session,
} from '@pawpal/shared';
import { CarouselService } from './carousel.service';

@Controller('admin/carousel')
@UseGuards(SessionAuthGuard, JwtAuthGuard)
export class AdminCarouselController {
  constructor(private readonly carouselService: CarouselService) {}

  @Post()
  async create(
    @Body() payload: CarouselInput,
    @AuthUser() user: Session,
  ): Promise<CarouselResponse> {
    return await this.carouselService.create(payload, user);
  }

  @Get()
  @UsePipes(new ZodValidationPipe(DatatableQuerySchema))
  async get(
    @Query() params: DatatableQueryDto,
  ): Promise<DatatableResponse<CarouselResponse>> {
    return await this.carouselService.findAll(params);
  }

  @Get('published')
  @UsePipes(new ZodValidationPipe(DatatableQuerySchema))
  async getPublished(): Promise<DatatableResponse<CarouselResponse>> {
    return await this.carouselService.getPublished();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.carouselService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() payload: CarouselInput) {
    return this.carouselService.update(id, payload);
  }

  @Post('reorder')
  @HttpCode(200)
  async reorder(
    @Body(new ZodValidationPipe(carouselReorderSchema))
    payload: CarouselReorderInput,
  ): Promise<void> {
    return await this.carouselService.reorder(payload);
  }
}
