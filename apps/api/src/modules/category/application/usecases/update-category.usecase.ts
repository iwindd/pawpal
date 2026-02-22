import { Inject, Injectable } from '@nestjs/common';
import { CategoryUpdateInput } from '@pawpal/shared';
import {
  CATEGORY_REPOSITORY,
  ICategoryRepository,
} from '../../domain/repository.port';

@Injectable()
export class UpdateCategoryUseCase {
  constructor(
    @Inject(CATEGORY_REPOSITORY)
    private readonly categoryRepo: ICategoryRepository,
  ) {}

  async execute(id: string, data: CategoryUpdateInput) {
    return this.categoryRepo.update(id, data);
  }
}
