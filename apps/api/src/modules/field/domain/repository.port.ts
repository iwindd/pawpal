import { DatatableQuery } from '@/common/pipes/DatatablePipe';
import { FieldInput, FieldReorderInput, Session } from '@pawpal/shared';

export const FIELD_REPOSITORY = Symbol('FIELD_REPOSITORY');

export interface IFieldRepository {
  createProductField(
    productId: string,
    payload: FieldInput,
    user: Session,
  ): Promise<any>;

  update(id: string, payload: FieldInput): Promise<any>;
  getProductFieldDatatable(
    productId: string,
    query: DatatableQuery,
  ): Promise<any>;
  reorderProductField(
    productId: string,
    payload: FieldReorderInput,
  ): Promise<void>;
  bulkUpdateFields(
    productId: string,
    payload: any,
    user: Session,
  ): Promise<any>;
}
