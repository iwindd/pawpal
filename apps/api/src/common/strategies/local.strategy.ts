import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { User } from '@pawpal/prisma';
import { Strategy } from 'passport-local';
import { AuthService } from '../../modules/auth/auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      usernameField: 'email',
      passwordField: 'password',
      passReqToCallback: false, // We don't need the request object in the callback
    });
  }

  /**
   * Validate the user and password
   * @param email - The email of the user (extracted from the request)
   * @param password - The password of the user (extracted from the request)
   */
  validate(email: string, password: string): Promise<User> {
    return this.authService.login(email, password);
  }
}
