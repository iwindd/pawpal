import { Request as NestRequest } from '@nestjs/common';
import { CookieOptions } from 'express';

declare module '@nestjs/common' {
  interface RequestWithUser extends NestRequest {
    user?: {
      email: string;
      password: string;
      displayName: string;
      coins: number;
    };
  }

  interface ResponseWithCookie extends Response {
    cookie(name: string, value: string, options: CookieOptions): void;
  }
}
