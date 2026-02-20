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
import { ResourceService } from './resource.service';

@Controller('admin/resource')
@UseGuards(SessionAuthGuard, JwtAuthGuard) // TODO: Permission Guard
export class ResourcesController {
  constructor(private readonly resourceService: ResourceService) {}

  @Get()
  async getAllResourceDatatable(@Query(DatatablePipe) query: DatatableQuery) {
    return await this.resourceService.getAllResourceDatatable(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.resourceService.findOne(id);
  }

  @Post()
  @HttpCode(201)
  @UseInterceptors(FilesInterceptor('files'))
  async upload(
    @UploadedFiles()
    files: Array<Express.Multer.File>,
    @AuthUser() user: Session,
  ): Promise<AdminResourceResponse[]> {
    return await this.resourceService.uploadResources(files, user.id);
  }
}
