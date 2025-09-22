import { Module } from '@nestjs/common';
import { ProductTagUpdaterService } from './product-tag-updater.service';
import { ProductTagController } from './product-tag.controller';
import { ProductTagService } from './product-tag.service';

@Module({
  exports: [ProductTagService],
  controllers: [ProductTagController],
  providers: [ProductTagService, ProductTagUpdaterService],
})
export class ProductTagModule {}
