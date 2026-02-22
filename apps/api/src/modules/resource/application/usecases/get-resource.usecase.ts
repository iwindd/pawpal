import { Inject, Injectable } from '@nestjs/common';
import {
  IResourceRepository,
  RESOURCE_REPOSITORY,
} from '../../domain/repository.port';

@Injectable()
export class GetResourceUseCase {
  constructor(
    @Inject(RESOURCE_REPOSITORY)
    private readonly resourceRepo: IResourceRepository,
  ) {}

  async execute(id: string) {
    return this.resourceRepo.findOne(id);
  }
}
