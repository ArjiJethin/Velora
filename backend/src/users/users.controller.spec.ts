import { UsersController } from './users.controller';

describe('UsersController', () => {
  it('delegates profile updates to the service', async () => {
    const usersService = {
      updateMe: jest.fn().mockResolvedValue({ id: 'user-id', name: 'Ada' })
    };
    const controller = new UsersController(usersService as never);

    await expect(
      controller.updateMe('user-id', {
        name: 'Ada Lovelace',
        avatar: 'https://cdn.velora.app/avatar.png',
        bio: 'Writer'
      })
    ).resolves.toEqual({ id: 'user-id', name: 'Ada' });

    expect(usersService.updateMe).toHaveBeenCalledWith('user-id', {
      name: 'Ada Lovelace',
      avatar: 'https://cdn.velora.app/avatar.png',
      bio: 'Writer'
    });
  });
});