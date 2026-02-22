import { Module } from '@nestjs/common';
import { tagProviders } from './infrastructure/tag.providers';
import { TagController } from './presentation/tag.controller';

@Module({
  controllers: [TagController],
  providers: [...tagProviders],
})
export class TagModule {}
