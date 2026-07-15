import { Injectable, NotFoundException } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';

import { UpdateMeDto } from './dto/update-me.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prismaService: PrismaService) {}

  findByEmail(email: string) {
    return this.prismaService.user.findUnique({
      where: { email: email.toLowerCase() }
    });
  }

  findById(id: string) {
    return this.prismaService.user.findUnique({
      where: { id }
    });
  }

  async updateMe(userId: string, dto: UpdateMeDto) {
    const user = await this.prismaService.user.findUnique({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException('User not found.');
    }

    return this.prismaService.user.update({
      where: { id: userId },
      data: {
        ...(dto.name ? { name: dto.name } : {}),
        ...(dto.avatar !== undefined ? { avatar: dto.avatar } : {}),
        ...(dto.bio !== undefined ? { bio: dto.bio } : {})
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
        avatar: true,
        bio: true,
        emailVerified: true
      }
    });
  }
}