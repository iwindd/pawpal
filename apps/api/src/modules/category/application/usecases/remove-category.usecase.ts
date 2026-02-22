import { Inject, Injectable } from '@nestjs/common';
import {
  CATEGORY_REPOSITORY,
  ICategoryRepository,
} from '../../domain/repository.port';

@Injectable()
export class RemoveCategoryUseCase {
  constructor(
    @Inject(CATEGORY_REPOSITORY)
    private readonly categoryRepo: ICategoryRepository,
  ) {}

  async execute(id: string) {
    return this.categoryRepo.remove(id);
  }
}
