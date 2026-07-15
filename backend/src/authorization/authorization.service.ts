import { ForbiddenException, Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuthorizationService {
  constructor(private readonly prismaService: PrismaService) {}

  async ownsWorkspace(userId: string, workspaceId: string): Promise<true> {
    const workspace = await this.prismaService.workspace.findFirst({
      where: {
        id: workspaceId,
        ownerId: userId,
        deletedAt: null
      },
      select: { id: true }
    });

    this.ensureAccessible(workspace);

    return true;
  }

  async ownsBook(userId: string, bookId: string): Promise<true> {
    const book = await this.prismaService.book.findFirst({
      where: {
        id: bookId,
        deletedAt: null,
        workspace: {
          ownerId: userId,
          deletedAt: null
        }
      },
      select: { id: true }
    });

    this.ensureAccessible(book);

    return true;
  }

  async ownsChapter(userId: string, chapterId: string): Promise<true> {
    const chapter = await this.prismaService.chapter.findFirst({
      where: {
        id: chapterId,
        deletedAt: null,
        bookContent: {
          deletedAt: null,
          book: {
            deletedAt: null,
            workspace: {
              ownerId: userId,
              deletedAt: null
            }
          }
        }
      },
      select: { id: true }
    });

    this.ensureAccessible(chapter);

    return true;
  }

  async ownsPage(userId: string, pageId: string): Promise<true> {
    const page = await this.prismaService.page.findFirst({
      where: {
        id: pageId,
        deletedAt: null,
        chapter: {
          deletedAt: null,
          bookContent: {
            deletedAt: null,
            book: {
              deletedAt: null,
              workspace: {
                ownerId: userId,
                deletedAt: null
              }
            }
          }
        }
      },
      select: { id: true }
    });

    this.ensureAccessible(page);

    return true;
  }

  async ownsAsset(userId: string, assetId: string): Promise<true> {
    const asset = await this.prismaService.asset.findFirst({
      where: {
        id: assetId,
        deletedAt: null,
        workspace: {
          ownerId: userId,
          deletedAt: null
        }
      },
      select: { id: true }
    });

    this.ensureAccessible(asset);

    return true;
  }

  async canEditBook(userId: string, bookId: string): Promise<true> {
    return this.ownsBook(userId, bookId);
  }

  async canPublishBook(userId: string, bookId: string): Promise<true> {
    return this.ownsBook(userId, bookId);
  }

  private ensureAccessible(entity: { id: string } | null): asserts entity is { id: string } {
    if (!entity) {
      throw new ForbiddenException('You do not have permission to access this resource.');
    }
  }
}