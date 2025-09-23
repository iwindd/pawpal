import { Controller, Get } from '@nestjs/common';
import { UserService } from './user.service';

interface TestResponse {
  message: string;
  status: string;
}

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('admin/test')
  test(): TestResponse {
    return {
      message: 'User service is working correctly',
      status: 'success',
    };
  }
}
