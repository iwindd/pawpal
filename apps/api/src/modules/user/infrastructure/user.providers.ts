import { Provider } from '@nestjs/common';
import { AdminCreateUserUseCase } from '../application/usecases/admin-create-user.usecase';
import { AdminResetEmailUseCase } from '../application/usecases/admin-reset-email.usecase';
import { AdminResetPasswordUseCase } from '../application/usecases/admin-reset-password.usecase';
import { AdminUpdateUserRolesUseCase } from '../application/usecases/admin-update-user-roles.usecase';
import { ChangeEmailUseCase } from '../application/usecases/change-email.usecase';
import { GetCustomerDatatableUseCase } from '../application/usecases/get-customer-datatable.usecase';
import { GetCustomerOrderHistoryDatatableUseCase } from '../application/usecases/get-customer-order-history-datatable.usecase';
import { GetCustomerTopupHistoryDatatableUseCase } from '../application/usecases/get-customer-topup-history-datatable.usecase';
import { GetEmployeeDatatableUseCase } from '../application/usecases/get-employee-datatable.usecase';
import { GetEmployeeProcessedOrderHistoryDatatableUseCase } from '../application/usecases/get-employee-processed-order-history-datatable.usecase';
import { GetEmployeeProcessedTopupHistoryDatatableUseCase } from '../application/usecases/get-employee-processed-topup-history-datatable.usecase';
import { GetSuspensionHistoryDatatableUseCase } from '../application/usecases/get-suspension-history-datatable.usecase';
import { GetUserProfileUseCase } from '../application/usecases/get-user-profile.usecase';
import { SuspendUserUseCase } from '../application/usecases/suspend-user.usecase';
import { UnsuspendUserUseCase } from '../application/usecases/unsuspend-user.usecase';
import { UpdateProfileUseCase } from '../application/usecases/update-profile.usecase';
import { UserRepository } from './user.repository';

export const userProviders: Provider[] = [
  UserRepository,
  AdminCreateUserUseCase,
  AdminUpdateUserRolesUseCase,
  ChangeEmailUseCase,
  UpdateProfileUseCase,
  AdminResetEmailUseCase,
  AdminResetPasswordUseCase,
  GetUserProfileUseCase,
  SuspendUserUseCase,
  UnsuspendUserUseCase,
  GetSuspensionHistoryDatatableUseCase,
  GetCustomerDatatableUseCase,
  GetCustomerTopupHistoryDatatableUseCase,
  GetCustomerOrderHistoryDatatableUseCase,
  GetEmployeeDatatableUseCase,
  GetEmployeeProcessedTopupHistoryDatatableUseCase,
  GetEmployeeProcessedOrderHistoryDatatableUseCase,
];
