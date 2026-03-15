import { DatatableQuery } from '@/common/pipes/DatatablePipe';
import { HomeLayoutPipe } from '@/common/pipes/HomeLayoutPipe';

import { Permissions } from '@/common/decorators/permissions.decorator';
import { AuthUser } from '@/common/decorators/user.decorator';
import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { HomeLayoutInput, PermissionEnum, Session } from '@pawpal/shared';
import { CreateHomeLayoutUseCase } from '../application/usecases/create-home-layout.usecase';
import { GetAllHomeLayoutDatatableUseCase } from '../application/usecases/get-all-home-layout-datatable.usecase';
import { GetHomeLayoutUseCase } from '../application/usecases/get-home-layout.usecase';
import { GetPublishedHomeLayoutUseCase } from '../application/usecases/get-published-home-layout.usecase';

@Controller('admin/home-layout')
export class AdminHomeLayoutController {
  constructor(
    private readonly getHomeLayoutDatatableUseCase: GetAllHomeLayoutDatatableUseCase,
    private readonly getHomeLayoutUseCase: GetHomeLayoutUseCase,
    private readonly getPublishedHomeLayoutUseCase: GetPublishedHomeLayoutUseCase,
    private readonly createHomeLayoutUseCase: CreateHomeLayoutUseCase,
  ) {}

  @Permissions(PermissionEnum.HomeSectionManagement)
  @Get()
  async getDatatable(@Query() query: DatatableQuery) {
    return await this.getHomeLayoutDatatableUseCase.execute(query);
  }

  @Permissions(PermissionEnum.HomeSectionManagement)
  @Get('published')
  async getPublished() {
    return await this.getPublishedHomeLayoutUseCase.execute();
  }

  @Permissions(PermissionEnum.HomeSectionManagement)
  @Get(':id')
  async getById(@Param('id') id: string) {
    return await this.getHomeLayoutUseCase.execute(id);
  }

  @Permissions(PermissionEnum.HomeSectionManagement)
  @Post()
  async create(
    @AuthUser() user: Session,
    @Body(HomeLayoutPipe) payload: HomeLayoutInput,
  ) {
    return await this.createHomeLayoutUseCase.execute(user, payload);
  }
}
