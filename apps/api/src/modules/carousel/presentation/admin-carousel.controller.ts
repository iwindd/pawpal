import { Permissions } from '@/common/decorators/permissions.decorator';
import { AuthUser } from '@/common/decorators/user.decorator';
import { JwtAuthGuard } from '@/common/guards/auth/jwt-auth.guard';
import { SessionAuthGuard } from '@/common/guards/auth/session-auth.guard';
import { PermissionGuard } from '@/common/guards/permission.guard';
import { DatatablePipe, DatatableQuery } from '@/common/pipes/DatatablePipe';
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
} from '@nestjs/common';
import {
  CarouselInput,
  CarouselReorderInput,
  carouselReorderSchema,
  CarouselResponse,
  PermissionEnum,
  Session,
} from '@pawpal/shared';

import { CreateCarouselUseCase } from '../application/usecases/create-carousel.usecase';
import { GetAllCarouselDatatableUseCase } from '../application/usecases/get-all-carousel-datatable.usecase';
import { GetCarouselUseCase } from '../application/usecases/get-carousel.usecase';
import { GetPublishedCarouselDatatableUseCase } from '../application/usecases/get-published-carousel-datatable.usecase';
import { ReorderCarouselUseCase } from '../application/usecases/reorder-carousel.usecase';
import { UpdateCarouselUseCase } from '../application/usecases/update-carousel.usecase';

@Controller('admin/carousel')
@UseGuards(SessionAuthGuard, JwtAuthGuard, PermissionGuard)
@Permissions(PermissionEnum.CarouselManagement)
export class AdminCarouselController {
  constructor(
    private readonly createCarousel: CreateCarouselUseCase,
    private readonly getAllCarouselDatatable: GetAllCarouselDatatableUseCase,
    private readonly getPublishedCarouselDatatable: GetPublishedCarouselDatatableUseCase,
    private readonly getCarousel: GetCarouselUseCase,
    private readonly updateCarousel: UpdateCarouselUseCase,
    private readonly reorderCarousel: ReorderCarouselUseCase,
  ) {}

  @Post()
  async create(
    @Body() payload: CarouselInput,
    @AuthUser() user: Session,
  ): Promise<CarouselResponse> {
    return this.createCarousel.execute(payload, user);
  }

  @Get()
  async getDatatable(@Query(DatatablePipe) query: DatatableQuery) {
    return this.getAllCarouselDatatable.execute(query);
  }

  @Get('published')
  async getPublished() {
    return this.getPublishedCarouselDatatable.execute();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.getCarousel.execute(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() payload: CarouselInput) {
    return this.updateCarousel.execute(id, payload);
  }

  @Post('reorder')
  @HttpCode(200)
  async reorder(
    @Body(new ZodValidationPipe(carouselReorderSchema))
    payload: CarouselReorderInput,
  ): Promise<void> {
    return this.reorderCarousel.execute(payload);
  }
}
