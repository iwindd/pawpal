// prisma.extension.ts
import { Prisma } from '@/generated/prisma/client';
import { Logger } from '@nestjs/common';
import { performance } from 'node:perf_hooks';
import * as util from 'node:util';

const logger = new Logger('PrismaService');

// Extension for logging model
// @see https://github.com/prisma/prisma-client-extensions/blob/4a18f3bf1f5457f7b627d6a4d1850408625bcb8c/query-logging/script.ts#L5
export const loggingModelExtension = Prisma.defineExtension({
  name: 'logging',
  query: {
    $allModels: {
      async $allOperations({ operation, model, args, query }) {
        logger.log(
          `Running ${model}.${operation} with args ${util.inspect(args)}`,
        );
        const start = performance.now();
        const result = await query(args);
        const end = performance.now();
        const time = (end - start).toFixed(2);
        const length = getResultLength(result);
        logger.log(
          `Completed ${model}.${operation} in ${time}ms. Found ${length} result(s).`,
        );
        return result;
      },
    },
  },
});

function getResultLength(result: any): number {
  if (Array.isArray(result)) {
    return result.length;
  }

  if (result === null || result === undefined) {
    return 0;
  }

  if (typeof result === 'number') {
    return result;
  }

  if (typeof result === 'object') {
    // Aggregate (e.g. sum, avg, _count, etc.)
    if (Object.keys(result).length === 0) return 0;

    // Count object with _count field
    if ('_count' in result && typeof result._count === 'number') {
      return result._count;
    }

    // Handle groupBy: array of objects
    if (Array.isArray(result)) {
      return result.length;
    }

    // Fallback: assume single object
    return 1;
  }

  return 0; // Default fallback
}
