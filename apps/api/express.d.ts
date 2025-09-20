import { Request as NestRequest } from '@nestjs/common';

declare module '@nestjs/common' {
  interface Request extends NestRequest {
    login?: {
      email: string;
      password: string;
    };
  }
}
