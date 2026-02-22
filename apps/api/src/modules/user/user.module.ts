import { Module } from '@nestjs/common';
import { userProviders } from './infrastructure/user.providers';
import { AdminCustomerController } from './presentation/admin-customer.controller';
import { AdminEmployeeController } from './presentation/admin-employee.controller';
import { AdminUserController } from './presentation/admin-user.controller';
import { UserController } from './presentation/user.controller';

@Module({
  controllers: [
    UserController,
    AdminUserController,
    AdminCustomerController,
    AdminEmployeeController,
  ],
  providers: [...userProviders],
  exports: [...userProviders],
})
export class UserModule {}
