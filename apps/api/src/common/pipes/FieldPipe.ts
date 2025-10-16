import { Injectable, PipeTransform } from '@nestjs/common';
import { FieldSchema, FieldSelectMetadataSchema } from '@pawpal/shared';

@Injectable()
export class FieldPipe implements PipeTransform {
  private readonly baseSchema = FieldSchema;
  constructor() {}

  async transform(value: any) {
    const parsed = this.baseSchema.parse(value);

    if (parsed.type === 'SELECT') {
      return this.baseSchema
        .extend({
          metadata: FieldSelectMetadataSchema,
        })
        .parse(value);
    }

    return parsed;
  }
}
