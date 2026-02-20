import { Module } from '@nestjs/common';
import { AdminRoleController } from './admin-role.controller';
import { RoleService } from './role.service';

@Module({
  controllers: [AdminRoleController],
  providers: [RoleService],
})
export class RoleModule {}
