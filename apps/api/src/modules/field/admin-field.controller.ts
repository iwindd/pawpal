import { AuthUser } from '@/common/decorators/user.decorator';
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
  Query,
} from '@nestjs/common';
import {
  FieldInput,
  FieldReorderInput,
  FieldReorderSchema,
  Session,
} from '@pawpal/shared';
import { FieldService } from './field.service';

@Controller('admin/field')
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
  getProductFields(
    @Param('id') id: string,
    @Query(DatatablePipe) query: DatatableQuery,
  ) {
    return this.fieldService.getProductFields(id, query);
  }

  @Post('/product/:productId/reorder')
  reorderProductField(
    @Param('productId') productId: string,
    @Body(new ZodPipe(FieldReorderSchema)) payload: FieldReorderInput,
  ) {
    return this.fieldService.reorderProductField(productId, payload);
  }
}
