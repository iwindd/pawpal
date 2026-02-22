import { Inject, Injectable } from '@nestjs/common';
import { ProductInput } from '@pawpal/shared';
import {
  IProductRepository,
  PRODUCT_REPOSITORY,
} from '../../domain/repository.port';

@Injectable()
export class CreateProductUseCase {
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepo: IProductRepository,
  ) {}

  async execute(payload: ProductInput, userId: string) {
    return this.productRepo.createProduct(payload, userId);
  }
}
