import { Response, NextFunction } from 'express';
import * as resourceController from './resource.controller';
import * as resourceService from './resource.service';
import { AuthRequest } from '../../middlewares/auth.middleware';

jest.mock('./resource.service');
jest.mock('uuid', () => ({
  v4: () => 'test-uuid'
}));

describe('Resource Controller', () => {
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

  describe('getAllResources', () => {
    it('should return all resources', async () => {
      mockReq.params = { workspaceId: 'workspace-123' };
      const mockResources = [{ id: '1', name: 'Cement' }];
      (resourceService.getAllResources as jest.Mock).mockResolvedValue(mockResources);

      await resourceController.getAllResources(
        mockReq as AuthRequest,
        mockRes as Response,
        mockNext
      );

      expect(resourceService.getAllResources).toHaveBeenCalledWith(
        'workspace-123',
        'user-123'
      );
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          status: 'success',
          data: mockResources
        })
      );
    });

    it('should call next with error on failure', async () => {
      mockReq.params = { workspaceId: 'workspace-123' };
      const error = new Error('Fetch failed');
      (resourceService.getAllResources as jest.Mock).mockRejectedValue(error);

      await resourceController.getAllResources(
        mockReq as AuthRequest,
        mockRes as Response,
        mockNext
      );

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe('getResource', () => {
    it('should return a specific resource', async () => {
      mockReq.params = { workspaceId: 'workspace-123', resourceId: 'resource-1' };
      const mockResource = { id: 'resource-1', name: 'Cement' };
      (resourceService.getResourceById as jest.Mock).mockResolvedValue(mockResource);

      await resourceController.getResource(
        mockReq as AuthRequest,
        mockRes as Response,
        mockNext
      );

      expect(resourceService.getResourceById).toHaveBeenCalledWith(
        'workspace-123',
        'resource-1',
        'user-123'
      );
      expect(mockRes.status).toHaveBeenCalledWith(200);
    });

    it('should call next with error on failure', async () => {
      mockReq.params = { workspaceId: 'workspace-123', resourceId: 'resource-1' };
      const error = new Error('Not found');
      (resourceService.getResourceById as jest.Mock).mockRejectedValue(error);

      await resourceController.getResource(
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
      (resourceService.addResource as jest.Mock).mockResolvedValue(mockResource);

      await resourceController.addResource(
        mockReq as AuthRequest,
        mockRes as Response,
        mockNext
      );

      expect(resourceService.addResource).toHaveBeenCalledWith(
        'workspace-123',
        'user-123',
        mockReq.body
      );
      expect(mockRes.status).toHaveBeenCalledWith(201);
    });

    it('should call next with error on failure', async () => {
      mockReq.params = { workspaceId: 'workspace-123' };
      const error = new Error('Add failed');
      (resourceService.addResource as jest.Mock).mockRejectedValue(error);

      await resourceController.addResource(
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
      (resourceService.updateResourceQuantity as jest.Mock).mockResolvedValue(mockResource);

      await resourceController.updateResourceQuantity(
        mockReq as AuthRequest,
        mockRes as Response,
        mockNext
      );

      expect(resourceService.updateResourceQuantity).toHaveBeenCalledWith(
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
      (resourceService.updateResourceQuantity as jest.Mock).mockRejectedValue(error);

      await resourceController.updateResourceQuantity(
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
      (resourceService.updateResource as jest.Mock).mockResolvedValue(mockResource);

      await resourceController.updateResource(
        mockReq as AuthRequest,
        mockRes as Response,
        mockNext
      );

      expect(resourceService.updateResource).toHaveBeenCalledWith(
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
      (resourceService.updateResource as jest.Mock).mockRejectedValue(error);

      await resourceController.updateResource(
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
      (resourceService.deleteResource as jest.Mock).mockResolvedValue(undefined);

      await resourceController.deleteResource(
        mockReq as AuthRequest,
        mockRes as Response,
        mockNext
      );

      expect(resourceService.deleteResource).toHaveBeenCalledWith(
        'workspace-123',
        'resource-1',
        'user-123'
      );
      expect(mockRes.status).toHaveBeenCalledWith(204);
    });

    it('should call next with error on failure', async () => {
      mockReq.params = { workspaceId: 'workspace-123', resourceId: 'resource-1' };
      const error = new Error('Delete failed');
      (resourceService.deleteResource as jest.Mock).mockRejectedValue(error);

      await resourceController.deleteResource(
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
        resources: [{ name: 'Paint', quantity: 50, unit: 'L', threshold: 30 }]
      };
      const mockResources = [{ id: 'resource-1', name: 'Paint' }];
      (resourceService.bulkReplaceResources as jest.Mock).mockResolvedValue(mockResources);

      await resourceController.bulkReplaceResources(
        mockReq as AuthRequest,
        mockRes as Response,
        mockNext
      );

      expect(resourceService.bulkReplaceResources).toHaveBeenCalledWith(
        'workspace-123',
        'user-123',
        mockReq.body.resources
      );
      expect(mockRes.status).toHaveBeenCalledWith(200);
    });

    it('should call next with error on failure', async () => {
      mockReq.params = { workspaceId: 'workspace-123' };
      const error = new Error('Replace failed');
      (resourceService.bulkReplaceResources as jest.Mock).mockRejectedValue(error);

      await resourceController.bulkReplaceResources(
        mockReq as AuthRequest,
        mockRes as Response,
        mockNext
      );

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe('getResourceStatistics', () => {
    it('should return resource statistics', async () => {
      mockReq.params = { workspaceId: 'workspace-123' };
      const mockStats = {
        total: 10,
        critical: 2,
        low: 3,
        good: 5,
        totalQuantity: 500
      };
      (resourceService.getResourceStatistics as jest.Mock).mockResolvedValue(mockStats);

      await resourceController.getResourceStatistics(
        mockReq as AuthRequest,
        mockRes as Response,
        mockNext
      );

      expect(resourceService.getResourceStatistics).toHaveBeenCalledWith(
        'workspace-123',
        'user-123'
      );
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          status: 'success',
          data: mockStats
        })
      );
    });

    it('should call next with error on failure', async () => {
      mockReq.params = { workspaceId: 'workspace-123' };
      const error = new Error('Stats failed');
      (resourceService.getResourceStatistics as jest.Mock).mockRejectedValue(error);

      await resourceController.getResourceStatistics(
        mockReq as AuthRequest,
        mockRes as Response,
        mockNext
      );

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });
});

