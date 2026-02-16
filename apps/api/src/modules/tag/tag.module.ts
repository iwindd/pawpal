import { Module } from '@nestjs/common';
import { TagController } from './tag.controller';
import { TagService } from './tag.service';

@Module({
  exports: [TagService],
  controllers: [TagController],
  providers: [TagService],
})
export class TagModule {}
