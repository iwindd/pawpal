import { DatatableQuery } from '@/common/pipes/DatatablePipe';
import { HomeLayout, Prisma } from '@/generated/prisma/client';
import { DatatableResponse } from '@pawpal/shared';

export const I_HOME_LAYOUT_REPOSITORY = 'I_HOME_LAYOUT_REPOSITORY';

export interface IHomeLayoutRepository {
  create(data: Prisma.HomeLayoutCreateInput): Promise<HomeLayout>;
  getById(id: string): Promise<HomeLayout | null>;
  getPublished(): Promise<HomeLayout | null>;
  archiveAllPublished(excludeId?: string): Promise<void>;
  getDatatable(query: DatatableQuery): Promise<DatatableResponse<HomeLayout>>;
}
