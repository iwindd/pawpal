import { DatatableUtil } from '@/utils/datatable';
import { Injectable, PipeTransform } from '@nestjs/common';
import { ProductDatatableQuerySchema, ProductType } from '@pawpal/shared';

export interface FindProductFiltersQuery {
  skip: number;
  take: number;
  orderBy: any;
  search?: string;
  filter?: string;
  types?: ProductType[];
  platforms?: string[];
  categories?: string[];
  tags?: string[];
}

@Injectable()
export class FindProductFiltersPipe implements PipeTransform {
  async transform(value: any): Promise<FindProductFiltersQuery> {
    const sourceSort: any = value && value.sort;
    const parsed = ProductDatatableQuerySchema.parse(value);

    return {
      skip: (parsed.page - 1) * parsed.limit,
      take: parsed.limit,
      orderBy:
        sourceSort == 'null'
          ? undefined
          : DatatableUtil.buildOrderBy(parsed.sort),
      search: parsed.search,
      filter: parsed.filter,
      types: parsed.types as ProductType[] | undefined,
      platforms: parsed.platforms,
      categories: parsed.categories,
      tags: parsed.tags,
    };
  }
}
