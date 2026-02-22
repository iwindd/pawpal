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
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  CreateTagInput,
  PermissionEnum,
  Session,
  TagSchema,
} from '@pawpal/shared';

import { CreateTagUseCase } from '../application/usecases/create-tag.usecase';
import { GetProductsInTagDatatableUseCase } from '../application/usecases/get-products-in-tag-datatable.usecase';
import { GetTagDatatableUseCase } from '../application/usecases/get-tag-datatable.usecase';
import { GetTagUseCase } from '../application/usecases/get-tag.usecase';
import { UpdateTagUseCase } from '../application/usecases/update-tag.usecase';

@Controller('admin/tag')
@UseGuards(SessionAuthGuard, JwtAuthGuard, PermissionGuard)
@Permissions(PermissionEnum.TagManagement)
export class TagController {
  constructor(
    private readonly createTag: CreateTagUseCase,
    private readonly getTagDatatable: GetTagDatatableUseCase,
    private readonly getProductsInTagDatatable: GetProductsInTagDatatableUseCase,
    private readonly getTag: GetTagUseCase,
    private readonly updateTag: UpdateTagUseCase,
  ) {}

  @Get()
  getDatatable(@Query(new DatatablePipe()) query: DatatableQuery) {
    return this.getTagDatatable.execute(query);
  }

  @Post()
  create(
    @Body(new ZodPipe(TagSchema)) payload: CreateTagInput,
    @AuthUser() user: Session,
  ) {
    return this.createTag.execute(payload);
  }

  @Patch(':slug')
  update(
    @Param('slug') slug: string,
    @Body(new ZodPipe(TagSchema)) updateProductTagDto: CreateTagInput,
  ) {
    return this.updateTag.execute(slug, updateProductTagDto);
  }

  @Get(':id')
  findOneById(@Param('id') id: string) {
    return this.getTag.execute(id);
  }

  @Get(':id/products')
  getProductsInTag(
    @Param('id') id: string,
    @Query(new DatatablePipe()) query: DatatableQuery,
  ) {
    return this.getProductsInTagDatatable.execute(id, query);
  }
}
