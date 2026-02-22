import { Inject, Injectable } from '@nestjs/common';
import { EventService } from '../../../event/application/event.service';
import {
  ITopupRepository,
  TOPUP_REPOSITORY,
} from '../../domain/repository.port';

@Injectable()
export class ConfirmTopupUseCase {
  constructor(
    @Inject(TOPUP_REPOSITORY)
    private readonly topupRepo: ITopupRepository,
    private readonly eventService: EventService,
  ) {}

  async execute(chargeId: string) {
    const result = await this.topupRepo.confirm(chargeId);
    this.eventService.admin.onNewJobTransaction(result);
    return result;
  }
}
