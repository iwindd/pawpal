import { Request as NestRequest } from '@nestjs/common';

declare module '@nestjs/common' {
  interface Request extends NestRequest {
    user?: {
      email: string;
      password: string;
    };
  }
}
