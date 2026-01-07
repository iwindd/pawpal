import { Module } from '@nestjs/common';
import { AdminEmployeeController } from './admin-employee.controller';
import { EmployeeService } from './employee.service';

@Module({
  controllers: [AdminEmployeeController],
  providers: [EmployeeService],
})
export class EmployeeModule {}
