import { Prisma } from '@/generated/prisma/client';
import {
  DEFAULT_PACKAGE_SELECT,
  PackageRepository,
} from './package.repository';

export type PackageEntityProps = Prisma.PackageGetPayload<{
  select: typeof DEFAULT_PACKAGE_SELECT;
}>;

export class PackageEntity {
  constructor(
    private readonly productPackage: PackageEntityProps,
    private readonly repo: PackageRepository,
  ) {}

  get id() {
    return this.productPackage.id;
  }
}
