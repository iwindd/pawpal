import { Inject, Injectable } from '@nestjs/common';
import { ITagRepository, TAG_REPOSITORY } from '../../domain/repository.port';

@Injectable()
export class GetTagUseCase {
  constructor(
    @Inject(TAG_REPOSITORY) private readonly tagRepo: ITagRepository,
  ) {}

  async execute(id: string) {
    return this.tagRepo.findOneById(id);
  }
}
