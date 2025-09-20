import { Request as NestRequest } from '@nestjs/common';
import { CookieOptions } from 'express';

declare module '@nestjs/common' {
  interface RequestWithUser extends NestRequest {
    user?: { email: string; password: string };
  }

  interface ResponseWithCookie extends Response {
    cookie(name: string, value: string, options: CookieOptions): void;
  }
}
