import mongoose from 'mongoose';
import { config } from '../config/config';
import { logger } from './logger';

export const connectDatabase = async (): Promise<void> => {
  try {
    await mongoose.connect(config.mongo.uri);
    logger.info('Connected to MongoDB');
  } catch (error) {
    logger.error('Could not connect to MongoDB', error);
    process.exit(1);
  }
};

mongoose.connection.on('disconnected', () => {
  logger.warn('MongoDB disconnected');
});
