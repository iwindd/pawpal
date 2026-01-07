import { Module } from '@nestjs/common';
import { UserModule } from '../user.module';
import { AdminEmployeeController } from './admin-employee.controller';
import { EmployeeService } from './employee.service';

@Module({
  imports: [UserModule],
  controllers: [AdminEmployeeController],
  providers: [EmployeeService],
})
export class EmployeeModule {}
