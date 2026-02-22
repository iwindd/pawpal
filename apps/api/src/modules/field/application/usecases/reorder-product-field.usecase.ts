import { Inject, Injectable } from '@nestjs/common';
import { FieldReorderInput } from '@pawpal/shared';
import {
  FIELD_REPOSITORY,
  IFieldRepository,
} from '../../domain/repository.port';

@Injectable()
export class ReorderProductFieldUseCase {
  constructor(
    @Inject(FIELD_REPOSITORY) private readonly fieldRepo: IFieldRepository,
  ) {}

  async execute(productId: string, payload: FieldReorderInput) {
    return this.fieldRepo.reorderProductField(productId, payload);
  }
}
