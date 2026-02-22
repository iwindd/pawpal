import { Module } from '@nestjs/common';
import { categoryProviders } from './infrastructure/category.providers';
import { CategoryController } from './presentation/category.controller';

@Module({
  controllers: [CategoryController],
  providers: [...categoryProviders],
})
export class CategoryModule {}
