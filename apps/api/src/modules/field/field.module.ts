import { Module } from '@nestjs/common';
import { fieldProviders } from './infrastructure/field.providers';
import { AdminFieldController } from './presentation/admin-field.controller';

@Module({
  controllers: [AdminFieldController],
  providers: [...fieldProviders],
})
export class FieldModule {}
