import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import { config } from './config/config';
import { globalErrorHandler } from './middlewares/error.middleware';
import { NotFoundError } from './core/error.response';

const app = express();

// Security Middleware
app.use(helmet());
app.use(cors({ origin: config.cors.origin }));
app.use(express.json({ limit: '10kb' })); // Body limit
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Routes
import { healthRoutes } from './modules/health/health.routes';
import { authRoutes } from './modules/auth/auth.routes';
import workspaceRoutes from './modules/workspace/workspace.routes';
import resourceRoutes from './modules/resource/resource.routes';
import architectureRoutes from './modules/architecture/architecture.routes';

app.use('/health', healthRoutes);
app.use('/auth', authRoutes);
app.use('/workspaces', workspaceRoutes);
app.use('/workspaces', resourceRoutes);
app.use('/workspaces', architectureRoutes);
app.get('/', (req, res) => {
  res.send('API is running');
});

// Catch 404 and forward to error handler
app.use((req, res, next) => {
  next(new NotFoundError());
});

// Global Error Handler
app.use(globalErrorHandler);

export default app;
