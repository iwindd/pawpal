import { Module } from '@nestjs/common';
import { AdminFieldController } from './admin-field.controller';
import { FieldService } from './field.service';

@Module({
  controllers: [AdminFieldController],
  providers: [FieldService],
})
export class FieldModule {}
