import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Session } from '@pawpal/shared';
import { ExtractJwt, JwtFromRequestFunction, Strategy } from 'passport-jwt';
import { VerifyPayloadUseCase } from '../../modules/auth/application/usecases/verify-payload.usecase';
import { JwtPayload } from '../interfaces/jwt-payload.interface';

const extractJwtFromCookie: JwtFromRequestFunction = (request) => {
  return request.signedCookies['token']!;
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    configService: ConfigService,
    private readonly verifyPayloadUseCase: VerifyPayloadUseCase,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        extractJwtFromCookie,
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      ignoreExpiration: false,
      passReqToCallback: false,
      secretOrKey: configService.get<string>('APP_SECRET'),
    });
  }

  async validate(payload: JwtPayload): Promise<Session> {
    return this.verifyPayloadUseCase.execute(payload);
  }
}
