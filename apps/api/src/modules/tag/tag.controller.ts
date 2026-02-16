import { AuthUser } from '@/common/decorators/user.decorator';
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
} from '@nestjs/common';
import { CreateTagInput, Session, TagSchema } from '@pawpal/shared';
import { TagService } from './tag.service';

@Controller('admin/tag')
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @Get()
  getTagDatatable(@Query(new DatatablePipe()) query: DatatableQuery) {
    return this.tagService.getTagDatatable(query);
  }

  @Post()
  createTag(
    @Body(new ZodPipe(TagSchema)) payload: CreateTagInput,
    @AuthUser() user: Session,
  ) {
    return this.tagService.createTag(payload);
  }

  @Patch(':slug')
  update(
    @Param('slug') slug: string,
    @Body(new ZodPipe(TagSchema))
    updateProductTagDto: CreateTagInput,
  ) {
    return this.tagService.update(slug, updateProductTagDto);
  }

  @Get(':id')
  findOneById(@Param('id') id: string) {
    return this.tagService.findOneById(id);
  }

  @Get(':id/products')
  getProductsInTag(
    @Param('id') id: string,
    @Query(new DatatablePipe()) query: DatatableQuery,
  ) {
    return this.tagService.getProductsInTagDatatable(id, query);
  }
}
