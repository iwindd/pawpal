import { Inject, Injectable } from '@nestjs/common';
import { IStorageService, STORAGE_SERVICE } from '../../domain/storage.port';

@Injectable()
export class CopyObjectUseCase {
  constructor(
    @Inject(STORAGE_SERVICE) private readonly storage: IStorageService,
  ) {}

  async execute(key: string, newKey: string) {
    return this.storage.copyObject(key, newKey);
  }
}
