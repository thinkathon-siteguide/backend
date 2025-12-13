import request from 'supertest';
import express from 'express';
import { globalErrorHandler } from './error.middleware';
import { BadRequestError } from '../core/error.response';
import { config } from '../config/config';

describe('Global Error Handler', () => {
  let app: express.Application;

  beforeEach(() => {
    app = express();
    app.use(express.json());
  });

  it('should handle ApiError', async () => {
    app.get('/error', (req, res, next) => {
      next(new BadRequestError('Test Bad Request'));
    });
    app.use(globalErrorHandler);

    const res = await request(app).get('/error');
    expect(res.status).toBe(400);
    expect(res.body).toEqual({
      status: 'error',
      code: 400,
      type: 'BadRequestError',
      message: 'Test Bad Request',
    });
  });

  it('should handle unexpected errors in production', async () => {
    const originalEnv = config.env;
    config.env = 'production';

    app.get('/error', (req, res, next) => {
      next(new Error('Unexpected Error'));
    });
    app.use(globalErrorHandler);

    const res = await request(app).get('/error');
    expect(res.status).toBe(500);
    expect(res.body).toEqual({
      status: 'error',
      code: 500,
      type: 'InternalError',
      message: 'Internal Server Error',
    });

    config.env = originalEnv;
  });

  it('should handle unexpected errors in development', async () => {
    const originalEnv = config.env;
    config.env = 'development';

    app.get('/error', (req, res, next) => {
      next(new Error('Unexpected Error'));
    });
    app.use(globalErrorHandler);

    const res = await request(app).get('/error');
    expect(res.status).toBe(500);
    expect(res.body).toHaveProperty('message', 'Unexpected Error');
    expect(res.body).toHaveProperty('stack');

    config.env = originalEnv;
  });
});
