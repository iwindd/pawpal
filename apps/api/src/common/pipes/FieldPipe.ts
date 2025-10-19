import { Injectable, PipeTransform } from '@nestjs/common';
import { FieldSchema } from '@pawpal/shared';

@Injectable()
export class FieldPipe implements PipeTransform {
  private readonly baseSchema = FieldSchema;
  constructor() {}

  async transform(value: any) {
    const parsed = this.baseSchema.parse(value);

    //TODO:: Add validate products existence here

    return parsed;
  }
}
