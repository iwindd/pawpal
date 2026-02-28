import { Inject, Injectable } from '@nestjs/common';
import { ProductStockInput } from '@pawpal/shared';
import {
  IProductRepository,
  PRODUCT_REPOSITORY,
} from '../../domain/repository.port';

@Injectable()
export class UpdateProductStockUseCase {
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepo: IProductRepository,
  ) {}

  async execute(id: string, payload: ProductStockInput, userId: string) {
    return this.productRepo.updateProductStock(id, payload, userId);
  }
}
