import { Module } from '@nestjs/common';
import { ProductTagController } from './product-tag.controller';
import { ProductTagService } from './product-tag.service';

@Module({
  exports: [ProductTagService],
  controllers: [ProductTagController],
  providers: [ProductTagService],
})
export class ProductTagModule {}
