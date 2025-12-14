import { DatatablePipe, DatatableQuery } from '@/common/pipes/DatatablePipe';
import { ZodPipe } from '@/common/pipes/ZodPipe';
import { ZodValidationPipe } from '@/common/ZodValidationPipe';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UsePipes,
} from '@nestjs/common';
import { ProductInput, productSchema } from '@pawpal/shared';
import { ProductService } from './product.service';

@Controller('admin/product')
export class AdminProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  getProducts(@Query(new DatatablePipe()) query: DatatableQuery) {
    return this.productService.getAllProductDatatable(query);
  }

  @Get('combobox/:id')
  findOneCombobox(@Param('id') id: string) {
    return this.productService.findOneCombobox(id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productService.findOne(id);
  }

  @Post()
  create(@Body(new ZodPipe(productSchema)) createProductDto: ProductInput) {
    return this.productService.create(createProductDto);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body(new ZodPipe(productSchema)) payload: ProductInput,
  ) {
    return this.productService.update(id, payload);
  }

  @Delete(':id')
  @UsePipes(new ZodValidationPipe(productSchema))
  remove(@Param('id') id: string): Promise<{ success: boolean }> {
    return this.productService.remove(id);
  }
}
