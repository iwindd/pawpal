import { DatatableQuery } from '@/common/pipes/DatatablePipe';
import { PackageBulkInput, PackageInput } from '@pawpal/shared';

export const PACKAGE_REPOSITORY = Symbol('PACKAGE_REPOSITORY');

export interface IPackageRepository {
  getFields(packageId: string): Promise<any>;
  getProductPackageDatatable(
    productId: string,
    query: DatatableQuery,
  ): Promise<any>;
  createPackageForProduct(
    productId: string,
    payload: PackageInput,
  ): Promise<any>;
  update(packageId: string, payload: PackageInput): Promise<any>;
  bulkUpdatePackages(
    productId: string,
    payload: PackageBulkInput,
  ): Promise<any>;
}
