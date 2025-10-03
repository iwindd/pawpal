import { BadRequestException, PipeTransform } from '@nestjs/common';
import { ZodType } from '@pawpal/shared';

export class ZodFileValidationPipe implements PipeTransform {
  constructor(private readonly schema: ZodType) {}

  transform(value: Express.Multer.File) {
    const parsed = this.schema.safeParse(value);
    if (!parsed.success) {
      throw new BadRequestException('validation_failed');
    }
    return value;
  }
}
