import { HttpStatus } from '@nestjs/common';

import { HealthController } from './health.controller';

describe('HealthController', () => {
  it('returns ok health payload when the database is connected', async () => {
    const healthService = {
      check: jest.fn().mockResolvedValue({
        status: 'ok',
        service: 'Velora Backend',
        version: '1.0.0',
        environment: 'development',
        database: 'connected',
        timestamp: '2026-07-13T10:00:00.000Z',
        uptime: 10
      })
    };
    const controller = new HealthController(healthService as never);
    const response = { status: jest.fn() };

    const result = await controller.check(response as never);

    expect(result.status).toBe('ok');
    expect(response.status).not.toHaveBeenCalled();
  });

  it('returns service unavailable when the database is disconnected', async () => {
    const healthService = {
      check: jest.fn().mockResolvedValue({ status: 'error', database: 'disconnected' })
    };
    const controller = new HealthController(healthService as never);
    const response = { status: jest.fn() };

    const result = await controller.check(response as never);

    expect(response.status).toHaveBeenCalledWith(HttpStatus.SERVICE_UNAVAILABLE);
    expect(result).toEqual({
      status: 'error',
      database: 'disconnected',
      message: 'Database connection failed.'
    });
  });
});