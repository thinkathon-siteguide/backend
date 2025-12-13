import request from 'supertest';
import express from 'express';
import architectureRoutes from './architecture.routes';
import { protect } from '../../middlewares/auth.middleware';
import * as architectureService from './architecture.service';
import { globalErrorHandler } from '../../middlewares/error.middleware';

jest.mock('./architecture.service');
jest.mock('../../middlewares/auth.middleware');

const app = express();
app.use(express.json());
app.use('/', architectureRoutes);
app.use(globalErrorHandler);

describe('Architecture Routes', () => {
  const mockUser = { _id: 'user-123', email: 'test@test.com' };

  beforeEach(() => {
    jest.clearAllMocks();
    (protect as jest.Mock).mockImplementation((req, res, next) => {
      req.user = mockUser;
      next();
    });
  });

  describe('GET /:workspaceId/architecture', () => {
    it('should get architecture plan', async () => {
      const mockPlan = {
        sections: [{ title: 'Foundation', description: 'Foundation work' }],
        materials: [{ name: 'Cement', quantity: '100', specification: 'Grade 53' }],
        stages: [{ phase: 'Phase 1', duration: '2 months', tasks: ['Task 1'] }],
        summary: 'Summary'
      };
      (architectureService.getArchitecturePlan as jest.Mock).mockResolvedValue(mockPlan);

      const response = await request(app).get('/workspace-123/architecture');

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('success');
      expect(response.body.data).toEqual(mockPlan);
    });
  });

  describe('POST /:workspaceId/architecture', () => {
    it('should save architecture plan', async () => {
      const planData = {
        sections: [{ title: 'Foundation', description: 'Foundation work' }],
        materials: [{ name: 'Cement', quantity: '100', specification: 'Grade 53' }],
        stages: [{ phase: 'Phase 1', duration: '2 months', tasks: ['Task 1'] }],
        summary: 'Summary'
      };
      const mockPlan = { ...planData, createdAt: new Date() };
      (architectureService.saveArchitecturePlan as jest.Mock).mockResolvedValue(mockPlan);

      const response = await request(app)
        .post('/workspace-123/architecture')
        .send(planData);

      expect(response.status).toBe(201);
      expect(response.body.status).toBe('success');
    });
  });

  describe('PUT /:workspaceId/architecture', () => {
    it('should update architecture plan', async () => {
      const updateData = { summary: 'Updated summary' };
      const mockPlan = { summary: 'Updated summary' };
      (architectureService.updateArchitecturePlan as jest.Mock).mockResolvedValue(mockPlan);

      const response = await request(app)
        .put('/workspace-123/architecture')
        .send(updateData);

      expect(response.status).toBe(200);
      expect(response.body.data).toEqual(mockPlan);
    });
  });

  describe('DELETE /:workspaceId/architecture', () => {
    it('should delete architecture plan', async () => {
      (architectureService.deleteArchitecturePlan as jest.Mock).mockResolvedValue(undefined);

      const response = await request(app).delete('/workspace-123/architecture');

      expect(response.status).toBe(204);
    });
  });

  describe('GET /:workspaceId/architecture/sections', () => {
    it('should get architecture sections', async () => {
      const mockSections = [{ title: 'Foundation', description: 'Foundation work' }];
      (architectureService.getArchitectureSections as jest.Mock).mockResolvedValue(mockSections);

      const response = await request(app).get('/workspace-123/architecture/sections');

      expect(response.status).toBe(200);
      expect(response.body.data).toEqual(mockSections);
    });
  });

  describe('POST /:workspaceId/architecture/sections', () => {
    it('should add architecture section', async () => {
      const sectionData = { title: 'New Section', description: 'New description' };
      const mockPlan = { sections: [sectionData] };
      (architectureService.addArchitectureSection as jest.Mock).mockResolvedValue(mockPlan);

      const response = await request(app)
        .post('/workspace-123/architecture/sections')
        .send(sectionData);

      expect(response.status).toBe(201);
      expect(response.body.data).toEqual(mockPlan);
    });
  });

  describe('GET /:workspaceId/architecture/materials', () => {
    it('should get architecture materials', async () => {
      const mockMaterials = [{ name: 'Cement', quantity: '100', specification: 'Grade 53' }];
      (architectureService.getArchitectureMaterials as jest.Mock).mockResolvedValue(mockMaterials);

      const response = await request(app).get('/workspace-123/architecture/materials');

      expect(response.status).toBe(200);
      expect(response.body.data).toEqual(mockMaterials);
    });
  });

  describe('POST /:workspaceId/architecture/materials', () => {
    it('should add architecture material', async () => {
      const materialData = { name: 'Steel', quantity: '50', specification: 'Grade A' };
      const mockPlan = { materials: [materialData] };
      (architectureService.addArchitectureMaterial as jest.Mock).mockResolvedValue(mockPlan);

      const response = await request(app)
        .post('/workspace-123/architecture/materials')
        .send(materialData);

      expect(response.status).toBe(201);
      expect(response.body.data).toEqual(mockPlan);
    });
  });

  describe('GET /:workspaceId/architecture/stages', () => {
    it('should get architecture stages', async () => {
      const mockStages = [{ phase: 'Phase 1', duration: '2 months', tasks: ['Task 1'] }];
      (architectureService.getArchitectureStages as jest.Mock).mockResolvedValue(mockStages);

      const response = await request(app).get('/workspace-123/architecture/stages');

      expect(response.status).toBe(200);
      expect(response.body.data).toEqual(mockStages);
    });
  });

  describe('POST /:workspaceId/architecture/stages', () => {
    it('should add architecture stage', async () => {
      const stageData = { phase: 'Phase 2', duration: '3 months', tasks: ['Task 2'] };
      const mockPlan = { stages: [stageData] };
      (architectureService.addArchitectureStage as jest.Mock).mockResolvedValue(mockPlan);

      const response = await request(app)
        .post('/workspace-123/architecture/stages')
        .send(stageData);

      expect(response.status).toBe(201);
      expect(response.body.data).toEqual(mockPlan);
    });
  });

  describe('Authentication', () => {
    it('should require authentication for all routes', async () => {
      (protect as jest.Mock).mockImplementation((req, res, next) => {
        res.status(401).json({ message: 'Unauthorized' });
      });

      const response = await request(app).get('/workspace-123/architecture');

      expect(response.status).toBe(401);
    });
  });
});

