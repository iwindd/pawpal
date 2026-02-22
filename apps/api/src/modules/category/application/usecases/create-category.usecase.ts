import { Inject, Injectable } from '@nestjs/common';
import { CategoryInput } from '@pawpal/shared';
import {
  CATEGORY_REPOSITORY,
  ICategoryRepository,
} from '../../domain/repository.port';

@Injectable()
export class CreateCategoryUseCase {
  constructor(
    @Inject(CATEGORY_REPOSITORY)
    private readonly categoryRepo: ICategoryRepository,
  ) {}

  async execute(data: CategoryInput) {
    return this.categoryRepo.create(data);
  }
}
