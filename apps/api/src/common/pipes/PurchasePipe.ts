import { PackageService } from '@/modules/package/package.service';
import { Injectable, PipeTransform } from '@nestjs/common';
import { buildFieldSchema, purchaseSchema } from '@pawpal/shared';

@Injectable()
export class PurchasePipe implements PipeTransform {
  private readonly basePurchaseSchema = purchaseSchema;
  constructor(private readonly packageService: PackageService) {}

  async transform(value: any) {
    const parsedProduct = this.basePurchaseSchema.parse(value);
    const fields = await this.packageService.getFields(parsedProduct.packageId);
    const fullSchema = this.basePurchaseSchema.extend({
      fields: buildFieldSchema(fields).schema,
    });
    const parsedFull = fullSchema.parse(value);
    return parsedFull;
  }
}
