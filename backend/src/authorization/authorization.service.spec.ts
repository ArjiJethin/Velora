import { ForbiddenException } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';

import { AuthorizationService } from './authorization.service';

describe('AuthorizationService', () => {
  const prismaService = {
    workspace: {
      findFirst: jest.fn()
    },
    book: {
      findFirst: jest.fn()
    },
    chapter: {
      findFirst: jest.fn()
    },
    page: {
      findFirst: jest.fn()
    },
    asset: {
      findFirst: jest.fn()
    }
  } as unknown as PrismaService;

  const service = new AuthorizationService(prismaService);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('allows the workspace owner to access their workspace', async () => {
    (prismaService.workspace.findFirst as jest.Mock).mockResolvedValue({ id: 'workspace-id' });

    await expect(service.ownsWorkspace('user-id', 'workspace-id')).resolves.toBe(true);

    expect(prismaService.workspace.findFirst).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          id: 'workspace-id',
          ownerId: 'user-id',
          deletedAt: null
        }
      })
    );
  });

  it('rejects non-owners from accessing a book', async () => {
    (prismaService.book.findFirst as jest.Mock).mockResolvedValue(null);

    await expect(service.ownsBook('user-id', 'book-id')).rejects.toBeInstanceOf(ForbiddenException);
  });

  it('rejects missing chapters with a forbidden response', async () => {
    (prismaService.chapter.findFirst as jest.Mock).mockResolvedValue(null);

    await expect(service.ownsChapter('user-id', 'chapter-id')).rejects.toBeInstanceOf(ForbiddenException);
  });

  it('allows the owner to access nested pages and assets', async () => {
    (prismaService.page.findFirst as jest.Mock).mockResolvedValue({ id: 'page-id' });
    (prismaService.asset.findFirst as jest.Mock).mockResolvedValue({ id: 'asset-id' });

    await expect(service.ownsPage('user-id', 'page-id')).resolves.toBe(true);
    await expect(service.ownsAsset('user-id', 'asset-id')).resolves.toBe(true);
  });

  it('maps book edit and publish checks to the same ownership rule', async () => {
    (prismaService.book.findFirst as jest.Mock).mockResolvedValue({ id: 'book-id' });

    await expect(service.canEditBook('user-id', 'book-id')).resolves.toBe(true);
    await expect(service.canPublishBook('user-id', 'book-id')).resolves.toBe(true);
  });
});