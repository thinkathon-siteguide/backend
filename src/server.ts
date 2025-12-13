import app from './app';
import { config } from './config/config';
import { connectDatabase } from './core/database';
import { logger } from './core/logger';

const startServer = async () => {
  try {
    await connectDatabase();
    
    app.listen(config.port, () => {
      logger.info(`Server running in ${config.env} mode on port ${config.port}`);
    });
  } catch (error) {
    logger.error('Failed to start server', error);
    process.exit(1);
  }
};

startServer();
