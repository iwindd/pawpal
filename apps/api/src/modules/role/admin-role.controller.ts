import { AuthUser } from '@/common/decorators/user.decorator';
import { JwtAuthGuard } from '@/common/guards/auth/jwt-auth.guard';
import { SessionAuthGuard } from '@/common/guards/auth/session-auth.guard';
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
import { RoleInput, Session, roleSchema } from '@pawpal/shared';
import { RoleService } from './role.service';

@Controller('admin/role')
@UseGuards(SessionAuthGuard, JwtAuthGuard)
export class AdminRoleController {
  constructor(private readonly roleService: RoleService) {}

  @Get()
  getDatatable(@Query(DatatablePipe) query: DatatableQuery) {
    return this.roleService.getDatatable(query);
  }

  @Get('permissions')
  getPermissions() {
    return this.roleService.getPermissions();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.roleService.findOne(id);
  }

  @Post()
  create(
    @Body(new ZodPipe(roleSchema)) payload: RoleInput,
    @AuthUser() user: Session,
  ) {
    return this.roleService.create(payload);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body(new ZodPipe(roleSchema)) payload: RoleInput,
    @AuthUser() user: Session,
  ) {
    return this.roleService.update(id, payload);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.roleService.remove(id);
  }
}
