import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { PrismaService } from '../prisma/prisma.service';

export type HealthStatus = {
  status: 'ok' | 'error';
  service?: string;
  version?: string;
  environment?: string;
  database: 'connected' | 'disconnected';
  timestamp?: string;
  uptime?: number;
};

@Injectable()
export class HealthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly configService: ConfigService
  ) {}

  async check(): Promise<HealthStatus> {
    const databaseConnected = await this.isDatabaseConnected();

    if (!databaseConnected) {
      return {
        status: 'error',
        database: 'disconnected'
      };
    }

    return {
      status: 'ok',
      service: 'Velora Backend',
      version: '1.0.0',
      environment: this.configService.get<string>('NODE_ENV') ?? 'development',
      database: 'connected',
      timestamp: new Date().toISOString(),
      uptime: process.uptime()
    };
  }

  private async isDatabaseConnected(): Promise<boolean> {
    try {
      await this.prismaService.$queryRaw`SELECT 1`;
      return true;
    } catch {
      return false;
    }
  }
}