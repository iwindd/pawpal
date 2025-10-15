import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { ZodType } from '@pawpal/shared';

@Injectable()
export class ZodPipe implements PipeTransform {
  constructor(private readonly schema: ZodType) {}

  transform(value: any, metadata: ArgumentMetadata) {
    return this.schema.parse(value);
  }
}
