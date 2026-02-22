import { Inject, Injectable } from '@nestjs/common';
import { FieldInput, Session } from '@pawpal/shared';
import {
  FIELD_REPOSITORY,
  IFieldRepository,
} from '../../domain/repository.port';

@Injectable()
export class CreateProductFieldUseCase {
  constructor(
    @Inject(FIELD_REPOSITORY) private readonly fieldRepo: IFieldRepository,
  ) {}

  async execute(productId: string, payload: FieldInput, user: Session) {
    return this.fieldRepo.createProductField(productId, payload, user);
  }
}
