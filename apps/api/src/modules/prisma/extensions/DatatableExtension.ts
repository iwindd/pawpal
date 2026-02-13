import { DatatableQuery } from '@/common/pipes/DatatablePipe';
import { Prisma } from '@/generated/prisma/client';
import { DatatableUtil } from '@/utils/datatable';
import { Logger } from '@nestjs/common';

const logger = new Logger('test');

export const DatatableExtension = Prisma.defineExtension((client) => {
  return client.$extends({
    name: 'datatable',
    model: {
      $allModels: {
        async getDatatable<
          T,
          S extends Prisma.Args<T, 'findMany'>['select'] | undefined,
        >(
          this: T,
          args: {
            select: S;
            searchable?: Prisma.Args<T, 'findMany'>['where'];
            where?: Prisma.Args<T, 'findMany'>['where'];
            query?: Pick<
              DatatableQuery,
              'search' | 'skip' | 'take' | 'orderBy'
            >;
          },
        ) {
          const context = Prisma.getExtensionContext(this) as any;
          const { select, searchable, query } = args;

          const where: Prisma.Args<T, 'findMany'>['where'] = { AND: [] };

          if (searchable && query?.search) {
            where.OR = DatatableUtil.buildPrismaSearchOr(
              query.search,
              searchable,
            );
          }

          if (args?.where) {
            where.AND.push(args.where);
          }

          const data = await context.findMany({
            where,
            skip: query?.skip,
            take: query?.take,
            orderBy: query.orderBy,
            select,
          });

          const count = await context.count({
            where: {
              AND: where.AND,
              OR: where.OR,
            },
          });

          return { data, total: count };
        },
      },
    },
  });
});
