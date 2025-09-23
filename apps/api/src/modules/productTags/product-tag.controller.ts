import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { SessionAuthGuard } from '@/common/guards/session-auth.guard';
import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ProductTags } from '@pawpal/prisma';
import { ProductTagResponse } from '@pawpal/shared';
import { ProductTagService } from './product-tag.service';

@Controller('product-tag')
@UseGuards(SessionAuthGuard, JwtAuthGuard)
export class ProductTagController {
  constructor(private readonly productTagService: ProductTagService) {}

  @Get(':tag')
  async getProductByTag(@Param('tag') tag: string): Promise<ProductTags> {
    return this.productTagService.getProductByTag(tag);
  }

  @Get()
  async getProductByTags(
    @Query('tags') tags: string | string[],
  ): Promise<ProductTagResponse[]> {
    return this.productTagService.getProductByTags(tags);
  }
}
