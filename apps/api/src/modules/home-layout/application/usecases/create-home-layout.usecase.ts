import { Inject, Injectable } from '@nestjs/common';
import {
  ENUM_HOME_LAYOUT_STATUS,
  HomeLayoutInput,
  Session,
} from '@pawpal/shared';
import {
  IHomeLayoutRepository,
  I_HOME_LAYOUT_REPOSITORY,
} from '../../domain/repository.port';

@Injectable()
export class CreateHomeLayoutUseCase {
  constructor(
    @Inject(I_HOME_LAYOUT_REPOSITORY)
    private readonly repository: IHomeLayoutRepository,
  ) {}

  async execute(user: Session, data: HomeLayoutInput) {
    if (data.status === ENUM_HOME_LAYOUT_STATUS.PUBLISHED) {
      await this.repository.archiveAllPublished();
    }

    return await this.repository.create({
      name: data.name,
      status: data.status,
      sections: data.sections,
      updater: {
        connect: { id: user.id },
      },
    });
  }
}
