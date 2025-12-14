import { DatatableUtil } from '@/utils/datatable';
import { Injectable, PipeTransform } from '@nestjs/common';
import { DatatableInput, DatatableQuerySchema } from '@pawpal/shared';

export interface FindProductQuery extends DatatableInput {
  skip: number;
  take: number;
  orderBy: any;
}

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
