import { Inject, Injectable } from '@nestjs/common';
import { ProductInput } from '@pawpal/shared';
import {
  IProductRepository,
  PRODUCT_REPOSITORY,
} from '../../domain/repository.port';

@Injectable()
export class UpdateProductUseCase {
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepo: IProductRepository,
  ) {}

  async execute(id: string, payload: ProductInput, userId: string) {
    return this.productRepo.updateProduct(id, payload, userId);
  }
}
