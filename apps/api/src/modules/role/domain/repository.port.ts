import { DatatableQuery } from '@/common/pipes/DatatablePipe';
import { RoleInput } from '@pawpal/shared';

export const ROLE_REPOSITORY = Symbol('ROLE_REPOSITORY');

export interface IRoleRepository {
  getDatatable(query: DatatableQuery): Promise<any>;
  findOne(id: string): Promise<any>;
  getPermissions(): Promise<any>;
  create(payload: RoleInput): Promise<any>;
  update(id: string, payload: RoleInput): Promise<any>;
  remove(id: string): Promise<any>;
}
