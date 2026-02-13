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
import {
  CreateProductTagInput,
  ProductTagSchema,
  Session,
} from '@pawpal/shared';
import { ProductTagService } from './product-tag.service';

@Controller('admin/product-tag')
export class ProductTagController {
  constructor(private readonly productTagService: ProductTagService) {}

  @Get()
  getProductTagDatatable(@Query(new DatatablePipe()) query: DatatableQuery) {
    return this.productTagService.getProductTagDatatable(query);
  }

  @Post()
  createProductTag(
    @Body(new ZodPipe(ProductTagSchema)) payload: CreateProductTagInput,
    @AuthUser() user: Session,
  ) {
    return this.productTagService.createProductTag(payload);
  }

  @Patch(':slug')
  update(
    @Param('slug') slug: string,
    @Body(new ZodPipe(ProductTagSchema))
    updateProductTagDto: CreateProductTagInput,
  ) {
    return this.productTagService.update(slug, updateProductTagDto);
  }

  @Get(':id')
  findOneById(@Param('id') id: string) {
    return this.productTagService.findOneById(id);
  }
}
