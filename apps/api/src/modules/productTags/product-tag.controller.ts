import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { SessionAuthGuard } from '@/common/guards/session-auth.guard';
import { Controller, UseGuards } from '@nestjs/common';
import { ProductTagService } from './product-tag.service';

@Controller('product-tag')
@UseGuards(SessionAuthGuard, JwtAuthGuard)
export class ProductTagController {
  constructor(private readonly productTagService: ProductTagService) {}
}
