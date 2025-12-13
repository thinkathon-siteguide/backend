import request from 'supertest';
import express from 'express';
import resourceRoutes from './resource.routes';
import { protect } from '../../middlewares/auth.middleware';
import * as resourceService from './resource.service';
import { globalErrorHandler } from '../../middlewares/error.middleware';

jest.mock('./resource.service');
jest.mock('../../middlewares/auth.middleware');
jest.mock('uuid', () => ({
  v4: () => 'test-uuid'
}));

const app = express();
app.use(express.json());
app.use('/', resourceRoutes);
app.use(globalErrorHandler);

describe('Resource Routes', () => {
  const mockUser = { _id: 'user-123', email: 'test@test.com' };

  beforeEach(() => {
    jest.clearAllMocks();
    (protect as jest.Mock).mockImplementation((req, res, next) => {
      req.user = mockUser;
      next();
    });
  });

  describe('GET /:workspaceId/resources', () => {
    it('should get all resources', async () => {
      const mockResources = [{ id: '1', name: 'Cement' }];
      (resourceService.getAllResources as jest.Mock).mockResolvedValue(mockResources);

      const response = await request(app).get('/workspace-123/resources');

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('success');
      expect(response.body.data).toEqual(mockResources);
    });
  });

  describe('POST /:workspaceId/resources', () => {
    it('should add a new resource', async () => {
      const resourceData = { name: 'Paint', quantity: 50, unit: 'L', threshold: 30 };
      const mockResource = { id: 'resource-1', ...resourceData };
      (resourceService.addResource as jest.Mock).mockResolvedValue(mockResource);

      const response = await request(app)
        .post('/workspace-123/resources')
        .send(resourceData);

      expect(response.status).toBe(201);
      expect(response.body.status).toBe('success');
      expect(response.body.data).toEqual(mockResource);
    });
  });

  describe('GET /:workspaceId/resources/statistics', () => {
    it('should get resource statistics', async () => {
      const mockStats = {
        total: 10,
        critical: 2,
        low: 3,
        good: 5,
        totalQuantity: 500
      };
      (resourceService.getResourceStatistics as jest.Mock).mockResolvedValue(mockStats);

      const response = await request(app).get('/workspace-123/resources/statistics');

      expect(response.status).toBe(200);
      expect(response.body.data).toEqual(mockStats);
    });
  });

  describe('GET /:workspaceId/resources/:resourceId', () => {
    it('should get a specific resource', async () => {
      const mockResource = { id: 'resource-1', name: 'Cement' };
      (resourceService.getResourceById as jest.Mock).mockResolvedValue(mockResource);

      const response = await request(app).get('/workspace-123/resources/resource-1');

      expect(response.status).toBe(200);
      expect(response.body.data).toEqual(mockResource);
    });
  });

  describe('PUT /:workspaceId/resources/:resourceId', () => {
    it('should update a resource', async () => {
      const updateData = { name: 'Updated Name' };
      const mockResource = { id: 'resource-1', name: 'Updated Name' };
      (resourceService.updateResource as jest.Mock).mockResolvedValue(mockResource);

      const response = await request(app)
        .put('/workspace-123/resources/resource-1')
        .send(updateData);

      expect(response.status).toBe(200);
      expect(response.body.data).toEqual(mockResource);
    });
  });

  describe('DELETE /:workspaceId/resources/:resourceId', () => {
    it('should delete a resource', async () => {
      (resourceService.deleteResource as jest.Mock).mockResolvedValue(undefined);

      const response = await request(app).delete('/workspace-123/resources/resource-1');

      expect(response.status).toBe(204);
    });
  });

  describe('PATCH /:workspaceId/resources/:resourceId/quantity', () => {
    it('should update resource quantity', async () => {
      const mockResource = { id: 'resource-1', quantity: 100 };
      (resourceService.updateResourceQuantity as jest.Mock).mockResolvedValue(mockResource);

      const response = await request(app)
        .patch('/workspace-123/resources/resource-1/quantity')
        .send({ quantity: 100 });

      expect(response.status).toBe(200);
      expect(response.body.data).toEqual(mockResource);
    });
  });

  describe('PUT /:workspaceId/resources', () => {
    it('should bulk replace resources', async () => {
      const resources = [{ name: 'Paint', quantity: 50, unit: 'L', threshold: 30 }];
      const mockResources = [{ id: 'resource-1', name: 'Paint' }];
      (resourceService.bulkReplaceResources as jest.Mock).mockResolvedValue(mockResources);

      const response = await request(app)
        .put('/workspace-123/resources')
        .send({ resources });

      expect(response.status).toBe(200);
      expect(response.body.data).toEqual(mockResources);
    });
  });

  describe('Authentication', () => {
    it('should require authentication for all routes', async () => {
      (protect as jest.Mock).mockImplementation((req, res, next) => {
        res.status(401).json({ message: 'Unauthorized' });
      });

      const response = await request(app).get('/workspace-123/resources');

      expect(response.status).toBe(401);
    });
  });
});

