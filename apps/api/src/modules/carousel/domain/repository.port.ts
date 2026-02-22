import { DatatableQuery } from '@/common/pipes/DatatablePipe';
import {
  CarouselInput,
  CarouselReorderInput,
  CarouselResponse,
  Session,
} from '@pawpal/shared';

export const CAROUSEL_REPOSITORY = Symbol('CAROUSEL_REPOSITORY');

export interface ICarouselRepository {
  create(payload: CarouselInput, user: Session): Promise<CarouselResponse>;
  getAllCarouselDatatable(query: DatatableQuery): Promise<any>;
  getPublishedCarouselDatatable(): Promise<any>;
  findOne(id: string): Promise<CarouselResponse>;
  update(id: string, payload: CarouselInput): Promise<CarouselResponse>;
  reorder(payload: CarouselReorderInput): Promise<void>;
}
