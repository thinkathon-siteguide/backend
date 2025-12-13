import { Request, Response, NextFunction } from 'express';
import * as workspaceController from './workspace.controller';
import * as workspaceService from './workspace.service';
import { AuthRequest } from '../../middlewares/auth.middleware';

jest.mock('./workspace.service');
jest.mock('uuid', () => ({
  v4: () => 'test-uuid'
}));

describe('Workspace Controller', () => {
  let mockReq: Partial<AuthRequest>;
  let mockRes: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    mockReq = {
      user: { _id: 'user-123' },
      params: {},
      body: {},
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    mockNext = jest.fn();
    jest.clearAllMocks();
  });

  describe('getAllWorkspaces', () => {
    it('should return all workspaces', async () => {
      const mockWorkspaces = [{ id: '1', name: 'Test Workspace' }];
      (workspaceService.getAllWorkspaces as jest.Mock).mockResolvedValue(
        mockWorkspaces
      );

      await workspaceController.getAllWorkspaces(
        mockReq as AuthRequest,
        mockRes as Response,
        mockNext
      );

      expect(workspaceService.getAllWorkspaces).toHaveBeenCalledWith('user-123');
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          status: 'success',
          data: mockWorkspaces,
        })
      );
    });

    it('should call next with error on failure', async () => {
      const error = new Error('Service error');
      (workspaceService.getAllWorkspaces as jest.Mock).mockRejectedValue(error);

      await workspaceController.getAllWorkspaces(
        mockReq as AuthRequest,
        mockRes as Response,
        mockNext
      );

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe('getWorkspace', () => {
    it('should return a single workspace', async () => {
      mockReq.params = { id: 'workspace-123' };
      const mockWorkspace = { id: 'workspace-123', name: 'Test Workspace' };
      (workspaceService.getWorkspaceById as jest.Mock).mockResolvedValue(
        mockWorkspace
      );

      await workspaceController.getWorkspace(
        mockReq as AuthRequest,
        mockRes as Response,
        mockNext
      );

      expect(workspaceService.getWorkspaceById).toHaveBeenCalledWith(
        'workspace-123',
        'user-123'
      );
      expect(mockRes.status).toHaveBeenCalledWith(200);
    });

    it('should call next with error on failure', async () => {
      mockReq.params = { id: 'workspace-123' };
      const error = new Error('Not found');
      (workspaceService.getWorkspaceById as jest.Mock).mockRejectedValue(error);

      await workspaceController.getWorkspace(
        mockReq as AuthRequest,
        mockRes as Response,
        mockNext
      );

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe('createWorkspace', () => {
    it('should create a new workspace', async () => {
      const workspaceData = {
        name: 'New Workspace',
        location: 'Lagos',
        stage: 'Planning',
        type: 'Residential',
        budget: '50000000',
      };
      mockReq.body = workspaceData;
      const mockCreated = { id: 'new-123', ...workspaceData };
      (workspaceService.createWorkspace as jest.Mock).mockResolvedValue(mockCreated);

      await workspaceController.createWorkspace(
        mockReq as AuthRequest,
        mockRes as Response,
        mockNext
      );

      expect(workspaceService.createWorkspace).toHaveBeenCalledWith(
        'user-123',
        workspaceData
      );
      expect(mockRes.status).toHaveBeenCalledWith(201);
    });

    it('should call next with error on failure', async () => {
      const error = new Error('Creation failed');
      (workspaceService.createWorkspace as jest.Mock).mockRejectedValue(error);

      await workspaceController.createWorkspace(
        mockReq as AuthRequest,
        mockRes as Response,
        mockNext
      );

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe('updateWorkspace', () => {
    it('should update a workspace', async () => {
      mockReq.params = { id: 'workspace-123' };
      mockReq.body = { name: 'Updated Name' };
      const mockUpdated = { id: 'workspace-123', name: 'Updated Name' };
      (workspaceService.updateWorkspace as jest.Mock).mockResolvedValue(mockUpdated);

      await workspaceController.updateWorkspace(
        mockReq as AuthRequest,
        mockRes as Response,
        mockNext
      );

      expect(workspaceService.updateWorkspace).toHaveBeenCalledWith(
        'workspace-123',
        'user-123',
        { name: 'Updated Name' }
      );
      expect(mockRes.status).toHaveBeenCalledWith(200);
    });

    it('should call next with error on failure', async () => {
      mockReq.params = { id: 'workspace-123' };
      const error = new Error('Update failed');
      (workspaceService.updateWorkspace as jest.Mock).mockRejectedValue(error);

      await workspaceController.updateWorkspace(
        mockReq as AuthRequest,
        mockRes as Response,
        mockNext
      );

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe('deleteWorkspace', () => {
    it('should delete a workspace', async () => {
      mockReq.params = { id: 'workspace-123' };
      (workspaceService.deleteWorkspace as jest.Mock).mockResolvedValue(undefined);

      await workspaceController.deleteWorkspace(
        mockReq as AuthRequest,
        mockRes as Response,
        mockNext
      );

      expect(workspaceService.deleteWorkspace).toHaveBeenCalledWith(
        'workspace-123',
        'user-123'
      );
      expect(mockRes.status).toHaveBeenCalledWith(204);
    });

    it('should call next with error on failure', async () => {
      mockReq.params = { id: 'workspace-123' };
      const error = new Error('Delete failed');
      (workspaceService.deleteWorkspace as jest.Mock).mockRejectedValue(error);

      await workspaceController.deleteWorkspace(
        mockReq as AuthRequest,
        mockRes as Response,
        mockNext
      );

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe('updateProgress', () => {
    it('should update workspace progress', async () => {
      mockReq.params = { id: 'workspace-123' };
      mockReq.body = { progress: 75 };
      const mockUpdated = { id: 'workspace-123', progress: 75 };
      (workspaceService.updateProgress as jest.Mock).mockResolvedValue(mockUpdated);

      await workspaceController.updateProgress(
        mockReq as AuthRequest,
        mockRes as Response,
        mockNext
      );

      expect(workspaceService.updateProgress).toHaveBeenCalledWith(
        'workspace-123',
        'user-123',
        75
      );
      expect(mockRes.status).toHaveBeenCalledWith(200);
    });

    it('should call next with error on failure', async () => {
      mockReq.params = { id: 'workspace-123' };
      mockReq.body = { progress: 75 };
      const error = new Error('Update failed');
      (workspaceService.updateProgress as jest.Mock).mockRejectedValue(error);

      await workspaceController.updateProgress(
        mockReq as AuthRequest,
        mockRes as Response,
        mockNext
      );

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe('toggleStatus', () => {
    it('should toggle workspace status', async () => {
      mockReq.params = { id: 'workspace-123' };
      const mockUpdated = { id: 'workspace-123', status: 'Finished' };
      (workspaceService.toggleStatus as jest.Mock).mockResolvedValue(mockUpdated);

      await workspaceController.toggleStatus(
        mockReq as AuthRequest,
        mockRes as Response,
        mockNext
      );

      expect(workspaceService.toggleStatus).toHaveBeenCalledWith(
        'workspace-123',
        'user-123'
      );
      expect(mockRes.status).toHaveBeenCalledWith(200);
    });

    it('should call next with error on failure', async () => {
      mockReq.params = { id: 'workspace-123' };
      const error = new Error('Toggle failed');
      (workspaceService.toggleStatus as jest.Mock).mockRejectedValue(error);

      await workspaceController.toggleStatus(
        mockReq as AuthRequest,
        mockRes as Response,
        mockNext
      );

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe('getAllResources', () => {
    it('should return all resources', async () => {
      mockReq.params = { workspaceId: 'workspace-123' };
      const mockResources = [{ id: '1', name: 'Cement' }];
      (workspaceService.getAllResources as jest.Mock).mockResolvedValue(
        mockResources
      );

      await workspaceController.getAllResources(
        mockReq as AuthRequest,
        mockRes as Response,
        mockNext
      );

      expect(workspaceService.getAllResources).toHaveBeenCalledWith(
        'workspace-123',
        'user-123'
      );
      expect(mockRes.status).toHaveBeenCalledWith(200);
    });

    it('should call next with error on failure', async () => {
      mockReq.params = { workspaceId: 'workspace-123' };
      const error = new Error('Fetch failed');
      (workspaceService.getAllResources as jest.Mock).mockRejectedValue(error);

      await workspaceController.getAllResources(
        mockReq as AuthRequest,
        mockRes as Response,
        mockNext
      );

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe('addResource', () => {
    it('should add a new resource', async () => {
      mockReq.params = { workspaceId: 'workspace-123' };
      mockReq.body = { name: 'Paint', quantity: 50, unit: 'L', threshold: 30 };
      const mockResource = { id: 'resource-1', ...mockReq.body };
      (workspaceService.addResource as jest.Mock).mockResolvedValue(mockResource);

      await workspaceController.addResource(
        mockReq as AuthRequest,
        mockRes as Response,
        mockNext
      );

      expect(workspaceService.addResource).toHaveBeenCalledWith(
        'workspace-123',
        'user-123',
        mockReq.body
      );
      expect(mockRes.status).toHaveBeenCalledWith(201);
    });

    it('should call next with error on failure', async () => {
      mockReq.params = { workspaceId: 'workspace-123' };
      const error = new Error('Add failed');
      (workspaceService.addResource as jest.Mock).mockRejectedValue(error);

      await workspaceController.addResource(
        mockReq as AuthRequest,
        mockRes as Response,
        mockNext
      );

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe('updateResourceQuantity', () => {
    it('should update resource quantity', async () => {
      mockReq.params = { workspaceId: 'workspace-123', resourceId: 'resource-1' };
      mockReq.body = { quantity: 100 };
      const mockResource = { id: 'resource-1', quantity: 100 };
      (workspaceService.updateResourceQuantity as jest.Mock).mockResolvedValue(
        mockResource
      );

      await workspaceController.updateResourceQuantity(
        mockReq as AuthRequest,
        mockRes as Response,
        mockNext
      );

      expect(workspaceService.updateResourceQuantity).toHaveBeenCalledWith(
        'workspace-123',
        'resource-1',
        'user-123',
        100
      );
      expect(mockRes.status).toHaveBeenCalledWith(200);
    });

    it('should call next with error on failure', async () => {
      mockReq.params = { workspaceId: 'workspace-123', resourceId: 'resource-1' };
      mockReq.body = { quantity: 100 };
      const error = new Error('Update failed');
      (workspaceService.updateResourceQuantity as jest.Mock).mockRejectedValue(error);

      await workspaceController.updateResourceQuantity(
        mockReq as AuthRequest,
        mockRes as Response,
        mockNext
      );

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe('updateResource', () => {
    it('should update resource', async () => {
      mockReq.params = { workspaceId: 'workspace-123', resourceId: 'resource-1' };
      mockReq.body = { name: 'Updated Name' };
      const mockResource = { id: 'resource-1', name: 'Updated Name' };
      (workspaceService.updateResource as jest.Mock).mockResolvedValue(mockResource);

      await workspaceController.updateResource(
        mockReq as AuthRequest,
        mockRes as Response,
        mockNext
      );

      expect(workspaceService.updateResource).toHaveBeenCalledWith(
        'workspace-123',
        'resource-1',
        'user-123',
        mockReq.body
      );
      expect(mockRes.status).toHaveBeenCalledWith(200);
    });

    it('should call next with error on failure', async () => {
      mockReq.params = { workspaceId: 'workspace-123', resourceId: 'resource-1' };
      const error = new Error('Update failed');
      (workspaceService.updateResource as jest.Mock).mockRejectedValue(error);

      await workspaceController.updateResource(
        mockReq as AuthRequest,
        mockRes as Response,
        mockNext
      );

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe('deleteResource', () => {
    it('should delete resource', async () => {
      mockReq.params = { workspaceId: 'workspace-123', resourceId: 'resource-1' };
      (workspaceService.deleteResource as jest.Mock).mockResolvedValue(undefined);

      await workspaceController.deleteResource(
        mockReq as AuthRequest,
        mockRes as Response,
        mockNext
      );

      expect(workspaceService.deleteResource).toHaveBeenCalledWith(
        'workspace-123',
        'resource-1',
        'user-123'
      );
      expect(mockRes.status).toHaveBeenCalledWith(204);
    });

    it('should call next with error on failure', async () => {
      mockReq.params = { workspaceId: 'workspace-123', resourceId: 'resource-1' };
      const error = new Error('Delete failed');
      (workspaceService.deleteResource as jest.Mock).mockRejectedValue(error);

      await workspaceController.deleteResource(
        mockReq as AuthRequest,
        mockRes as Response,
        mockNext
      );

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe('bulkReplaceResources', () => {
    it('should bulk replace resources', async () => {
      mockReq.params = { workspaceId: 'workspace-123' };
      mockReq.body = {
        resources: [{ name: 'Paint', quantity: 50, unit: 'L', threshold: 30 }],
      };
      const mockResources = [{ id: 'resource-1', name: 'Paint' }];
      (workspaceService.bulkReplaceResources as jest.Mock).mockResolvedValue(
        mockResources
      );

      await workspaceController.bulkReplaceResources(
        mockReq as AuthRequest,
        mockRes as Response,
        mockNext
      );

      expect(workspaceService.bulkReplaceResources).toHaveBeenCalledWith(
        'workspace-123',
        'user-123',
        mockReq.body.resources
      );
      expect(mockRes.status).toHaveBeenCalledWith(200);
    });

    it('should call next with error on failure', async () => {
      mockReq.params = { workspaceId: 'workspace-123' };
      const error = new Error('Replace failed');
      (workspaceService.bulkReplaceResources as jest.Mock).mockRejectedValue(error);

      await workspaceController.bulkReplaceResources(
        mockReq as AuthRequest,
        mockRes as Response,
        mockNext
      );

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe('saveArchitecturePlan', () => {
    it('should save architecture plan', async () => {
      mockReq.params = { workspaceId: 'workspace-123' };
      mockReq.body = {
        costEstimate: '₦50M',
        timeline: '12 months',
        materials: [],
        stages: [],
        summary: 'Plan',
      };
      (workspaceService.saveArchitecturePlan as jest.Mock).mockResolvedValue(
        mockReq.body
      );

      await workspaceController.saveArchitecturePlan(
        mockReq as AuthRequest,
        mockRes as Response,
        mockNext
      );

      expect(workspaceService.saveArchitecturePlan).toHaveBeenCalledWith(
        'workspace-123',
        'user-123',
        mockReq.body
      );
      expect(mockRes.status).toHaveBeenCalledWith(201);
    });

    it('should call next with error on failure', async () => {
      mockReq.params = { workspaceId: 'workspace-123' };
      const error = new Error('Save failed');
      (workspaceService.saveArchitecturePlan as jest.Mock).mockRejectedValue(error);

      await workspaceController.saveArchitecturePlan(
        mockReq as AuthRequest,
        mockRes as Response,
        mockNext
      );

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe('getArchitecturePlan', () => {
    it('should get architecture plan', async () => {
      mockReq.params = { workspaceId: 'workspace-123' };
      const mockPlan = { costEstimate: '₦50M', timeline: '12 months' };
      (workspaceService.getArchitecturePlan as jest.Mock).mockResolvedValue(mockPlan);

      await workspaceController.getArchitecturePlan(
        mockReq as AuthRequest,
        mockRes as Response,
        mockNext
      );

      expect(workspaceService.getArchitecturePlan).toHaveBeenCalledWith(
        'workspace-123',
        'user-123'
      );
      expect(mockRes.status).toHaveBeenCalledWith(200);
    });

    it('should call next with error on failure', async () => {
      mockReq.params = { workspaceId: 'workspace-123' };
      const error = new Error('Fetch failed');
      (workspaceService.getArchitecturePlan as jest.Mock).mockRejectedValue(error);

      await workspaceController.getArchitecturePlan(
        mockReq as AuthRequest,
        mockRes as Response,
        mockNext
      );

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe('saveSafetyReport', () => {
    it('should save safety report', async () => {
      mockReq.params = { workspaceId: 'workspace-123' };
      mockReq.body = { riskScore: 30, hazards: [], summary: 'Report' };
      const mockReport = { id: 'report-1', ...mockReq.body };
      (workspaceService.saveSafetyReport as jest.Mock).mockResolvedValue(mockReport);

      await workspaceController.saveSafetyReport(
        mockReq as AuthRequest,
        mockRes as Response,
        mockNext
      );

      expect(workspaceService.saveSafetyReport).toHaveBeenCalledWith(
        'workspace-123',
        'user-123',
        mockReq.body
      );
      expect(mockRes.status).toHaveBeenCalledWith(201);
    });

    it('should call next with error on failure', async () => {
      mockReq.params = { workspaceId: 'workspace-123' };
      const error = new Error('Save failed');
      (workspaceService.saveSafetyReport as jest.Mock).mockRejectedValue(error);

      await workspaceController.saveSafetyReport(
        mockReq as AuthRequest,
        mockRes as Response,
        mockNext
      );

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe('getAllSafetyReports', () => {
    it('should get all safety reports', async () => {
      mockReq.params = { workspaceId: 'workspace-123' };
      const mockReports = [{ id: 'report-1', riskScore: 30 }];
      (workspaceService.getAllSafetyReports as jest.Mock).mockResolvedValue(
        mockReports
      );

      await workspaceController.getAllSafetyReports(
        mockReq as AuthRequest,
        mockRes as Response,
        mockNext
      );

      expect(workspaceService.getAllSafetyReports).toHaveBeenCalledWith(
        'workspace-123',
        'user-123'
      );
      expect(mockRes.status).toHaveBeenCalledWith(200);
    });

    it('should call next with error on failure', async () => {
      mockReq.params = { workspaceId: 'workspace-123' };
      const error = new Error('Fetch failed');
      (workspaceService.getAllSafetyReports as jest.Mock).mockRejectedValue(error);

      await workspaceController.getAllSafetyReports(
        mockReq as AuthRequest,
        mockRes as Response,
        mockNext
      );

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe('getSafetyReport', () => {
    it('should get a single safety report', async () => {
      mockReq.params = { workspaceId: 'workspace-123', reportId: 'report-1' };
      const mockReport = { id: 'report-1', riskScore: 30 };
      (workspaceService.getSafetyReportById as jest.Mock).mockResolvedValue(
        mockReport
      );

      await workspaceController.getSafetyReport(
        mockReq as AuthRequest,
        mockRes as Response,
        mockNext
      );

      expect(workspaceService.getSafetyReportById).toHaveBeenCalledWith(
        'workspace-123',
        'report-1',
        'user-123'
      );
      expect(mockRes.status).toHaveBeenCalledWith(200);
    });

    it('should call next with error on failure', async () => {
      mockReq.params = { workspaceId: 'workspace-123', reportId: 'report-1' };
      const error = new Error('Fetch failed');
      (workspaceService.getSafetyReportById as jest.Mock).mockRejectedValue(error);

      await workspaceController.getSafetyReport(
        mockReq as AuthRequest,
        mockRes as Response,
        mockNext
      );

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });
});

