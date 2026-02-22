import { Inject, Injectable } from '@nestjs/common';
import { FieldInput } from '@pawpal/shared';
import {
  FIELD_REPOSITORY,
  IFieldRepository,
} from '../../domain/repository.port';

@Injectable()
export class UpdateFieldUseCase {
  constructor(
    @Inject(FIELD_REPOSITORY) private readonly fieldRepo: IFieldRepository,
  ) {}

  async execute(id: string, payload: FieldInput) {
    return this.fieldRepo.update(id, payload);
  }
}
