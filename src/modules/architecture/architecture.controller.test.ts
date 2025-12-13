import { Response, NextFunction } from 'express';
import * as architectureController from './architecture.controller';
import * as architectureService from './architecture.service';
import { AuthRequest } from '../../middlewares/auth.middleware';

jest.mock('./architecture.service');

describe('Architecture Controller', () => {
  let mockReq: Partial<AuthRequest>;
  let mockRes: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    mockReq = {
      user: { _id: 'user-123' },
      params: {},
      body: {}
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    };
    mockNext = jest.fn();
    jest.clearAllMocks();
  });

  describe('saveArchitecturePlan', () => {
    it('should save architecture plan', async () => {
      mockReq.params = { workspaceId: 'workspace-123' };
      mockReq.body = {
        sections: [{ title: 'Foundation', description: 'Foundation work' }],
        materials: [{ name: 'Cement', quantity: '100', specification: 'Grade 53' }],
        stages: [{ phase: 'Phase 1', duration: '2 months', tasks: ['Task 1'] }],
        summary: 'Summary'
      };
      const mockPlan = { ...mockReq.body, createdAt: new Date() };
      (architectureService.saveArchitecturePlan as jest.Mock).mockResolvedValue(mockPlan);

      await architectureController.saveArchitecturePlan(
        mockReq as AuthRequest,
        mockRes as Response,
        mockNext
      );

      expect(architectureService.saveArchitecturePlan).toHaveBeenCalledWith(
        'workspace-123',
        'user-123',
        mockReq.body
      );
      expect(mockRes.status).toHaveBeenCalledWith(201);
    });

    it('should call next with error on failure', async () => {
      mockReq.params = { workspaceId: 'workspace-123' };
      const error = new Error('Save failed');
      (architectureService.saveArchitecturePlan as jest.Mock).mockRejectedValue(error);

      await architectureController.saveArchitecturePlan(
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
      const mockPlan = {
        sections: [],
        materials: [],
        stages: [],
        summary: 'Summary'
      };
      (architectureService.getArchitecturePlan as jest.Mock).mockResolvedValue(mockPlan);

      await architectureController.getArchitecturePlan(
        mockReq as AuthRequest,
        mockRes as Response,
        mockNext
      );

      expect(architectureService.getArchitecturePlan).toHaveBeenCalledWith(
        'workspace-123',
        'user-123'
      );
      expect(mockRes.status).toHaveBeenCalledWith(200);
    });

    it('should call next with error on failure', async () => {
      mockReq.params = { workspaceId: 'workspace-123' };
      const error = new Error('Get failed');
      (architectureService.getArchitecturePlan as jest.Mock).mockRejectedValue(error);

      await architectureController.getArchitecturePlan(
        mockReq as AuthRequest,
        mockRes as Response,
        mockNext
      );

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe('updateArchitecturePlan', () => {
    it('should update architecture plan', async () => {
      mockReq.params = { workspaceId: 'workspace-123' };
      mockReq.body = { summary: 'Updated summary' };
      const mockPlan = { summary: 'Updated summary' };
      (architectureService.updateArchitecturePlan as jest.Mock).mockResolvedValue(mockPlan);

      await architectureController.updateArchitecturePlan(
        mockReq as AuthRequest,
        mockRes as Response,
        mockNext
      );

      expect(architectureService.updateArchitecturePlan).toHaveBeenCalledWith(
        'workspace-123',
        'user-123',
        mockReq.body
      );
      expect(mockRes.status).toHaveBeenCalledWith(200);
    });

    it('should call next with error on failure', async () => {
      mockReq.params = { workspaceId: 'workspace-123' };
      const error = new Error('Update failed');
      (architectureService.updateArchitecturePlan as jest.Mock).mockRejectedValue(error);

      await architectureController.updateArchitecturePlan(
        mockReq as AuthRequest,
        mockRes as Response,
        mockNext
      );

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe('deleteArchitecturePlan', () => {
    it('should delete architecture plan', async () => {
      mockReq.params = { workspaceId: 'workspace-123' };
      (architectureService.deleteArchitecturePlan as jest.Mock).mockResolvedValue(undefined);

      await architectureController.deleteArchitecturePlan(
        mockReq as AuthRequest,
        mockRes as Response,
        mockNext
      );

      expect(architectureService.deleteArchitecturePlan).toHaveBeenCalledWith(
        'workspace-123',
        'user-123'
      );
      expect(mockRes.status).toHaveBeenCalledWith(204);
    });

    it('should call next with error on failure', async () => {
      mockReq.params = { workspaceId: 'workspace-123' };
      const error = new Error('Delete failed');
      (architectureService.deleteArchitecturePlan as jest.Mock).mockRejectedValue(error);

      await architectureController.deleteArchitecturePlan(
        mockReq as AuthRequest,
        mockRes as Response,
        mockNext
      );

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe('getArchitectureSections', () => {
    it('should get architecture sections', async () => {
      mockReq.params = { workspaceId: 'workspace-123' };
      const mockSections = [{ title: 'Foundation', description: 'Foundation work' }];
      (architectureService.getArchitectureSections as jest.Mock).mockResolvedValue(mockSections);

      await architectureController.getArchitectureSections(
        mockReq as AuthRequest,
        mockRes as Response,
        mockNext
      );

      expect(architectureService.getArchitectureSections).toHaveBeenCalledWith(
        'workspace-123',
        'user-123'
      );
      expect(mockRes.status).toHaveBeenCalledWith(200);
    });

    it('should call next with error on failure', async () => {
      mockReq.params = { workspaceId: 'workspace-123' };
      const error = new Error('Get failed');
      (architectureService.getArchitectureSections as jest.Mock).mockRejectedValue(error);

      await architectureController.getArchitectureSections(
        mockReq as AuthRequest,
        mockRes as Response,
        mockNext
      );

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe('getArchitectureMaterials', () => {
    it('should get architecture materials', async () => {
      mockReq.params = { workspaceId: 'workspace-123' };
      const mockMaterials = [{ name: 'Cement', quantity: '100', specification: 'Grade 53' }];
      (architectureService.getArchitectureMaterials as jest.Mock).mockResolvedValue(mockMaterials);

      await architectureController.getArchitectureMaterials(
        mockReq as AuthRequest,
        mockRes as Response,
        mockNext
      );

      expect(architectureService.getArchitectureMaterials).toHaveBeenCalledWith(
        'workspace-123',
        'user-123'
      );
      expect(mockRes.status).toHaveBeenCalledWith(200);
    });

    it('should call next with error on failure', async () => {
      mockReq.params = { workspaceId: 'workspace-123' };
      const error = new Error('Get failed');
      (architectureService.getArchitectureMaterials as jest.Mock).mockRejectedValue(error);

      await architectureController.getArchitectureMaterials(
        mockReq as AuthRequest,
        mockRes as Response,
        mockNext
      );

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe('getArchitectureStages', () => {
    it('should get architecture stages', async () => {
      mockReq.params = { workspaceId: 'workspace-123' };
      const mockStages = [{ phase: 'Phase 1', duration: '2 months', tasks: ['Task 1'] }];
      (architectureService.getArchitectureStages as jest.Mock).mockResolvedValue(mockStages);

      await architectureController.getArchitectureStages(
        mockReq as AuthRequest,
        mockRes as Response,
        mockNext
      );

      expect(architectureService.getArchitectureStages).toHaveBeenCalledWith(
        'workspace-123',
        'user-123'
      );
      expect(mockRes.status).toHaveBeenCalledWith(200);
    });

    it('should call next with error on failure', async () => {
      mockReq.params = { workspaceId: 'workspace-123' };
      const error = new Error('Get failed');
      (architectureService.getArchitectureStages as jest.Mock).mockRejectedValue(error);

      await architectureController.getArchitectureStages(
        mockReq as AuthRequest,
        mockRes as Response,
        mockNext
      );

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe('addArchitectureSection', () => {
    it('should add architecture section', async () => {
      mockReq.params = { workspaceId: 'workspace-123' };
      mockReq.body = { title: 'New Section', description: 'New description' };
      const mockPlan = { sections: [mockReq.body] };
      (architectureService.addArchitectureSection as jest.Mock).mockResolvedValue(mockPlan);

      await architectureController.addArchitectureSection(
        mockReq as AuthRequest,
        mockRes as Response,
        mockNext
      );

      expect(architectureService.addArchitectureSection).toHaveBeenCalledWith(
        'workspace-123',
        'user-123',
        mockReq.body
      );
      expect(mockRes.status).toHaveBeenCalledWith(201);
    });

    it('should call next with error on failure', async () => {
      mockReq.params = { workspaceId: 'workspace-123' };
      const error = new Error('Add failed');
      (architectureService.addArchitectureSection as jest.Mock).mockRejectedValue(error);

      await architectureController.addArchitectureSection(
        mockReq as AuthRequest,
        mockRes as Response,
        mockNext
      );

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe('addArchitectureMaterial', () => {
    it('should add architecture material', async () => {
      mockReq.params = { workspaceId: 'workspace-123' };
      mockReq.body = { name: 'Steel', quantity: '50', specification: 'Grade A' };
      const mockPlan = { materials: [mockReq.body] };
      (architectureService.addArchitectureMaterial as jest.Mock).mockResolvedValue(mockPlan);

      await architectureController.addArchitectureMaterial(
        mockReq as AuthRequest,
        mockRes as Response,
        mockNext
      );

      expect(architectureService.addArchitectureMaterial).toHaveBeenCalledWith(
        'workspace-123',
        'user-123',
        mockReq.body
      );
      expect(mockRes.status).toHaveBeenCalledWith(201);
    });

    it('should call next with error on failure', async () => {
      mockReq.params = { workspaceId: 'workspace-123' };
      const error = new Error('Add failed');
      (architectureService.addArchitectureMaterial as jest.Mock).mockRejectedValue(error);

      await architectureController.addArchitectureMaterial(
        mockReq as AuthRequest,
        mockRes as Response,
        mockNext
      );

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe('addArchitectureStage', () => {
    it('should add architecture stage', async () => {
      mockReq.params = { workspaceId: 'workspace-123' };
      mockReq.body = { phase: 'Phase 2', duration: '3 months', tasks: ['Task 2'] };
      const mockPlan = { stages: [mockReq.body] };
      (architectureService.addArchitectureStage as jest.Mock).mockResolvedValue(mockPlan);

      await architectureController.addArchitectureStage(
        mockReq as AuthRequest,
        mockRes as Response,
        mockNext
      );

      expect(architectureService.addArchitectureStage).toHaveBeenCalledWith(
        'workspace-123',
        'user-123',
        mockReq.body
      );
      expect(mockRes.status).toHaveBeenCalledWith(201);
    });

    it('should call next with error on failure', async () => {
      mockReq.params = { workspaceId: 'workspace-123' };
      const error = new Error('Add failed');
      (architectureService.addArchitectureStage as jest.Mock).mockRejectedValue(error);

      await architectureController.addArchitectureStage(
        mockReq as AuthRequest,
        mockRes as Response,
        mockNext
      );

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });
});

