import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  exports: [UserService],
  controllers: [UserController],
  providers: [UserService, PrismaService],
})
export class UserModule {}
