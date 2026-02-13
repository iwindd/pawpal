import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  Logger,
  PipeTransform,
} from '@nestjs/common';
import { ZodType } from '@pawpal/shared';

@Injectable()
export class ZodPipe implements PipeTransform {
  private readonly logger = new Logger(ZodPipe.name);

  constructor(private readonly schema: ZodType) {}

  transform(value: any, metadata: ArgumentMetadata) {
    try {
      return this.schema.parse(value);
    } catch (error: any) {
      this.logger.error(error);
      throw new BadRequestException();
    }
  }
}
