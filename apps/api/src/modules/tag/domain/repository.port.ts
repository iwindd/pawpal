import { DatatableQuery } from '@/common/pipes/DatatablePipe';
import { CreateTagInput, UpdateTagInput } from '@pawpal/shared';

export const TAG_REPOSITORY = Symbol('TAG_REPOSITORY');

export interface ITagRepository {
  createTag(payload: CreateTagInput): Promise<any>;
  getTagDatatable(query: DatatableQuery): Promise<any>;
  getProductsInTagDatatable(id: string, query: DatatableQuery): Promise<any>;
  findOneById(id: string): Promise<any>;
  update(id: string, payload: UpdateTagInput): Promise<any>;
}
