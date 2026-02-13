import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { UserRepository } from '../user/user.repository';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let userRepo: jest.Mocked<any>;
  let jwtService: jest.Mocked<any>;

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

  const createMockUserEntity = (overrides: Record<string, any> = {}) => ({
    id: 'user-1',
    email: 'test@example.com',
    displayName: 'Test User',
    isSuspended: false,
    toJSON: jest.fn().mockReturnValue(mockSession),
    isValidPassword: jest.fn().mockResolvedValue(true),
    updatePassword: jest.fn().mockResolvedValue(undefined),
    ...overrides,
  });

  beforeEach(async () => {
    userRepo = {
      find: jest.fn(),
      findByEmail: jest.fn(),
      create: jest.fn(),
      isAlreadyExist: jest.fn(),
    };

    jwtService = {
      sign: jest.fn().mockReturnValue('mock-jwt-token'),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UserRepository, useValue: userRepo },
        { provide: JwtService, useValue: jwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  // ─── verifyPayload ───────────────────────────────────────
  describe('verifyPayload', () => {
    it('should return session when user exists and is not suspended', async () => {
      const mockUser = createMockUserEntity();
      userRepo.find.mockResolvedValue(mockUser);

      const result = await service.verifyPayload({
        sub: 'user-1',
        iat: 0,
        exp: 0,
        id: '',
        email: '',
        displayName: '',
        avatar: '',
        createdAt: '',
        updatedAt: '',
        userWallet: undefined,
        roles: [],
        isSuspended: false,
      });

      expect(userRepo.find).toHaveBeenCalledWith('user-1');
      expect(mockUser.toJSON).toHaveBeenCalled();
      expect(result).toEqual(mockSession);
    });

    it('should throw UnauthorizedException when user not found', async () => {
      userRepo.find.mockResolvedValue(null);

      await expect(
        service.verifyPayload({
          sub: 'bad-id',
          iat: 0,
          exp: 0,
          id: '',
          email: '',
          displayName: '',
          avatar: '',
          createdAt: '',
          updatedAt: '',
          userWallet: undefined,
          roles: [],
          isSuspended: false,
        }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException when user is suspended', async () => {
      userRepo.find.mockResolvedValue(
        createMockUserEntity({ isSuspended: true }),
      );

      await expect(
        service.verifyPayload({
          sub: 'user-1',
          iat: 0,
          exp: 0,
          id: '',
          email: '',
          displayName: '',
          avatar: '',
          createdAt: '',
          updatedAt: '',
          userWallet: undefined,
          roles: [],
          isSuspended: false,
        }),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  // ─── login ───────────────────────────────────────────────
  describe('login', () => {
    it('should return session on valid credentials', async () => {
      const mockUser = createMockUserEntity();
      userRepo.findByEmail.mockResolvedValue(mockUser);

      const result = await service.login('test@example.com', 'password123');

      expect(userRepo.findByEmail).toHaveBeenCalledWith('test@example.com');
      expect(mockUser.isValidPassword).toHaveBeenCalledWith('password123');
      expect(result).toEqual(mockSession);
    });

    it('should throw UnauthorizedException when user not found', async () => {
      userRepo.findByEmail.mockResolvedValue(null);

      await expect(service.login('unknown@example.com', 'pwd')).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw UnauthorizedException on wrong password', async () => {
      const mockUser = createMockUserEntity();
      mockUser.isValidPassword.mockResolvedValue(false);
      userRepo.findByEmail.mockResolvedValue(mockUser);

      await expect(
        service.login('test@example.com', 'wrong-password'),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException when user is suspended', async () => {
      const mockUser = createMockUserEntity({ isSuspended: true });
      userRepo.findByEmail.mockResolvedValue(mockUser);

      await expect(
        service.login('test@example.com', 'password123'),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  // ─── register ────────────────────────────────────────────
  describe('register', () => {
    const registerPayload = {
      displayName: 'New User',
      email: 'new@example.com',
      password: 'securepassword',
      password_confirmation: 'securepassword',
      accept_conditions: true,
    };

    it('should create user and return session', async () => {
      userRepo.isAlreadyExist.mockResolvedValue(false);
      const mockUser = createMockUserEntity();
      userRepo.create.mockResolvedValue(mockUser);

      const result = await service.register(registerPayload);

      expect(userRepo.isAlreadyExist).toHaveBeenCalledWith('new@example.com');
      expect(userRepo.create).toHaveBeenCalledWith(
        expect.objectContaining({
          displayName: 'New User',
          email: 'new@example.com',
          password: 'securepassword',
        }),
      );
      expect(result).toEqual(mockSession);
    });

    it('should throw ConflictException when email already exists', async () => {
      userRepo.isAlreadyExist.mockResolvedValue(true);

      await expect(service.register(registerPayload)).rejects.toThrow(
        ConflictException,
      );
      expect(userRepo.create).not.toHaveBeenCalled();
    });
  });

  // ─── signToken ───────────────────────────────────────────
  describe('signToken', () => {
    it('should sign JWT with user id as sub', () => {
      const token = service.signToken(mockSession as any);

      expect(jwtService.sign).toHaveBeenCalledWith({ sub: 'user-1' });
      expect(token).toBe('mock-jwt-token');
    });
  });

  // ─── changePassword ──────────────────────────────────────
  describe('changePassword', () => {
    const changePayload = {
      oldPassword: 'old-pass',
      newPassword: 'new-pass',
      newPasswordConfirmation: 'new-pass',
    };

    it('should update password when old password is valid', async () => {
      const mockUser = createMockUserEntity();
      userRepo.find.mockResolvedValue(mockUser);

      await service.changePassword('user-1', changePayload);

      expect(userRepo.find).toHaveBeenCalledWith('user-1');
      expect(mockUser.isValidPassword).toHaveBeenCalledWith('old-pass');
      expect(mockUser.updatePassword).toHaveBeenCalledWith('new-pass');
    });

    it('should throw UnauthorizedException when user not found', async () => {
      userRepo.find.mockResolvedValue(null);

      await expect(
        service.changePassword('bad-id', changePayload),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException when old password is wrong', async () => {
      const mockUser = createMockUserEntity();
      mockUser.isValidPassword.mockResolvedValue(false);
      userRepo.find.mockResolvedValue(mockUser);

      await expect(
        service.changePassword('user-1', changePayload),
      ).rejects.toThrow(UnauthorizedException);
      expect(mockUser.updatePassword).not.toHaveBeenCalled();
    });
  });
});
