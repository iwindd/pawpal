import { Inject, Injectable } from '@nestjs/common';
import { CreateTagInput } from '@pawpal/shared';
import { ITagRepository, TAG_REPOSITORY } from '../../domain/repository.port';

@Injectable()
export class CreateTagUseCase {
  constructor(
    @Inject(TAG_REPOSITORY) private readonly tagRepo: ITagRepository,
  ) {}

  async execute(payload: CreateTagInput) {
    return this.tagRepo.createTag(payload);
  }
}
