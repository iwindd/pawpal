import { Inject, Injectable } from '@nestjs/common';
import { Session } from '@pawpal/shared';
import {
  FIELD_REPOSITORY,
  IFieldRepository,
} from '../../domain/repository.port';

@Injectable()
export class BulkUpdateFieldsUseCase {
  constructor(
    @Inject(FIELD_REPOSITORY) private readonly fieldRepo: IFieldRepository,
  ) {}

  async execute(productId: string, payload: any, user: Session) {
    return this.fieldRepo.bulkUpdateFields(productId, payload, user);
  }
}
