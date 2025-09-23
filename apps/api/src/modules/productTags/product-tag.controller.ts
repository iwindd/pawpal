import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { SessionAuthGuard } from '@/common/guards/session-auth.guard';
import { Controller, Get, UseGuards } from '@nestjs/common';
import { ProductTagService } from './product-tag.service';

@Controller('product-tag')
@UseGuards(SessionAuthGuard, JwtAuthGuard)
export class ProductTagController {
  constructor(private readonly productTagService: ProductTagService) {}

  @Get('admin/test')
  test(): { message: string; status: string } {
    return {
      message: 'Product tag service is working correctly',
      status: 'success',
    };
  }
}
