import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UserRole, UserStatus } from '@prisma/client';
import * as argon2 from 'argon2';

import { PrismaService } from '../prisma/prisma.service';
import { UsersService } from '../users/users.service';

import { AuthService } from './auth.service';

jest.mock('argon2', () => ({
  hash: jest.fn(),
  verify: jest.fn()
}));

describe('AuthService', () => {
  const prismaService = {
    user: {
      create: jest.fn(),
      update: jest.fn(),
      findUnique: jest.fn()
    }
  } as unknown as PrismaService;

  const usersService = {
    findByEmail: jest.fn(),
    findById: jest.fn()
  } as unknown as UsersService;

  const jwtService = {
    signAsync: jest.fn(),
    verifyAsync: jest.fn()
  } as unknown as JwtService;

  const configService = {
    getOrThrow: jest.fn().mockImplementation((key: string) => {
      if (key === 'JWT_SECRET') {
        return 'access-secret';
      }

      if (key === 'JWT_REFRESH_SECRET') {
        return 'refresh-secret';
      }

      return 'development';
    })
  } as unknown as ConfigService;

  const service = new AuthService(prismaService, usersService, jwtService, configService);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('registers a user and issues tokens', async () => {
    (argon2.hash as jest.Mock).mockResolvedValueOnce('hashed-password').mockResolvedValueOnce('hashed-refresh');
    (usersService.findByEmail as jest.Mock).mockResolvedValue(null);
    (prismaService.user.create as jest.Mock).mockResolvedValue({
      id: 'user-id',
      name: 'Ada',
      email: 'ada@velora.app',
      role: UserRole.AUTHOR,
      status: UserStatus.ACTIVE,
      avatar: null,
      bio: null,
      emailVerified: false
    });
    (prismaService.user.update as jest.Mock).mockResolvedValue({});
    (jwtService.signAsync as jest.Mock).mockResolvedValueOnce('access-token').mockResolvedValueOnce('refresh-token');

    const result = await service.register({
      name: 'Ada Lovelace',
      email: 'ada@velora.app',
      password: 'Str0ng!Password123'
    });

    expect(result.accessToken).toBe('access-token');
    expect(result.refreshToken).toBe('refresh-token');
    expect(prismaService.user.create).toHaveBeenCalled();
    expect(prismaService.user.update).toHaveBeenCalledWith(
      expect.objectContaining({
        data: { refreshTokenHash: 'hashed-refresh' }
      })
    );
  });

  it('logs in with valid credentials', async () => {
    (argon2.verify as jest.Mock).mockResolvedValue(true);
    (argon2.hash as jest.Mock).mockResolvedValue('hashed-refresh');
    (usersService.findByEmail as jest.Mock).mockResolvedValue({
      id: 'user-id',
      name: 'Ada',
      email: 'ada@velora.app',
      role: UserRole.AUTHOR,
      status: UserStatus.ACTIVE,
      avatar: null,
      bio: null,
      emailVerified: false,
      passwordHash: 'hashed-password'
    });
    (prismaService.user.update as jest.Mock).mockResolvedValue({});
    (jwtService.signAsync as jest.Mock).mockResolvedValueOnce('access-token').mockResolvedValueOnce('refresh-token');

    const result = await service.login({ email: 'ada@velora.app', password: 'Str0ng!Password123' });

    expect(result.user.email).toBe('ada@velora.app');
    expect(prismaService.user.update).toHaveBeenCalled();
  });

  it('refreshes an access token when the refresh token matches', async () => {
    (argon2.verify as jest.Mock).mockResolvedValue(true);
    (jwtService.verifyAsync as jest.Mock).mockResolvedValue({ sub: 'user-id' });
    (prismaService.user.findUnique as jest.Mock).mockResolvedValue({
      id: 'user-id',
      name: 'Ada',
      email: 'ada@velora.app',
      role: UserRole.AUTHOR,
      status: UserStatus.ACTIVE,
      avatar: null,
      bio: null,
      emailVerified: false,
      refreshTokenHash: 'hashed-refresh'
    });
    (jwtService.signAsync as jest.Mock).mockResolvedValueOnce('access-token').mockResolvedValueOnce('refresh-token');
    (prismaService.user.update as jest.Mock).mockResolvedValue({});

    const result = await service.refresh('refresh-token');

    expect(result.accessToken).toBe('access-token');
  });

  it('logs out by clearing the refresh token hash', async () => {
    (prismaService.user.update as jest.Mock).mockResolvedValue({});

    const result = await service.logout('user-id');

    expect(result).toEqual({ success: true });
    expect(prismaService.user.update).toHaveBeenCalledWith(
      expect.objectContaining({
        data: { refreshTokenHash: null }
      })
    );
  });
});