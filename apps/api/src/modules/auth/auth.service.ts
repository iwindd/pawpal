import { PrismaAuditInfo } from '@/common/interfaces/prisma-audit.interface';
import { UserType } from '@/generated/prisma/enums';
import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ChangePasswordInput, RegisterInput, Session } from '@pawpal/shared';
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
    const user = await this.userRepo.find(payload.sub);

    if (!user) throw new UnauthorizedException('invalid_credentials');

    if (user.isSuspended) throw new UnauthorizedException('user_suspended');

    return user.toJSON();
  }

  /**
   * Login a user
   * @param email user email
   * @param password user password
   * @returns user session
   */
  async login(email: string, password: string): Promise<Session> {
    const user = await this.userRepo.findByEmail(email);

    if (!user) throw new UnauthorizedException(`invalid_credentials`);

    const isValidPassword = await user.isValidPassword(password);

    if (!isValidPassword)
      throw new UnauthorizedException(`invalid_credentials`);

    if (user.isSuspended) throw new UnauthorizedException('user_suspended');

    return user.toJSON();
  }

  /**
   * Impersonate a user
   * @param id target user id
   * @returns user session
   */
  async impersonate(id: string): Promise<Session> {
    const user = await this.userRepo.find(id);

    if (!user) throw new UnauthorizedException(`invalid_user`);
    if (user.isSuspended) throw new UnauthorizedException('user_suspended');

    return user.toJSON();
  }

  /**
   * Register a new user
   * @param userPayload user payload
   * @returns user session
   */
  async register(
    payload: RegisterInput,
    auditInfo?: PrismaAuditInfo,
  ): Promise<Session> {
    if (await this.userRepo.isAlreadyExist(payload.email))
      throw new ConflictException('email_already_exists');

    const user = await this.userRepo.create(
      {
        displayName: payload.displayName,
        email: payload.email,
        password: payload.password,
        userType: UserType.CUSTOMER,
      },
      auditInfo,
    );

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
  async changePassword(
    userId: string,
    payload: ChangePasswordInput,
    auditInfo?: PrismaAuditInfo,
  ) {
    const user = await this.userRepo.find(userId);

    if (!user) throw new UnauthorizedException('invalid_credentials');

    const isValidPassword = await user.isValidPassword(payload.oldPassword);

    if (!isValidPassword)
      throw new UnauthorizedException('invalid_old_password');

    user.updatePassword(payload.newPassword, auditInfo);
  }
}
