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
    private readonly getDatatableUseCase: GetRoleDatatableUseCase,
    private readonly getRoleUseCase: GetRoleUseCase,
    private readonly createRoleUseCase: CreateRoleUseCase,
    private readonly updateRoleUseCase: UpdateRoleUseCase,
    private readonly removeRoleUseCase: RemoveRoleUseCase,
    private readonly getPermissionsUseCase: GetPermissionsUseCase,
  ) {}

  @Get()
  getDatatable(@Query(DatatablePipe) query: DatatableQuery) {
    return this.getDatatableUseCase.execute(query);
  }

  @Get('permissions')
  getPermissions() {
    return this.getPermissionsUseCase.execute();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.getRoleUseCase.execute(id);
  }

  @Post()
  create(
    @Body(new ZodPipe(roleSchema)) payload: RoleInput,
    @AuthUser() user: Session,
  ) {
    return this.createRoleUseCase.execute(payload);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body(new ZodPipe(roleSchema)) payload: RoleInput,
    @AuthUser() user: Session,
  ) {
    return this.updateRoleUseCase.execute(id, payload);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.removeRoleUseCase.execute(id);
  }
}
