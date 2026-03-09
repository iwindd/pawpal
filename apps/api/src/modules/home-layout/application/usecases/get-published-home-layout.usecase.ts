import { Inject, Injectable } from '@nestjs/common';
import {
  IHomeLayoutRepository,
  I_HOME_LAYOUT_REPOSITORY,
} from '../../domain/repository.port';

@Injectable()
export class GetPublishedHomeLayoutUseCase {
  constructor(
    @Inject(I_HOME_LAYOUT_REPOSITORY)
    private readonly repository: IHomeLayoutRepository,
  ) {}

  async execute() {
    return await this.repository.getPublished();
  }
}
