import { AuthUser } from '@/common/decorators/user.decorator';
import { JwtAuthGuard } from '@/common/guards/auth/jwt-auth.guard';
import { SessionAuthGuard } from '@/common/guards/auth/session-auth.guard';
import { DatatablePipe, DatatableQuery } from '@/common/pipes/DatatablePipe';
import {
  Controller,
  Get,
  HttpCode,
  Param,
  Post,
  Query,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { AdminResourceResponse, Session } from '@pawpal/shared';

import { GetResourceDatatableUseCase } from '../application/usecases/get-resource-datatable.usecase';
import { GetResourceUseCase } from '../application/usecases/get-resource.usecase';
import { UploadResourcesUseCase } from '../application/usecases/upload-resources.usecase';

@Controller('admin/resource')
@UseGuards(SessionAuthGuard, JwtAuthGuard)
export class ResourcesController {
  constructor(
    private readonly getResourceDatatable: GetResourceDatatableUseCase,
    private readonly getResource: GetResourceUseCase,
    private readonly uploadResources: UploadResourcesUseCase,
  ) {}

  @Get()
  async getAllResourceDatatable(@Query(DatatablePipe) query: DatatableQuery) {
    return this.getResourceDatatable.execute(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.getResource.execute(id);
  }

  @Post()
  @HttpCode(201)
  @UseInterceptors(FilesInterceptor('files'))
  async upload(
    @UploadedFiles()
    files: Array<Express.Multer.File>,
    @AuthUser() user: Session,
  ): Promise<AdminResourceResponse[]> {
    return this.uploadResources.execute(files, user.id);
  }
}
