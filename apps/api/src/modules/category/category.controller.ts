import { Controller, Get, Post, Put, Delete, Param, Query, Body } from '@nestjs/common';
import { CategoryResponse, CategoryInput, CategoryUpdateInput } from '@pawpal/shared';
import { CategoryService } from './category.service';

@Controller('admin/category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  async findAll(@Query('search') search?: string): Promise<CategoryResponse[]> {
    return this.categoryService.findAll(search);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<CategoryResponse> {
    return this.categoryService.findOne(id);
  }

  @Post()
  async create(@Body() createCategoryDto: CategoryInput): Promise<CategoryResponse> {
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
}
