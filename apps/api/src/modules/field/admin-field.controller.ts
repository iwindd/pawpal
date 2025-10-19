import { AuthUser } from '@/common/decorators/user.decorator';
import { DatatablePipe, DatatableQuery } from '@/common/pipes/DatatablePipe';
import { FieldPipe } from '@/common/pipes/FieldPipe';
import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { FieldInput, Session } from '@pawpal/shared';
import { FieldService } from './field.service';

@Controller('admin/field')
export class AdminFieldController {
  constructor(private readonly fieldService: FieldService) {}

  @Post()
  create(@Body(FieldPipe) payload: FieldInput, @AuthUser() user: Session) {
    return this.fieldService.create(payload, user);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() payload: FieldInput) {
    return this.fieldService.update(id, payload);
  }

  @Get('/product/:id')
  getProductFields(
    @Param('id') id: string,
    @Query(DatatablePipe) query: DatatableQuery,
  ) {
    return this.fieldService.getProductFields(id, query);
  }
}
