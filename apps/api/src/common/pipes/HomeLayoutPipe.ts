import { Injectable, PipeTransform } from '@nestjs/common';
import { homeLayoutSchema } from '@pawpal/shared';

@Injectable()
export class HomeLayoutPipe implements PipeTransform {
  transform(value: any) {
    return homeLayoutSchema.parse(value);
  }
}
