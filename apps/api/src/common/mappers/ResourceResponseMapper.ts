import { Prisma } from '@/generated/prisma/client';
import { AdminResourceResponse } from '@pawpal/shared';

export class ResourceResponseMapper {
  static get SELECT() {
    return {
      id: true,
      url: true,
      createdAt: true,
      type: true,
      user: {
        select: {
          id: true,
          displayName: true,
        },
      },
    } satisfies Prisma.ResourceSelect;
  }

  static fromQuery(
    resource: Prisma.ResourceGetPayload<{
      select: typeof ResourceResponseMapper.SELECT;
    }>,
  ): AdminResourceResponse {
    return {
      id: resource.id,
      url: resource.url,
      createdAt: resource.createdAt.toISOString(),
      type: resource.type,
      user: resource.user,
    };
  }
}
