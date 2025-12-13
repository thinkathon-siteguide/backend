import winston from 'winston';
import { config } from '../config/config';

describe('Logger', () => {
  beforeEach(() => {
    jest.resetModules();
  });

  it('should use debug level in development', () => {
    jest.mock('../config/config', () => ({
      config: { env: 'development' }
    }));
    const { logger } = require('./logger');
    expect(logger.level).toBe('debug');
  });

  it('should use warn level in production', () => {
    jest.mock('../config/config', () => ({
      config: { env: 'production' }
    }));
    const { logger } = require('./logger');
    expect(logger.level).toBe('warn');
  });
});
