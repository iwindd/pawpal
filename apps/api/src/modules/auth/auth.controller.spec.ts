import {UnauthorizedException} from '@nestjs/common';
import {Test, TestingModule} from '@nestjs/testing';
import {AuthController} from './auth.controller';
import {AuthService} from './auth.service';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: jest.Mocked<any>;

  const mockSession = {
    id: 'user-1',
    email: 'test@example.com',
    displayName: 'Test User',
    avatar: null,
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
    userWallet: {},
    roles: [{ id: 'role-1', name: 'User' }],
    isSuspended: false,
  };

  beforeEach(async () => {
    authService = {
      register: jest.fn(),
      changePassword: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: authService }],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  // ─── GET /auth/profile ───────────────────────────────────
  describe('profile', () => {
    it('should return the authenticated user session', () => {
      const result = controller.profile(mockSession as any);
      expect(result).toEqual(mockSession);
    });
  });

  // ─── POST /auth/login ───────────────────────────────────
  describe('login', () => {
    it('should return user session (authentication handled by LocalAuthGuard)', async () => {
      const result = await controller.login(mockSession as any);
      expect(result).toEqual(mockSession);
    });
  });

  // ─── POST /auth/admin/login ──────────────────────────────
  describe('adminLogin', () => {
    it('should return session when user has Admin role', async () => {
      const adminSession = {
        ...mockSession,
        roles: [{ id: 'role-1', name: 'Admin' }],
      };

      const result = await controller.adminLogin(adminSession as any);
      expect(result).toEqual(adminSession);
    });

    it('should throw UnauthorizedException when user is not Admin', async () => {
      await expect(controller.adminLogin(mockSession as any)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw UnauthorizedException with user_not_admin message', async () => {
      await expect(controller.adminLogin(mockSession as any)).rejects.toThrow(
        'user_not_admin',
      );
    });
  });

  // ─── POST /auth/logout ──────────────────────────────────
  describe('logout', () => {
    it('should return null (cookie clearing handled by LogoutInterceptor)', async () => {
      const result = await controller.logout(mockSession as any);
      expect(result).toBeNull();
    });
  });

  // ─── POST /auth/register ────────────────────────────────
  describe('register', () => {
    it('should delegate to authService.register and return session', async () => {
      const registerBody = {
        displayName: 'New User',
        email: 'new@example.com',
        password: 'securepassword',
        password_confirmation: 'securepassword',
        accept_conditions: true,
      };
      authService.register.mockResolvedValue(mockSession);

      const result = await controller.register(registerBody, {});

      expect(authService.register).toHaveBeenCalledWith(registerBody);
      expect(result).toEqual(mockSession);
    });
  });

  // ─── POST /auth/change-password ─────────────────────────
  describe('changePassword', () => {
    it('should delegate to authService.changePassword', async () => {
      const changeBody = {
        oldPassword: 'old-pass',
        newPassword: 'new-pass',
        newPasswordConfirmation: 'new-pass',
      };
      authService.changePassword.mockResolvedValue(undefined);

      await controller.changePassword(mockSession as any, changeBody, {});

      expect(authService.changePassword).toHaveBeenCalledWith(
        'user-1',
        changeBody,
      );
    });
  });
});
