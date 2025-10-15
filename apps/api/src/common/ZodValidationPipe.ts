import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { ZodType } from '@pawpal/shared';

/** @deprecated Use ZodPipe instead */
@Injectable()
export class ZodValidationPipe implements PipeTransform {
  constructor(private readonly schema: ZodType) {}

  transform(value: any) {
    const result = this.schema.safeParse(value);
    if (!result.success) {
      throw new BadRequestException('validation_failed');
    }
    return result.data;
  }
}
