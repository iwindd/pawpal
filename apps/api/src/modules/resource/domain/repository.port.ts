import { DatatableQuery } from '@/common/pipes/DatatablePipe';
import { AdminResourceResponse } from '@pawpal/shared';

export const RESOURCE_REPOSITORY = Symbol('RESOURCE_REPOSITORY');

export interface IResourceRepository {
  findOne(id: string): Promise<AdminResourceResponse>;
  getAllResourceDatatable(
    query: DatatableQuery,
  ): Promise<{ data: AdminResourceResponse[]; total: number }>;
  createResource(key: string, userId: string): Promise<AdminResourceResponse>;
  createResourceImage(
    key: string,
    userId: string,
  ): Promise<AdminResourceResponse>;
  findResourceForCopy(
    resourceId: string,
  ): Promise<{ id: string; url: string } | null>;
}
