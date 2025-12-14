import { DatatableUtil } from '@/utils/datatable';
import { Injectable, PipeTransform } from '@nestjs/common';
import { DatatableInput, DatatableQuerySchema } from '@pawpal/shared';

export interface DatatableQuery extends DatatableInput {
  skip: number;
  take: number;
  orderBy: any;
}

@Injectable()
export class DatatablePipe implements PipeTransform {
  constructor() {}

  async transform(value: any) {
    const sourceSort: any = value && value.sort;
    const parsed = DatatableQuerySchema.parse(value);

    return {
      skip: (parsed.page - 1) * parsed.limit,
      take: parsed.limit,
      orderBy:
        sourceSort == 'null'
          ? undefined
          : DatatableUtil.buildOrderBy(parsed.sort),
      ...parsed,
    };
  }
}
