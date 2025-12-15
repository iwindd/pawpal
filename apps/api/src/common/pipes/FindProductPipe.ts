import { DatatableUtil } from '@/utils/datatable';
import { Injectable, PipeTransform } from '@nestjs/common';
import { DatatableQuerySchema } from '@pawpal/shared';
import { DatatableQuery } from './DatatablePipe';

export type FindProductQuery = DatatableQuery;
@Injectable()
export class FindProductPipe implements PipeTransform {
  constructor() {}

  async transform(value: any) {
    const parsed = DatatableQuerySchema.parse(value);

    return {
      skip: (parsed.page - 1) * parsed.limit,
      take: parsed.limit,
      orderBy: DatatableUtil.buildOrderBy(parsed.sort),
      ...parsed,
    };
  }
}
