import { Permissions } from '@/common/decorators/permissions.decorator';
import { AuthUser } from '@/common/decorators/user.decorator';
import { JwtAuthGuard } from '@/common/guards/auth/jwt-auth.guard';
import { SessionAuthGuard } from '@/common/guards/auth/session-auth.guard';
import { PermissionGuard } from '@/common/guards/permission.guard';
import { DatatablePipe, DatatableQuery } from '@/common/pipes/DatatablePipe';
import { FieldPipe } from '@/common/pipes/FieldPipe';
import { ZodPipe } from '@/common/pipes/ZodPipe';
import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  FieldBulkInput,
  fieldBulkSchema,
  FieldInput,
  FieldReorderInput,
  FieldReorderSchema,
  PermissionEnum,
  Session,
} from '@pawpal/shared';

import { BulkUpdateFieldsUseCase } from '../application/usecases/bulk-update-fields.usecase';
import { CreateProductFieldUseCase } from '../application/usecases/create-product-field.usecase';
import { GetProductFieldDatatableUseCase } from '../application/usecases/get-product-field-datatable.usecase';
import { ReorderProductFieldUseCase } from '../application/usecases/reorder-product-field.usecase';
import { UpdateFieldUseCase } from '../application/usecases/update-field.usecase';

@Controller('admin/field')
@UseGuards(SessionAuthGuard, JwtAuthGuard, PermissionGuard)
@Permissions(PermissionEnum.OrderManagement)
export class AdminFieldController {
  constructor(
    private readonly createProductField: CreateProductFieldUseCase,
    private readonly updateField: UpdateFieldUseCase,
    private readonly getProductFieldDatatable: GetProductFieldDatatableUseCase,
    private readonly reorderProductField: ReorderProductFieldUseCase,
    private readonly bulkUpdateFields: BulkUpdateFieldsUseCase,
  ) {}

  @Patch(':id')
  update(@Param('id') id: string, @Body() payload: FieldInput) {
    return this.updateField.execute(id, payload);
  }

  @Post('/product/:productId')
  create(
    @Param('productId') productId: string,
    @Body(FieldPipe) payload: FieldInput,
    @AuthUser() user: Session,
  ) {
    return this.createProductField.execute(productId, payload, user);
  }

  @Get('/product/:id')
  getDatatable(
    @Param('id') id: string,
    @Query(DatatablePipe) query: DatatableQuery,
  ) {
    return this.getProductFieldDatatable.execute(id, query);
  }

  @Post('/product/:productId/reorder')
  reorder(
    @Param('productId') productId: string,
    @Body(new ZodPipe(FieldReorderSchema)) payload: FieldReorderInput,
  ) {
    return this.reorderProductField.execute(productId, payload);
  }

  @Put('/product/:productId/bulk')
  bulkUpdate(
    @Param('productId') productId: string,
    @Body(new ZodPipe(fieldBulkSchema)) payload: FieldBulkInput,
    @AuthUser() user: Session,
  ) {
    return this.bulkUpdateFields.execute(productId, payload, user);
  }
}
