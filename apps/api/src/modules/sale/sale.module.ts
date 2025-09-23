import { Global, Module } from '@nestjs/common';
import { SaleService } from './sale.service';

@Global()
@Module({
  providers: [SaleService],
  exports: [SaleService],
})
export class SaleModule {}
