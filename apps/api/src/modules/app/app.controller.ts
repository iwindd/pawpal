import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

interface TestResponse {
  message: string;
  status: string;
}

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('admin/test')
  test(): TestResponse {
    return {
      message: 'App service is working correctly',
      status: 'success',
    };
  }
}
