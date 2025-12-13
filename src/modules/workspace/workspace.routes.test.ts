import request from 'supertest';
import express from 'express';
import workspaceRoutes from './workspace.routes';
import { protect } from '../../middlewares/auth.middleware';
import * as workspaceService from './workspace.service';
import { globalErrorHandler } from '../../middlewares/error.middleware';

jest.mock('./workspace.service');
jest.mock('../../middlewares/auth.middleware');
jest.mock('uuid', () => ({
  v4: () => 'test-uuid'
}));

const app = express();
app.use(express.json());
app.use('/workspaces', workspaceRoutes);
app.use(globalErrorHandler);

describe('Workspace Routes', () => {
  const mockUser = { _id: 'user-123', email: 'test@test.com' };

  beforeEach(() => {
    jest.clearAllMocks();
    (protect as jest.Mock).mockImplementation((req, res, next) => {
      req.user = mockUser;
      next();
    });
  });

  describe('GET /workspaces', () => {
    it('should get all workspaces', async () => {
      const mockWorkspaces = [{ id: '1', name: 'Test Workspace' }];
      (workspaceService.getAllWorkspaces as jest.Mock).mockResolvedValue(mockWorkspaces);

      const response = await request(app).get('/workspaces');

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('success');
      expect(response.body.data).toEqual(mockWorkspaces);
    });
  });

  describe('POST /workspaces', () => {
    it('should create a new workspace', async () => {
      const workspaceData = {
        name: 'New Workspace',
        location: 'Lagos',
        stage: 'Planning',
        type: 'Residential',
        budget: '50000000'
      };
      const mockCreated = { id: 'new-123', ...workspaceData };
      (workspaceService.createWorkspace as jest.Mock).mockResolvedValue(mockCreated);

      const response = await request(app).post('/workspaces').send(workspaceData);

      expect(response.status).toBe(201);
      expect(response.body.status).toBe('success');
      expect(response.body.data).toEqual(mockCreated);
    });
  });

  describe('GET /workspaces/:id', () => {
    it('should get a single workspace', async () => {
      const mockWorkspace = { id: 'workspace-123', name: 'Test Workspace' };
      (workspaceService.getWorkspaceById as jest.Mock).mockResolvedValue(mockWorkspace);

      const response = await request(app).get('/workspaces/workspace-123');

      expect(response.status).toBe(200);
      expect(response.body.data).toEqual(mockWorkspace);
    });
  });

  describe('PUT /workspaces/:id', () => {
    it('should update a workspace', async () => {
      const updateData = { name: 'Updated Name' };
      const mockUpdated = { id: 'workspace-123', name: 'Updated Name' };
      (workspaceService.updateWorkspace as jest.Mock).mockResolvedValue(mockUpdated);

      const response = await request(app).put('/workspaces/workspace-123').send(updateData);

      expect(response.status).toBe(200);
      expect(response.body.data).toEqual(mockUpdated);
    });
  });

  describe('DELETE /workspaces/:id', () => {
    it('should delete a workspace', async () => {
      (workspaceService.deleteWorkspace as jest.Mock).mockResolvedValue(undefined);

      const response = await request(app).delete('/workspaces/workspace-123');

      expect(response.status).toBe(204);
    });
  });

  describe('PATCH /workspaces/:id/progress', () => {
    it('should update workspace progress', async () => {
      const mockUpdated = { id: 'workspace-123', progress: 75 };
      (workspaceService.updateProgress as jest.Mock).mockResolvedValue(mockUpdated);

      const response = await request(app)
        .patch('/workspaces/workspace-123/progress')
        .send({ progress: 75 });

      expect(response.status).toBe(200);
      expect(response.body.data).toEqual(mockUpdated);
    });
  });

  describe('PATCH /workspaces/:id/status', () => {
    it('should toggle workspace status', async () => {
      const mockUpdated = { id: 'workspace-123', status: 'Finished' };
      (workspaceService.toggleStatus as jest.Mock).mockResolvedValue(mockUpdated);

      const response = await request(app).patch('/workspaces/workspace-123/status');

      expect(response.status).toBe(200);
      expect(response.body.data).toEqual(mockUpdated);
    });
  });

  describe('GET /workspaces/:workspaceId/resources', () => {
    it('should get all resources', async () => {
      const mockResources = [{ id: '1', name: 'Cement' }];
      (workspaceService.getAllResources as jest.Mock).mockResolvedValue(mockResources);

      const response = await request(app).get('/workspaces/workspace-123/resources');

      expect(response.status).toBe(200);
      expect(response.body.data).toEqual(mockResources);
    });
  });

  describe('POST /workspaces/:workspaceId/resources', () => {
    it('should add a new resource', async () => {
      const resourceData = { name: 'Paint', quantity: 50, unit: 'L', threshold: 30 };
      const mockResource = { id: 'resource-1', ...resourceData };
      (workspaceService.addResource as jest.Mock).mockResolvedValue(mockResource);

      const response = await request(app)
        .post('/workspaces/workspace-123/resources')
        .send(resourceData);

      expect(response.status).toBe(201);
      expect(response.body.data).toEqual(mockResource);
    });
  });

  describe('PUT /workspaces/:workspaceId/resources', () => {
    it('should bulk replace resources', async () => {
      const resources = [{ name: 'Paint', quantity: 50, unit: 'L', threshold: 30 }];
      const mockResources = [{ id: 'resource-1', name: 'Paint' }];
      (workspaceService.bulkReplaceResources as jest.Mock).mockResolvedValue(mockResources);

      const response = await request(app)
        .put('/workspaces/workspace-123/resources')
        .send({ resources });

      expect(response.status).toBe(200);
      expect(response.body.data).toEqual(mockResources);
    });
  });

  describe('PUT /workspaces/:workspaceId/resources/:resourceId', () => {
    it('should update a resource', async () => {
      const updateData = { name: 'Updated Name' };
      const mockResource = { id: 'resource-1', name: 'Updated Name' };
      (workspaceService.updateResource as jest.Mock).mockResolvedValue(mockResource);

      const response = await request(app)
        .put('/workspaces/workspace-123/resources/resource-1')
        .send(updateData);

      expect(response.status).toBe(200);
      expect(response.body.data).toEqual(mockResource);
    });
  });

  describe('DELETE /workspaces/:workspaceId/resources/:resourceId', () => {
    it('should delete a resource', async () => {
      (workspaceService.deleteResource as jest.Mock).mockResolvedValue(undefined);

      const response = await request(app).delete('/workspaces/workspace-123/resources/resource-1');

      expect(response.status).toBe(204);
    });
  });

  describe('PATCH /workspaces/:workspaceId/resources/:resourceId/quantity', () => {
    it('should update resource quantity', async () => {
      const mockResource = { id: 'resource-1', quantity: 100 };
      (workspaceService.updateResourceQuantity as jest.Mock).mockResolvedValue(mockResource);

      const response = await request(app)
        .patch('/workspaces/workspace-123/resources/resource-1/quantity')
        .send({ quantity: 100 });

      expect(response.status).toBe(200);
      expect(response.body.data).toEqual(mockResource);
    });
  });

  describe('GET /workspaces/:workspaceId/architecture', () => {
    it('should get architecture plan', async () => {
      const mockPlan = { costEstimate: '₦50M', timeline: '12 months' };
      (workspaceService.getArchitecturePlan as jest.Mock).mockResolvedValue(mockPlan);

      const response = await request(app).get('/workspaces/workspace-123/architecture');

      expect(response.status).toBe(200);
      expect(response.body.data).toEqual(mockPlan);
    });
  });

  describe('POST /workspaces/:workspaceId/architecture', () => {
    it('should save architecture plan', async () => {
      const planData = {
        costEstimate: '₦50M',
        timeline: '12 months',
        materials: [],
        stages: [],
        summary: 'Plan'
      };
      (workspaceService.saveArchitecturePlan as jest.Mock).mockResolvedValue(planData);

      const response = await request(app)
        .post('/workspaces/workspace-123/architecture')
        .send(planData);

      expect(response.status).toBe(201);
      expect(response.body.data).toEqual(planData);
    });
  });

  describe('GET /workspaces/:workspaceId/safety-reports', () => {
    it('should get all safety reports', async () => {
      const mockReports = [{ id: 'report-1', riskScore: 30 }];
      (workspaceService.getAllSafetyReports as jest.Mock).mockResolvedValue(mockReports);

      const response = await request(app).get('/workspaces/workspace-123/safety-reports');

      expect(response.status).toBe(200);
      expect(response.body.data).toEqual(mockReports);
    });
  });

  describe('POST /workspaces/:workspaceId/safety-reports', () => {
    it('should save a safety report', async () => {
      const reportData = { riskScore: 30, hazards: [], summary: 'Report' };
      const mockReport = { id: 'report-1', date: '2024-12-13', ...reportData };
      (workspaceService.saveSafetyReport as jest.Mock).mockResolvedValue(mockReport);

      const response = await request(app)
        .post('/workspaces/workspace-123/safety-reports')
        .send(reportData);

      expect(response.status).toBe(201);
      expect(response.body.data).toEqual(mockReport);
    });
  });

  describe('GET /workspaces/:workspaceId/safety-reports/:reportId', () => {
    it('should get a single safety report', async () => {
      const mockReport = { id: 'report-1', riskScore: 30 };
      (workspaceService.getSafetyReportById as jest.Mock).mockResolvedValue(mockReport);

      const response = await request(app).get('/workspaces/workspace-123/safety-reports/report-1');

      expect(response.status).toBe(200);
      expect(response.body.data).toEqual(mockReport);
    });
  });

  describe('Authentication', () => {
    it('should require authentication for all routes', async () => {
      (protect as jest.Mock).mockImplementation((req, res, next) => {
        res.status(401).json({ message: 'Unauthorized' });
      });

      const response = await request(app).get('/workspaces');

      expect(response.status).toBe(401);
    });
  });
});
