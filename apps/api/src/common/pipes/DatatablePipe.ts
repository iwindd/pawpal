import { DatatableUtil } from '@/utils/datatable';
import { Injectable, Logger, PipeTransform } from '@nestjs/common';
import { DatatableQuerySchema } from '@pawpal/shared';

export interface DatatableQuery {
  skip: number;
  take: number;
  orderBy: any;
  search?: string;
  filter?: string;
}

@Injectable()
export class DatatablePipe implements PipeTransform {
  private readonly logger = new Logger(DatatablePipe.name);
  constructor() {}

  async transform(value: any) {
    const sourceSort: any = value && value.sort;
    const parsed = DatatableQuerySchema.parse(value);
    const result = {
      skip: (parsed.page - 1) * parsed.limit,
      take: parsed.limit,
      orderBy:
        sourceSort == 'null'
          ? undefined
          : DatatableUtil.buildOrderBy(parsed.sort),
      ...parsed,
    };

    this.logger.debug(
      `Parsed: ${JSON.stringify(parsed)} to ${JSON.stringify(result)}`,
    );

    return result;
  }
}
