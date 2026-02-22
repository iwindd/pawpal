import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Session } from '@pawpal/shared';
import { Strategy } from 'passport-local';
import { LoginUseCase } from '../../modules/auth/application/usecases/login.usecase';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly loginUseCase: LoginUseCase) {
    super({
      usernameField: 'email',
      passwordField: 'password',
      passReqToCallback: false,
    });
  }

  validate(email: string, password: string): Promise<Session> {
    return this.loginUseCase.execute(email, password);
  }
}
