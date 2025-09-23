import { Controller, Get } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('admin/test')
  test(): { message: string; status: string } {
    return {
      message: 'User service is working correctly',
      status: 'success',
    };
  }
}
