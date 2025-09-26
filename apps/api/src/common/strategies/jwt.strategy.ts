import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Session } from '@pawpal/shared';
import { ExtractJwt, JwtFromRequestFunction, Strategy } from 'passport-jwt';
import { AuthService } from '../../modules/auth/auth.service';
import { JwtPayload } from '../interfaces/jwt-payload.interface';

/**
 * Custom function for extracting JWT from signed cookie
 * @param request - Express request object
 * @returns string | null - JWT token from cookie or null
 */
const extractJwtFromCookie: JwtFromRequestFunction = (request) => {
  return request.signedCookies['token']!;
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    configService: ConfigService,
    private readonly authService: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        // We need to extract the JWT from the cookie and the header
        extractJwtFromCookie,
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      ignoreExpiration: false, // We don't need to check if the token is expired
      passReqToCallback: false, // We don't need the request object in the callback
      secretOrKey: configService.get<string>('APP_SECRET'),
    });
  }

  /**
   * Validate the JWT payload
   * @param payload - The JWT payload
   * @returns The user
   */
  async validate(payload: JwtPayload): Promise<Session> {
    return this.authService.verifyPayload(payload);
  }
}
