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
import { CarouselService } from '../carousel.service';

@Controller('admin/carousel')
@UseGuards(SessionAuthGuard, JwtAuthGuard, PermissionGuard)
@Permissions(PermissionEnum.CarouselManagement)
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
  async getAllCarouselDatatable(@Query(DatatablePipe) query: DatatableQuery) {
    return await this.carouselService.getAllCarouselDatatable(query);
  }

  @Get('published')
  async getPublishedCarousel() {
    return await this.carouselService.getPublishedCarouselDatatable();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.carouselService.findOne(id);
  }

  //TODO:: FIX Validation
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
