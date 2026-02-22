import { Module } from '@nestjs/common';
import { roleProviders } from './infrastructure/role.providers';
import { AdminRoleController } from './presentation/admin-role.controller';

@Module({
  controllers: [AdminRoleController],
  providers: [...roleProviders],
})
export class RoleModule {}
