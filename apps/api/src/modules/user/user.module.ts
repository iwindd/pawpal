import { Module } from '@nestjs/common';
import { AdminUserController } from './admin-user.controller';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  exports: [UserService],
  controllers: [UserController, AdminUserController],
  providers: [UserService],
})
export class UserModule {}
