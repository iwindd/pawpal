import {
  ConflictException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  ChangeEmailInput,
  ChangePasswordInput,
  RegisterInput,
  Session,
  UpdateProfileInput,
} from '@pawpal/shared';
import { JwtPayload } from '../../common/interfaces/jwt-payload.interface';
import { UserRepository } from '../user/user.repository';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userRepo: UserRepository,
  ) {}

  /**
   * Verify the JWT payload
   * @param payload - The JWT payload
   * @returns The user
   */
  async verifyPayload(payload: JwtPayload): Promise<Session> {
    try {
      const user = await this.userRepo.find(payload.sub);

      return user.toJSON();
    } catch (error) {
      Logger.error('Verify payload failed : ', error);
      throw new UnauthorizedException('invalid_credentials');
    }
  }

  /**
   * Login a user
   * @param email user email
   * @param password user password
   * @returns user session
   */
  async login(email: string, password: string): Promise<Session> {
    const user = await this.userRepo.findByEmail(email);
    if (!(await user.isValidPassword(password)))
      throw new UnauthorizedException(`invalid_credentials`);

    return user.toJSON();
  }

  /**
   * Register a new user
   * @param userPayload user payload
   * @returns user session
   */
  async register(userPayload: RegisterInput): Promise<Session> {
    if (await this.userRepo.isAlreadyExist(userPayload.email))
      throw new ConflictException('email_already_exists');

    delete userPayload.password_confirmation;
    delete userPayload.accept_conditions;
    const user = await this.userRepo.create(userPayload);

    return user.toJSON();
  }

  /**
   * Sign a JWT token
   * @param user user session
   * @returns JWT token
   */
  signToken(user: Session): string {
    return this.jwtService.sign({
      sub: user.id,
    });
  }

  /**
   * Change user password
   * @param userId user id
   * @param payload change password payload
   */
  async changePassword(userId: string, payload: ChangePasswordInput) {
    const user = await this.userRepo.find(userId);

    if (!(await user.isValidPassword(payload.oldPassword)))
      throw new UnauthorizedException('invalid_old_password');

    user.updatePassword(payload.newPassword);
  }

  /**
   * Change user email
   * @param userId user id
   * @param payload change email payload
   * @returns user session
   */
  async changeEmail(userId: string, payload: ChangeEmailInput) {
    if (await this.userRepo.isAlreadyExist(payload.newEmail))
      throw new ConflictException('email_already_exists');

    const user = await this.userRepo.find(userId);
    if (!(await user.isValidPassword(payload.password)))
      throw new UnauthorizedException('invalid_old_password');

    user.updateEmail(payload.newEmail);

    return user.toJSON();
  }

  /**
   * Update user profile
   * @param userId user id
   * @param updateProfileData update profile data
   * @returns user session
   */
  async updateProfile(userId: string, payload: UpdateProfileInput) {
    const user = await this.userRepo.find(userId);
    user.updateProfile(payload);

    return user.toJSON();
  }
}
