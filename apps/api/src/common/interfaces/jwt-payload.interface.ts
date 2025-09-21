import { Session } from '@pawpal/shared';

export interface JwtPayload extends Session {
  sub: string;
  iat: number;
  exp: number;
}
