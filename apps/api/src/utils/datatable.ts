import { DatatableSortParsed } from '@pawpal/shared';

export type SearchMode = 'insensitive' | 'default';
export class DatatableUtil {
  /**
   * Build search or from search and fields
   * @param search search string
   * @param fields fields to search
   * @returns search or
   */
  static buildPrismaSearchOr(
    search: string,
    fields: Record<string, SearchMode>,
  ) {
    return Object.entries(fields).map(([path, mode]) => {
      const keys = path.split('.');

      return keys.reverse().reduce<any>((acc, key) => ({ [key]: acc }), {
        contains: search,
        ...(mode === 'insensitive' ? { mode: 'insensitive' } : {}),
      });
    });
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
