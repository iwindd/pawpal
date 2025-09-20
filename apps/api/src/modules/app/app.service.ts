import utils from '@/utils/utils';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return utils.getHello();
  }
}
