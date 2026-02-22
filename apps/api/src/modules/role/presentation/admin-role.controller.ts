import { Permissions } from '@/common/decorators/permissions.decorator';
import { AuthUser } from '@/common/decorators/user.decorator';
import { JwtAuthGuard } from '@/common/guards/auth/jwt-auth.guard';
import { SessionAuthGuard } from '@/common/guards/auth/session-auth.guard';
import { PermissionGuard } from '@/common/guards/permission.guard';
import { DatatablePipe, DatatableQuery } from '@/common/pipes/DatatablePipe';
import { ZodPipe } from '@/common/pipes/ZodPipe';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { PermissionEnum, RoleInput, Session, roleSchema } from '@pawpal/shared';

import { CreateRoleUseCase } from '../application/usecases/create-role.usecase';
import { GetPermissionsUseCase } from '../application/usecases/get-permissions.usecase';
import { GetRoleDatatableUseCase } from '../application/usecases/get-role-datatable.usecase';
import { GetRoleUseCase } from '../application/usecases/get-role.usecase';
import { RemoveRoleUseCase } from '../application/usecases/remove-role.usecase';
import { UpdateRoleUseCase } from '../application/usecases/update-role.usecase';

@Controller('admin/role')
@UseGuards(SessionAuthGuard, JwtAuthGuard, PermissionGuard)
@Permissions(PermissionEnum.RoleManagement)
export class AdminRoleController {
  constructor(
    private readonly getRoleDatatable: GetRoleDatatableUseCase,
    private readonly getRole: GetRoleUseCase,
    private readonly getPermissions: GetPermissionsUseCase,
    private readonly createRole: CreateRoleUseCase,
    private readonly updateRole: UpdateRoleUseCase,
    private readonly removeRole: RemoveRoleUseCase,
  ) {}

  @Get()
  getDatatable(@Query(DatatablePipe) query: DatatableQuery) {
    return this.getRoleDatatable.execute(query);
  }

  @Get('permissions')
  permissions() {
    return this.getPermissions.execute();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.getRole.execute(id);
  }

  @Post()
  create(
    @Body(new ZodPipe(roleSchema)) payload: RoleInput,
    @AuthUser() user: Session,
  ) {
    return this.createRole.execute(payload);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body(new ZodPipe(roleSchema)) payload: RoleInput,
    @AuthUser() user: Session,
  ) {
    return this.updateRole.execute(id, payload);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.removeRole.execute(id);
  }
}
