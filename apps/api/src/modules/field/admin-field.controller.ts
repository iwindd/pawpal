import { AuthUser } from '@/common/decorators/user.decorator';
import { FieldPipe } from '@/common/pipes/FieldPipe';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
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

  @Get()
  findAll() {
    return this.fieldService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.fieldService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateFieldDto: any) {
    return this.fieldService.update(+id, updateFieldDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.fieldService.remove(+id);
  }
}
