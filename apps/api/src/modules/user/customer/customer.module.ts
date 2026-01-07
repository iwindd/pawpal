import { Module } from '@nestjs/common';
import { AdminCustomerController } from './admin-customer.controller';
import { CustomerService } from './customer.service';

@Module({
  controllers: [AdminCustomerController],
  providers: [CustomerService],
})
export class CustomerModule {}
