import { Prisma } from '@/generated/prisma/client';
import { Logger } from '@nestjs/common';
import { DatatableSortParsed } from '@pawpal/shared';

export type SearchMode = 'insensitive' | 'default';

const logger = new Logger('DatatableUtil');

type SearchLeaf = {
  mode?: Prisma.QueryMode;
};

type SearchableConfig = Record<string, any>;

export class DatatableUtil {
  /**
   * Build search condition for prisma
   * @param keyword keyword to search
   * @param searchable searchable config
   * @returns search condition
   */
  static buildPrismaSearchOr(
    keyword: string,
    searchable: SearchableConfig,
  ): any[] {
    if (!keyword) return [];

    const results: any[] = [];

    const walk = (node: any, path: string[] = []) => {
      for (const [key, value] of Object.entries(node)) {
        // leaf: { mode: 'insensitive' }
        if (DatatableUtil.isSearchLeaf(value)) {
          results.push(
            DatatableUtil.buildCondition([...path, key], keyword, value),
          );
          continue;
        }

        if (typeof value === 'object' && value !== null) {
          walk(value, [...path, key]);
        }
      }
    };

    walk(searchable);

    return results;
  }

  private static isSearchLeaf(value: any): value is SearchLeaf {
    return typeof value === 'object' && value !== null && 'mode' in value;
  }

  private static buildCondition(
    path: string[],
    keyword: string,
    config: SearchLeaf,
  ) {
    return path.reduceRight((acc, key) => {
      if (acc === null) {
        return {
          [key]: {
            contains: keyword,
            ...(config.mode && { mode: config.mode }),
          },
        };
      }

      return { [key]: acc };
    }, null as any);
  }

  /**
   * Build order by from sort
   * @param sort sort object
   * @returns order by object
   */
  static buildOrderBy(sort: DatatableSortParsed | null) {
    if (sort == null) return undefined;
    if (!sort?.columnAccessor || !sort?.direction) {
      return { createdAt: 'desc' }; // default
    }

    const fields = sort.columnAccessor.split('.');

    return fields.reverse().reduce((acc, field, i) => {
      if (i === 0) {
        return { [field]: sort.direction };
      }
      return { [field]: acc };
    }, {});
  }
}
