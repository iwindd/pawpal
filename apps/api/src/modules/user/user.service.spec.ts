import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Decimal } from '@prisma/client/runtime/client';
import { PrismaService } from '../prisma/prisma.service';
import { UserRepository } from './user.repository';
import { UserService } from './user.service';

describe('UserService', () => {
  let service: UserService;
  let userRepo: jest.Mocked<any>;
  let prisma: jest.Mocked<any>;

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
    updateEmail: jest.fn().mockResolvedValue(undefined),
    updateProfile: jest.fn().mockResolvedValue(undefined),
    ...overrides,
  });

  beforeEach(async () => {
    userRepo = {
      find: jest.fn(),
      findByEmail: jest.fn(),
      isAlreadyExist: jest.fn(),
      updateEmail: jest.fn(),
      updatePassword: jest.fn(),
    };

    prisma = {
      user: {
        findFirst: jest.fn(),
      },
      userSuspension: {
        create: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        { provide: UserRepository, useValue: userRepo },
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  // ─── changeEmail ─────────────────────────────────────────
  describe('changeEmail', () => {
    it('should change email when valid', async () => {
      userRepo.isAlreadyExist.mockResolvedValue(false);
      const mockUser = createMockUserEntity();
      userRepo.find.mockResolvedValue(mockUser);

      const result = await service.changeEmail('user-1', {
        newEmail: 'new@example.com',
        password: 'password123',
      });

      expect(mockUser.updateEmail).toHaveBeenCalledWith('new@example.com');
      expect(result).toEqual(mockSession);
    });

    it('should throw ConflictException when email already exists', async () => {
      userRepo.isAlreadyExist.mockResolvedValue(true);

      await expect(
        service.changeEmail('user-1', {
          newEmail: 'taken@example.com',
          password: 'password123',
        }),
      ).rejects.toThrow(ConflictException);
    });

    it('should throw UnauthorizedException when user not found', async () => {
      userRepo.isAlreadyExist.mockResolvedValue(false);
      userRepo.find.mockResolvedValue(null);

      await expect(
        service.changeEmail('bad-id', {
          newEmail: 'new@example.com',
          password: 'password123',
        }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException when password is wrong', async () => {
      userRepo.isAlreadyExist.mockResolvedValue(false);
      const mockUser = createMockUserEntity();
      mockUser.isValidPassword.mockResolvedValue(false);
      userRepo.find.mockResolvedValue(mockUser);

      await expect(
        service.changeEmail('user-1', {
          newEmail: 'new@example.com',
          password: 'wrong-pass',
        }),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  // ─── updateProfile ───────────────────────────────────────
  describe('updateProfile', () => {
    it('should update profile and return session', async () => {
      const mockUser = createMockUserEntity();
      userRepo.find.mockResolvedValue(mockUser);

      const result = await service.updateProfile('user-1', {
        displayName: 'New Name',
      });

      expect(mockUser.updateProfile).toHaveBeenCalledWith({
        displayName: 'New Name',
      });
      expect(result).toEqual(mockSession);
    });
  });

  // ─── adminResetEmail ─────────────────────────────────────
  describe('adminResetEmail', () => {
    it('should reset email when not taken', async () => {
      userRepo.isAlreadyExist.mockResolvedValue(false);
      userRepo.updateEmail.mockResolvedValue(undefined);

      const result = await service.adminResetEmail('user-1', 'new@example.com');

      expect(result).toEqual({ success: true });
    });

    it('should throw ConflictException when email taken', async () => {
      userRepo.isAlreadyExist.mockResolvedValue(true);

      await expect(
        service.adminResetEmail('user-1', 'taken@example.com'),
      ).rejects.toThrow(ConflictException);
    });
  });

  // ─── adminResetPassword ──────────────────────────────────
  describe('adminResetPassword', () => {
    it('should reset password', async () => {
      userRepo.updatePassword.mockResolvedValue(undefined);

      const result = await service.adminResetPassword('user-1', 'new-password');

      expect(userRepo.updatePassword).toHaveBeenCalledWith(
        'user-1',
        'new-password',
      );
      expect(result).toEqual({ success: true });
    });
  });

  // ─── getProfile ──────────────────────────────────────────
  describe('getProfile', () => {
    it('should return admin user response', async () => {
      prisma.user.findFirst.mockResolvedValue({
        id: 'user-1',
        email: 'test@example.com',
        displayName: 'Test User',
        avatar: null,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
        roles: [{ id: 'role-1', name: 'User' }],
        userWallets: [{ walletType: 'MAIN', balance: new Decimal(500) }],
        _count: { orders: 3 },
        suspensions: [],
      });

      const result = await service.getProfile('user-1');

      expect(result.id).toBe('user-1');
      expect(result.orderCount).toBe(3);
      expect(result.isSuspended).toBe(false);
    });

    it('should throw when user not found', async () => {
      prisma.user.findFirst.mockResolvedValue(null);

      await expect(service.getProfile('bad-id')).rejects.toThrow();
    });
  });

  // ─── suspendUser ─────────────────────────────────────────
  describe('suspendUser', () => {
    it('should create suspension record', async () => {
      const mockSuspension = {
        id: 'sus-1',
        userId: 'user-1',
        performedById: 'admin-1',
        type: 'SUSPENDED',
        note: 'Bad behavior',
      };
      prisma.userSuspension.create.mockResolvedValue(mockSuspension);

      const result = await service.suspendUser(
        'user-1',
        'admin-1',
        'Bad behavior',
      );

      expect(prisma.userSuspension.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          userId: 'user-1',
          performedById: 'admin-1',
          type: 'SUSPENDED',
          note: 'Bad behavior',
        }),
      });
      expect(result).toEqual(mockSuspension);
    });
  });

  // ─── unsuspendUser ───────────────────────────────────────
  describe('unsuspendUser', () => {
    it('should create unsuspension record', async () => {
      const mockUnsuspension = {
        id: 'sus-2',
        userId: 'user-1',
        performedById: 'admin-1',
        type: 'UNSUSPENDED',
      };
      prisma.userSuspension.create.mockResolvedValue(mockUnsuspension);

      const result = await service.unsuspendUser('user-1', 'admin-1');

      expect(prisma.userSuspension.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          userId: 'user-1',
          type: 'UNSUSPENDED',
        }),
      });
      expect(result).toEqual(mockUnsuspension);
    });
  });
});
