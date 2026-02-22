import { DatatableQuery } from '@/common/pipes/DatatablePipe';
import { Inject, Injectable } from '@nestjs/common';
import { ENUM_TOPUP_STATUS, TopupStatus } from '@pawpal/shared';
import {
  ITopupRepository,
  TOPUP_REPOSITORY,
} from '../../domain/repository.port';

@Injectable()
export class GetTopupHistoryDatatableUseCase {
  constructor(
    @Inject(TOPUP_REPOSITORY)
    private readonly topupRepo: ITopupRepository,
  ) {}

  async execute(userId: string, query: DatatableQuery) {
    let statusFilter: TopupStatus | undefined;

    if (
      query.filter &&
      Object.values(ENUM_TOPUP_STATUS).includes(query.filter)
    ) {
      statusFilter = query.filter as TopupStatus;
    }

    return this.topupRepo.getTopupHistoryDatatable(userId, query, statusFilter);
  }
}
