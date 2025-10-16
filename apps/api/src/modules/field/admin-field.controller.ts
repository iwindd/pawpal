import { AuthUser } from '@/common/decorators/user.decorator';
import { FieldPipe } from '@/common/pipes/FieldPipe';
import { Body, Controller, Param, Patch, Post } from '@nestjs/common';
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
}
