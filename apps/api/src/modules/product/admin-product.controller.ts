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
import {
  AdminProductResponse,
  DatatableQueryDto,
  DatatableQuerySchema,
  DatatableResponse,
  ProductInput,
  productSchema,
} from '@pawpal/shared';
import { PackageService } from '../package/package.service';
import { ProductService } from './product.service';

@Controller('admin/product')
export class AdminProductController {
  constructor(
    private readonly productService: ProductService,
    private readonly packageService: PackageService,
  ) {}

  @Get()
  @UsePipes(new ZodValidationPipe(DatatableQuerySchema))
  async getProducts(
    @Query() queryParams: DatatableQueryDto,
  ): Promise<DatatableResponse<AdminProductResponse>> {
    return this.productService.getProducts(queryParams);
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
