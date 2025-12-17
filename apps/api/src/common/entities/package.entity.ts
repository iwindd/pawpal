import { Prisma } from '@/generated/prisma/client';
import { PackageRepository } from '@/modules/package/package.repository';

export type PackageEntityProps = Prisma.PackageGetPayload<{
  select: typeof PackageEntity.SELECT;
}>;

export class PackageEntity {
  constructor(
    private readonly productPackage: PackageEntityProps,
    private readonly repo: PackageRepository,
  ) {}

  static get SELECT() {
    return {
      id: true,
    } satisfies Prisma.PackageSelect;
  }

  get id() {
    return this.productPackage.id;
  }
}
