import { DatatableQuery } from '@/common/pipes/DatatablePipe';
import { Prisma } from '@/generated/prisma/client';
import { DatatableUtil, SearchMode } from '@/utils/datatable';

type AnyPrismaDelegate = {
  findMany(args?: any): Promise<any[]>;
  count(args?: any): Promise<number | any>;
};

export const DatatableExtension = Prisma.defineExtension((client) => {
  return client.$extends({
    name: 'datatable',
    model: {
      $allModels: {
        async getDatatable<
          TDelegate extends AnyPrismaDelegate,
          TSelect extends Record<string, any>,
        >(
          this: TDelegate,
          args: {
            select: TSelect;
            search?: Record<string, SearchMode>;
            query?: {
              where?: any;
            } & Pick<DatatableQuery, 'search' | 'skip' | 'take' | 'orderBy'>;
          },
        ) {
          const { select, search, query } = args;

          const where: any = { AND: [] };

          if (search && query?.search) {
            where.OR = DatatableUtil.buildPrismaSearchOr(query.search, search);
          }

          if (query?.where) {
            where.AND.push(query.where);
          }

          const data = await this.findMany({
            where,
            skip: query?.skip,
            take: query?.take,
            orderBy: query.orderBy,
            select,
          });

          const count = await this.count({
            where: {
              AND: where.AND,
            },
          });

          return { data, total: count };
        },
      },
    },
  });
});
