import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  IHomeLayoutRepository,
  I_HOME_LAYOUT_REPOSITORY,
} from '../../domain/repository.port';

@Injectable()
export class GetHomeLayoutUseCase {
  constructor(
    @Inject(I_HOME_LAYOUT_REPOSITORY)
    private readonly repository: IHomeLayoutRepository,
  ) {}

  async execute(id: string) {
    const layout = await this.repository.getById(id);
    if (!layout) {
      throw new NotFoundException('Home Layout not found');
    }
    return layout;
  }
}
