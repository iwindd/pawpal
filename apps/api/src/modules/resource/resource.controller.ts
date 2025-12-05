import { AuthUser } from '@/common/decorators/user.decorator';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { SessionAuthGuard } from '@/common/guards/session-auth.guard';
import { DatatablePipe, DatatableQuery } from '@/common/pipes/DatatablePipe';
import { ZodFileValidationPipe } from '@/common/ZodFileValidationPipe';
import {
  Controller,
  Get,
  HttpCode,
  Param,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  DatatableResponse,
  MulterFileSchema,
  ResourceResponse,
  Session,
} from '@pawpal/shared';
import { ResourceService } from './resource.service';

@Controller('admin/resource')
@UseGuards(SessionAuthGuard, JwtAuthGuard)
export class ResourcesController {
  constructor(private readonly resourceService: ResourceService) {}

  @Get()
  async findAllResources(
    @Query(DatatablePipe) query: DatatableQuery,
  ): Promise<DatatableResponse<ResourceResponse>> {
    return await this.resourceService.findAllResources(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.resourceService.findOne(id);
  }

  @Post()
  @HttpCode(201)
  @UseInterceptors(FileInterceptor('file'))
  async upload(
    @UploadedFile(new ZodFileValidationPipe(MulterFileSchema))
    file: Express.Multer.File,
    @AuthUser() user: Session,
  ): Promise<ResourceResponse> {
    return await this.resourceService.uploadResource(file, user.id);
  }
}
