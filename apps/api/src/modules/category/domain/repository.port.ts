import { DatatableQuery } from '@/common/pipes/DatatablePipe';
import {
  CategoryInput,
  CategoryResponse,
  CategoryUpdateInput,
  DatatableResponse,
} from '@pawpal/shared';

export const CATEGORY_REPOSITORY = Symbol('CATEGORY_REPOSITORY');

export interface ICategoryRepository {
  findAll(query: DatatableQuery): Promise<DatatableResponse<CategoryResponse>>;
  findOne(id: string): Promise<CategoryResponse>;
  create(data: CategoryInput): Promise<CategoryResponse>;
  update(id: string, data: CategoryUpdateInput): Promise<CategoryResponse>;
  remove(id: string): Promise<{ success: boolean }>;
  getProductsInCategoryDatatable(
    id: string,
    query: DatatableQuery,
  ): Promise<any>;
}
