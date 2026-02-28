import { DatatableQuery } from '@/common/pipes/DatatablePipe';
import { ProductInput } from '@pawpal/shared';

export const PRODUCT_REPOSITORY = Symbol('PRODUCT_REPOSITORY');

export interface IProductRepository {
  getLatest(take?: number): Promise<any[]>;
  getHasSale(take?: number): Promise<any[]>;
  getProductBySlug(slug: string): Promise<any>;
  getAllProductDatatable(
    query: DatatableQuery,
    filterCategory?: string,
  ): Promise<any>;
  getSaleProductDatatable(query: DatatableQuery): Promise<any>;
  getProductDatatable(query: DatatableQuery): Promise<any>;
  findOne(id: string): Promise<any>;
  createProduct(payload: any, userId: string): Promise<any>;
  updateProduct(
    id: string,
    payload: ProductInput,
    userId: string,
  ): Promise<any>;
  updateProductStock(id: string, payload: any, userId: string): Promise<any>;
  getProductStock(id: string): Promise<any>;
  getProductStockMovementsDatatable(
    id: string,
    query: DatatableQuery,
  ): Promise<any>;
}
