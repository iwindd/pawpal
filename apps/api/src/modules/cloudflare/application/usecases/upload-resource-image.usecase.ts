import { Inject, Injectable } from '@nestjs/common';
import { IStorageService, STORAGE_SERVICE } from '../../domain/storage.port';

@Injectable()
export class UploadResourceImageUseCase {
  constructor(
    @Inject(STORAGE_SERVICE) private readonly storage: IStorageService,
  ) {}

  async execute(file: Express.Multer.File) {
    return this.storage.uploadResourceImage(file);
  }
}
