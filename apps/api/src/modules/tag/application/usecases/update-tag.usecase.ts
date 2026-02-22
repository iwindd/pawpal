import { Inject, Injectable } from '@nestjs/common';
import { UpdateTagInput } from '@pawpal/shared';
import { ITagRepository, TAG_REPOSITORY } from '../../domain/repository.port';

@Injectable()
export class UpdateTagUseCase {
  constructor(
    @Inject(TAG_REPOSITORY) private readonly tagRepo: ITagRepository,
  ) {}

  async execute(id: string, payload: UpdateTagInput) {
    return this.tagRepo.update(id, payload);
  }
}
