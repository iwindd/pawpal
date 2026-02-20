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
import { FieldService } from './field.service';

@Controller('admin/field')
@UseGuards(SessionAuthGuard, JwtAuthGuard, PermissionGuard)
@Permissions(PermissionEnum.OrderManagement)
export class AdminFieldController {
  constructor(private readonly fieldService: FieldService) {}

  @Patch(':id')
  update(@Param('id') id: string, @Body() payload: FieldInput) {
    return this.fieldService.update(id, payload);
  }

  @Post('/product/:productId')
  create(
    @Param('productId') productId: string,
    @Body(FieldPipe) payload: FieldInput,
    @AuthUser() user: Session,
  ) {
    return this.fieldService.createProductField(productId, payload, user);
  }

  @Get('/product/:id')
  getProductFieldDatatable(
    @Param('id') id: string,
    @Query(DatatablePipe) query: DatatableQuery,
  ) {
    return this.fieldService.getProductFieldDatatable(id, query);
  }

  @Post('/product/:productId/reorder')
  reorderProductField(
    @Param('productId') productId: string,
    @Body(new ZodPipe(FieldReorderSchema)) payload: FieldReorderInput,
  ) {
    return this.fieldService.reorderProductField(productId, payload);
  }

  @Put('/product/:productId/bulk')
  bulkUpdateFields(
    @Param('productId') productId: string,
    @Body(new ZodPipe(fieldBulkSchema)) payload: FieldBulkInput,
    @AuthUser() user: Session,
  ) {
    return this.fieldService.bulkUpdateFields(productId, payload, user);
  }
}
