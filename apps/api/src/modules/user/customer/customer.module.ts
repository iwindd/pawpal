import { Module } from '@nestjs/common';
import { UserModule } from '../user.module';
import { AdminCustomerController } from './admin-customer.controller';
import { CustomerService } from './customer.service';

@Module({
  imports: [UserModule],
  controllers: [AdminCustomerController],
  providers: [CustomerService],
})
export class CustomerModule {}
