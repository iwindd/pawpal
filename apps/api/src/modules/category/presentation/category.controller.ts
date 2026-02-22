import { Permissions } from '@/common/decorators/permissions.decorator';
import { JwtAuthGuard } from '@/common/guards/auth/jwt-auth.guard';
import { SessionAuthGuard } from '@/common/guards/auth/session-auth.guard';
import { PermissionGuard } from '@/common/guards/permission.guard';
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
  UseGuards,
} from '@nestjs/common';
import {
  CategoryInput,
  CategoryResponse,
  CategoryUpdateInput,
  DatatableResponse,
  PermissionEnum,
} from '@pawpal/shared';

import { CreateCategoryUseCase } from '../application/usecases/create-category.usecase';
import { GetCategoryDatatableUseCase } from '../application/usecases/get-category-datatable.usecase';
import { GetCategoryUseCase } from '../application/usecases/get-category.usecase';
import { GetProductsInCategoryDatatableUseCase } from '../application/usecases/get-products-in-category-datatable.usecase';
import { RemoveCategoryUseCase } from '../application/usecases/remove-category.usecase';
import { UpdateCategoryUseCase } from '../application/usecases/update-category.usecase';

@Controller('admin/category')
@UseGuards(SessionAuthGuard, JwtAuthGuard, PermissionGuard)
@Permissions(PermissionEnum.CategoryManagement)
export class CategoryController {
  constructor(
    private readonly getCategoryDatatable: GetCategoryDatatableUseCase,
    private readonly getCategory: GetCategoryUseCase,
    private readonly createCategory: CreateCategoryUseCase,
    private readonly updateCategory: UpdateCategoryUseCase,
    private readonly removeCategory: RemoveCategoryUseCase,
    private readonly getProductsInCategoryDatatable: GetProductsInCategoryDatatableUseCase,
  ) {}

  @Get()
  async findAll(
    @Query(new DatatablePipe()) query: DatatableQuery,
  ): Promise<DatatableResponse<CategoryResponse>> {
    return this.getCategoryDatatable.execute(query);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<CategoryResponse> {
    return this.getCategory.execute(id);
  }

  @Post()
  async create(
    @Body() createCategoryDto: CategoryInput,
  ): Promise<CategoryResponse> {
    return this.createCategory.execute(createCategoryDto);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateCategoryDto: CategoryUpdateInput,
  ): Promise<CategoryResponse> {
    return this.updateCategory.execute(id, updateCategoryDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<{ success: boolean }> {
    return this.removeCategory.execute(id);
  }

  @Get(':id/products')
  async getProductsInCategory(
    @Param('id') id: string,
    @Query(new DatatablePipe()) query: DatatableQuery,
  ) {
    return this.getProductsInCategoryDatatable.execute(id, query);
  }
}
