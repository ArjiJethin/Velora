import { Controller, Get, HttpStatus, Res } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiServiceUnavailableResponse, ApiTags } from '@nestjs/swagger';
import type { Response } from 'express';

import { HealthService } from './health.service';

@ApiTags('Health')
@Controller('health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get()
  @ApiOperation({ summary: 'Check backend and database health' })
  @ApiOkResponse({
    schema: {
      example: {
        status: 'ok',
        service: 'Velora Backend',
        version: '1.0.0',
        environment: 'development',
        database: 'connected',
        timestamp: '2026-07-13T10:00:00.000Z',
        uptime: 123.45
      }
    }
  })
  @ApiServiceUnavailableResponse({
    schema: {
      example: {
        status: 'error',
        database: 'disconnected',
        message: 'Database connection failed.'
      }
    }
  })
  async check(@Res({ passthrough: true }) response: Response): Promise<Record<string, unknown>> {
    const result = await this.healthService.check();

    if (result.database === 'disconnected') {
      response.status(HttpStatus.SERVICE_UNAVAILABLE);
      return {
        status: 'error',
        database: 'disconnected',
        message: 'Database connection failed.'
      };
    }

    return result;
  }
}