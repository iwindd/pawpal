import { PackageService } from '@/modules/package/package.service';
import { Injectable, PipeTransform } from '@nestjs/common';
import { buildFieldSchema, purchaseSchema } from '@pawpal/shared';

export interface FieldAfterParse {
  id: string;
  value: string;
}

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

    const fieldArray = [];
    for (const fieldId in parsedFull.fields) {
      fieldArray.push({
        id: fieldId,
        value: parsedFull.fields[fieldId],
      });
    }

    return {
      ...parsedFull,
      fields: fieldArray,
    };
  }
}
