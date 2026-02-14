import { DatatablePipe, DatatableQuery } from '@/common/pipes/DatatablePipe';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import {
  CategoryInput,
  CategoryResponse,
  CategoryUpdateInput,
  DatatableResponse,
} from '@pawpal/shared';
import { CategoryService } from './category.service';

@Controller('admin/category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  async findAll(
    @Query(new DatatablePipe()) query: DatatableQuery,
  ): Promise<DatatableResponse<CategoryResponse>> {
    return this.categoryService.findAll(query);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<CategoryResponse> {
    return this.categoryService.findOne(id);
  }

  @Post()
  async create(
    @Body() createCategoryDto: CategoryInput,
  ): Promise<CategoryResponse> {
    return this.categoryService.create(createCategoryDto);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateCategoryDto: CategoryUpdateInput,
  ): Promise<CategoryResponse> {
    return this.categoryService.update(id, updateCategoryDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<{ success: boolean }> {
    return this.categoryService.remove(id);
  }

  @Get(':id/products')
  async getProductsInCategory(
    @Param('id') id: string,
    @Query(new DatatablePipe()) query: DatatableQuery,
  ) {
    return this.categoryService.getProductsInCategoryDatatable(id, query);
  }
}
