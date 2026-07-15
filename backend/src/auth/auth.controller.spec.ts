import { AuthController } from './auth.controller';

describe('AuthController', () => {
  const authService = {
    register: jest.fn(),
    login: jest.fn(),
    refresh: jest.fn(),
    logout: jest.fn(),
    me: jest.fn()
  };

  const controller = new AuthController(authService as never);

  it('delegates register', async () => {
    authService.register.mockResolvedValue({ ok: true });

    await expect(
      controller.register({ name: 'Ada', email: 'ada@velora.app', password: 'Str0ng!Password123' })
    ).resolves.toEqual({ ok: true });
  });

  it('delegates login', async () => {
    authService.login.mockResolvedValue({ ok: true });

    await expect(controller.login({ email: 'ada@velora.app', password: 'Str0ng!Password123' })).resolves.toEqual({
      ok: true
    });
  });

  it('delegates refresh', async () => {
    authService.refresh.mockResolvedValue({ ok: true });

    await expect(controller.refresh({ refreshToken: 'refresh-token' })).resolves.toEqual({ ok: true });
  });

  it('delegates logout', async () => {
    authService.logout.mockResolvedValue({ success: true });

    await expect(controller.logout('user-id')).resolves.toEqual({ success: true });
  });

  it('delegates me', async () => {
    authService.me.mockResolvedValue({ id: 'user-id' });

    await expect(controller.me('user-id')).resolves.toEqual({ id: 'user-id' });
  });
});