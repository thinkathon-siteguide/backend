import * as resourceService from './resource.service';
import { Workspace } from '../workspace/models/Workspace';
import { BadRequestError, NotFoundError } from '../../core/error.response';

jest.mock('../workspace/models/Workspace');
jest.mock('uuid', () => ({
  v4: () => 'test-uuid-123'
}));

describe('Resource Service', () => {
  const mockUserId = '507f1f77bcf86cd799439011';
  const mockWorkspaceId = '507f1f77bcf86cd799439012';
  const mockResourceId = 'resource-1';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllResources', () => {
    it('should return all resources for a workspace', async () => {
      const mockResources = [
        { id: '1', name: 'Cement', quantity: 100, unit: 'Bags', threshold: 50, status: 'Good' }
      ];

      const mockWorkspace = {
        resources: mockResources
      };

      (Workspace.findOne as jest.Mock) = jest.fn().mockResolvedValue(mockWorkspace);

      const result = await resourceService.getAllResources(mockWorkspaceId, mockUserId);

      expect(Workspace.findOne).toHaveBeenCalledWith({ _id: mockWorkspaceId, userId: mockUserId });
      expect(result).toEqual(mockResources);
    });

    it('should throw NotFoundError if workspace does not exist', async () => {
      (Workspace.findOne as jest.Mock) = jest.fn().mockResolvedValue(null);

      await expect(
        resourceService.getAllResources(mockWorkspaceId, mockUserId)
      ).rejects.toThrow(NotFoundError);
    });
  });

  describe('addResource', () => {
    it('should add a new resource to workspace', async () => {
      const resourceData = {
        name: 'Paint',
        quantity: 50,
        unit: 'L',
        threshold: 30
      };

      const mockWorkspace = {
        resources: [],
        save: jest.fn().mockResolvedValue(true)
      };

      (Workspace.findOne as jest.Mock) = jest.fn().mockResolvedValue(mockWorkspace);

      const result = await resourceService.addResource(
        mockWorkspaceId,
        mockUserId,
        resourceData
      );

      expect(mockWorkspace.resources).toHaveLength(1);
      expect(result.name).toBe(resourceData.name);
      expect(result.quantity).toBe(resourceData.quantity);
      expect(result.status).toBe('Good');
      expect(result.id).toBe('test-uuid-123');
      expect(mockWorkspace.save).toHaveBeenCalled();
    });

    it('should throw BadRequestError if required fields are missing', async () => {
      const incompleteData = { name: 'Paint' } as any;

      await expect(
        resourceService.addResource(mockWorkspaceId, mockUserId, incompleteData)
      ).rejects.toThrow(BadRequestError);
    });

    it('should throw BadRequestError if quantity is negative', async () => {
      const invalidData = {
        name: 'Paint',
        quantity: -10,
        unit: 'L',
        threshold: 30
      };

      await expect(
        resourceService.addResource(mockWorkspaceId, mockUserId, invalidData)
      ).rejects.toThrow(BadRequestError);
    });

    it('should throw BadRequestError if threshold is negative', async () => {
      const invalidData = {
        name: 'Paint',
        quantity: 50,
        unit: 'L',
        threshold: -10
      };

      await expect(
        resourceService.addResource(mockWorkspaceId, mockUserId, invalidData)
      ).rejects.toThrow(BadRequestError);
    });

    it('should set status to Low when quantity <= threshold', async () => {
      const resourceData = {
        name: 'Paint',
        quantity: 20,
        unit: 'L',
        threshold: 30
      };

      const mockWorkspace = {
        resources: [],
        save: jest.fn().mockResolvedValue(true)
      };

      (Workspace.findOne as jest.Mock) = jest.fn().mockResolvedValue(mockWorkspace);

      const result = await resourceService.addResource(
        mockWorkspaceId,
        mockUserId,
        resourceData
      );

      expect(result.status).toBe('Low');
    });

    it('should set status to Critical when quantity <= threshold * 0.5', async () => {
      const resourceData = {
        name: 'Paint',
        quantity: 10,
        unit: 'L',
        threshold: 30
      };

      const mockWorkspace = {
        resources: [],
        save: jest.fn().mockResolvedValue(true)
      };

      (Workspace.findOne as jest.Mock) = jest.fn().mockResolvedValue(mockWorkspace);

      const result = await resourceService.addResource(
        mockWorkspaceId,
        mockUserId,
        resourceData
      );

      expect(result.status).toBe('Critical');
    });

    it('should throw NotFoundError if workspace does not exist', async () => {
      const resourceData = {
        name: 'Paint',
        quantity: 50,
        unit: 'L',
        threshold: 30
      };

      (Workspace.findOne as jest.Mock) = jest.fn().mockResolvedValue(null);

      await expect(
        resourceService.addResource(mockWorkspaceId, mockUserId, resourceData)
      ).rejects.toThrow(NotFoundError);
    });
  });

  describe('getResourceById', () => {
    it('should return a specific resource', async () => {
      const mockResource = {
        id: mockResourceId,
        name: 'Cement',
        quantity: 100,
        unit: 'Bags',
        threshold: 50,
        status: 'Good'
      };

      const mockWorkspace = {
        resources: [mockResource]
      };

      (Workspace.findOne as jest.Mock) = jest.fn().mockResolvedValue(mockWorkspace);

      const result = await resourceService.getResourceById(
        mockWorkspaceId,
        mockResourceId,
        mockUserId
      );

      expect(result).toEqual(mockResource);
    });

    it('should throw NotFoundError if workspace does not exist', async () => {
      (Workspace.findOne as jest.Mock) = jest.fn().mockResolvedValue(null);

      await expect(
        resourceService.getResourceById(mockWorkspaceId, mockResourceId, mockUserId)
      ).rejects.toThrow(NotFoundError);
    });

    it('should throw NotFoundError if resource does not exist', async () => {
      const mockWorkspace = {
        resources: []
      };

      (Workspace.findOne as jest.Mock) = jest.fn().mockResolvedValue(mockWorkspace);

      await expect(
        resourceService.getResourceById(mockWorkspaceId, mockResourceId, mockUserId)
      ).rejects.toThrow(NotFoundError);
    });
  });

  describe('updateResourceQuantity', () => {
    it('should update resource quantity and recalculate status to Good', async () => {
      const mockResource = {
        id: mockResourceId,
        name: 'Cement',
        quantity: 100,
        unit: 'Bags',
        threshold: 50,
        status: 'Good'
      };

      const mockWorkspace = {
        resources: [mockResource],
        save: jest.fn().mockResolvedValue(true)
      };

      (Workspace.findOne as jest.Mock) = jest.fn().mockResolvedValue(mockWorkspace);

      const result = await resourceService.updateResourceQuantity(
        mockWorkspaceId,
        mockResourceId,
        mockUserId,
        80
      );

      expect(result.quantity).toBe(80);
      expect(result.status).toBe('Good');
      expect(mockWorkspace.save).toHaveBeenCalled();
    });

    it('should recalculate status to Low', async () => {
      const mockResource = {
        id: mockResourceId,
        name: 'Cement',
        quantity: 100,
        unit: 'Bags',
        threshold: 50,
        status: 'Good'
      };

      const mockWorkspace = {
        resources: [mockResource],
        save: jest.fn().mockResolvedValue(true)
      };

      (Workspace.findOne as jest.Mock) = jest.fn().mockResolvedValue(mockWorkspace);

      const result = await resourceService.updateResourceQuantity(
        mockWorkspaceId,
        mockResourceId,
        mockUserId,
        40
      );

      expect(result.status).toBe('Low');
    });

    it('should recalculate status to Critical', async () => {
      const mockResource = {
        id: mockResourceId,
        name: 'Cement',
        quantity: 100,
        unit: 'Bags',
        threshold: 50,
        status: 'Good'
      };

      const mockWorkspace = {
        resources: [mockResource],
        save: jest.fn().mockResolvedValue(true)
      };

      (Workspace.findOne as jest.Mock) = jest.fn().mockResolvedValue(mockWorkspace);

      const result = await resourceService.updateResourceQuantity(
        mockWorkspaceId,
        mockResourceId,
        mockUserId,
        20
      );

      expect(result.status).toBe('Critical');
    });

    it('should throw BadRequestError if quantity is negative', async () => {
      await expect(
        resourceService.updateResourceQuantity(
          mockWorkspaceId,
          mockResourceId,
          mockUserId,
          -10
        )
      ).rejects.toThrow(BadRequestError);
    });

    it('should throw NotFoundError if workspace does not exist', async () => {
      (Workspace.findOne as jest.Mock) = jest.fn().mockResolvedValue(null);

      await expect(
        resourceService.updateResourceQuantity(mockWorkspaceId, mockResourceId, mockUserId, 50)
      ).rejects.toThrow(NotFoundError);
    });

    it('should throw NotFoundError if resource does not exist', async () => {
      const mockWorkspace = {
        resources: []
      };

      (Workspace.findOne as jest.Mock) = jest.fn().mockResolvedValue(mockWorkspace);

      await expect(
        resourceService.updateResourceQuantity(mockWorkspaceId, mockResourceId, mockUserId, 50)
      ).rejects.toThrow(NotFoundError);
    });
  });

  describe('updateResource', () => {
    it('should update resource name', async () => {
      const mockResource = {
        id: mockResourceId,
        name: 'Cement',
        quantity: 100,
        unit: 'Bags',
        threshold: 50,
        status: 'Good'
      };

      const mockWorkspace = {
        resources: [mockResource],
        save: jest.fn().mockResolvedValue(true)
      };

      (Workspace.findOne as jest.Mock) = jest.fn().mockResolvedValue(mockWorkspace);

      const result = await resourceService.updateResource(
        mockWorkspaceId,
        mockResourceId,
        mockUserId,
        { name: 'Premium Cement' }
      );

      expect(result.name).toBe('Premium Cement');
      expect(mockWorkspace.save).toHaveBeenCalled();
    });

    it('should update multiple fields', async () => {
      const mockResource = {
        id: mockResourceId,
        name: 'Cement',
        quantity: 100,
        unit: 'Bags',
        threshold: 50,
        status: 'Good'
      };

      const mockWorkspace = {
        resources: [mockResource],
        save: jest.fn().mockResolvedValue(true)
      };

      (Workspace.findOne as jest.Mock) = jest.fn().mockResolvedValue(mockWorkspace);

      const updateData = {
        name: 'Updated Cement',
        quantity: 150,
        unit: 'Sacks',
        threshold: 80
      };

      const result = await resourceService.updateResource(
        mockWorkspaceId,
        mockResourceId,
        mockUserId,
        updateData
      );

      expect(result.name).toBe(updateData.name);
      expect(result.quantity).toBe(updateData.quantity);
      expect(result.unit).toBe(updateData.unit);
      expect(result.threshold).toBe(updateData.threshold);
      expect(result.status).toBe('Good');
    });

    it('should throw BadRequestError if quantity is negative', async () => {
      const mockResource = {
        id: mockResourceId,
        name: 'Cement',
        quantity: 100,
        unit: 'Bags',
        threshold: 50,
        status: 'Good'
      };

      const mockWorkspace = {
        resources: [mockResource]
      };

      (Workspace.findOne as jest.Mock) = jest.fn().mockResolvedValue(mockWorkspace);

      await expect(
        resourceService.updateResource(mockWorkspaceId, mockResourceId, mockUserId, {
          quantity: -10
        })
      ).rejects.toThrow(BadRequestError);
    });

    it('should throw BadRequestError if threshold is negative', async () => {
      const mockResource = {
        id: mockResourceId,
        name: 'Cement',
        quantity: 100,
        unit: 'Bags',
        threshold: 50,
        status: 'Good'
      };

      const mockWorkspace = {
        resources: [mockResource]
      };

      (Workspace.findOne as jest.Mock) = jest.fn().mockResolvedValue(mockWorkspace);

      await expect(
        resourceService.updateResource(mockWorkspaceId, mockResourceId, mockUserId, {
          threshold: -10
        })
      ).rejects.toThrow(BadRequestError);
    });

    it('should throw NotFoundError if workspace does not exist', async () => {
      (Workspace.findOne as jest.Mock) = jest.fn().mockResolvedValue(null);

      await expect(
        resourceService.updateResource(mockWorkspaceId, mockResourceId, mockUserId, {})
      ).rejects.toThrow(NotFoundError);
    });

    it('should throw NotFoundError if resource does not exist', async () => {
      const mockWorkspace = {
        resources: []
      };

      (Workspace.findOne as jest.Mock) = jest.fn().mockResolvedValue(mockWorkspace);

      await expect(
        resourceService.updateResource(mockWorkspaceId, mockResourceId, mockUserId, {})
      ).rejects.toThrow(NotFoundError);
    });
  });

  describe('deleteResource', () => {
    it('should delete a resource from workspace', async () => {
      const mockResource = {
        id: mockResourceId,
        name: 'Cement'
      };

      const mockWorkspace = {
        resources: [mockResource],
        save: jest.fn().mockResolvedValue(true)
      };

      (Workspace.findOne as jest.Mock) = jest.fn().mockResolvedValue(mockWorkspace);

      await resourceService.deleteResource(mockWorkspaceId, mockResourceId, mockUserId);

      expect(mockWorkspace.resources).toHaveLength(0);
      expect(mockWorkspace.save).toHaveBeenCalled();
    });

    it('should throw NotFoundError if workspace does not exist', async () => {
      (Workspace.findOne as jest.Mock) = jest.fn().mockResolvedValue(null);

      await expect(
        resourceService.deleteResource(mockWorkspaceId, mockResourceId, mockUserId)
      ).rejects.toThrow(NotFoundError);
    });

    it('should throw NotFoundError if resource does not exist', async () => {
      const mockWorkspace = {
        resources: []
      };

      (Workspace.findOne as jest.Mock) = jest.fn().mockResolvedValue(mockWorkspace);

      await expect(
        resourceService.deleteResource(mockWorkspaceId, mockResourceId, mockUserId)
      ).rejects.toThrow(NotFoundError);
    });
  });

  describe('bulkReplaceResources', () => {
    it('should replace all resources in workspace', async () => {
      const newResources = [
        { name: 'Paint', quantity: 50, unit: 'L', threshold: 30 },
        { name: 'Tiles', quantity: 200, unit: 'Pcs', threshold: 100 }
      ];

      const mockWorkspace = {
        resources: [{ id: 'old-1', name: 'Old Resource' }],
        save: jest.fn().mockResolvedValue(true)
      };

      (Workspace.findOne as jest.Mock) = jest.fn().mockResolvedValue(mockWorkspace);

      const result = await resourceService.bulkReplaceResources(
        mockWorkspaceId,
        mockUserId,
        newResources
      );

      expect(result).toHaveLength(2);
      expect(result[0].name).toBe('Paint');
      expect(result[1].name).toBe('Tiles');
      expect(mockWorkspace.resources).toEqual(result);
      expect(mockWorkspace.save).toHaveBeenCalled();
    });

    it('should throw BadRequestError if any resource has missing fields', async () => {
      const invalidResources = [{ name: 'Paint', quantity: 50 }] as any;

      const mockWorkspace = {
        resources: []
      };

      (Workspace.findOne as jest.Mock) = jest.fn().mockResolvedValue(mockWorkspace);

      await expect(
        resourceService.bulkReplaceResources(mockWorkspaceId, mockUserId, invalidResources)
      ).rejects.toThrow(BadRequestError);
    });

    it('should throw BadRequestError if any resource has negative quantity', async () => {
      const invalidResources = [
        { name: 'Paint', quantity: -10, unit: 'L', threshold: 30 }
      ];

      const mockWorkspace = {
        resources: []
      };

      (Workspace.findOne as jest.Mock) = jest.fn().mockResolvedValue(mockWorkspace);

      await expect(
        resourceService.bulkReplaceResources(mockWorkspaceId, mockUserId, invalidResources)
      ).rejects.toThrow(BadRequestError);
    });

    it('should throw BadRequestError if any resource has negative threshold', async () => {
      const invalidResources = [
        { name: 'Paint', quantity: 50, unit: 'L', threshold: -10 }
      ];

      const mockWorkspace = {
        resources: []
      };

      (Workspace.findOne as jest.Mock) = jest.fn().mockResolvedValue(mockWorkspace);

      await expect(
        resourceService.bulkReplaceResources(mockWorkspaceId, mockUserId, invalidResources)
      ).rejects.toThrow(BadRequestError);
    });

    it('should throw NotFoundError if workspace does not exist', async () => {
      const resources = [{ name: 'Paint', quantity: 50, unit: 'L', threshold: 30 }];

      (Workspace.findOne as jest.Mock) = jest.fn().mockResolvedValue(null);

      await expect(
        resourceService.bulkReplaceResources(mockWorkspaceId, mockUserId, resources)
      ).rejects.toThrow(NotFoundError);
    });

    it('should correctly set status for each resource', async () => {
      const newResources = [
        { name: 'Paint', quantity: 60, unit: 'L', threshold: 30 },
        { name: 'Tiles', quantity: 80, unit: 'Pcs', threshold: 100 },
        { name: 'Cement', quantity: 10, unit: 'Bags', threshold: 50 }
      ];

      const mockWorkspace = {
        resources: [],
        save: jest.fn().mockResolvedValue(true)
      };

      (Workspace.findOne as jest.Mock) = jest.fn().mockResolvedValue(mockWorkspace);

      const result = await resourceService.bulkReplaceResources(
        mockWorkspaceId,
        mockUserId,
        newResources
      );

      expect(result[0].status).toBe('Good');
      expect(result[1].status).toBe('Low');
      expect(result[2].status).toBe('Critical');
    });
  });

  describe('getResourceStatistics', () => {
    it('should return resource statistics', async () => {
      const mockResources = [
        { id: '1', name: 'Cement', quantity: 100, unit: 'Bags', threshold: 50, status: 'Good' },
        { id: '2', name: 'Paint', quantity: 20, unit: 'L', threshold: 30, status: 'Low' },
        { id: '3', name: 'Tiles', quantity: 10, unit: 'Pcs', threshold: 50, status: 'Critical' }
      ];

      const mockWorkspace = {
        resources: mockResources
      };

      (Workspace.findOne as jest.Mock) = jest.fn().mockResolvedValue(mockWorkspace);

      const result = await resourceService.getResourceStatistics(
        mockWorkspaceId,
        mockUserId
      );

      expect(result.total).toBe(3);
      expect(result.good).toBe(1);
      expect(result.low).toBe(1);
      expect(result.critical).toBe(1);
      expect(result.totalQuantity).toBe(130);
    });

    it('should return zero stats for empty resources', async () => {
      const mockWorkspace = {
        resources: []
      };

      (Workspace.findOne as jest.Mock) = jest.fn().mockResolvedValue(mockWorkspace);

      const result = await resourceService.getResourceStatistics(
        mockWorkspaceId,
        mockUserId
      );

      expect(result.total).toBe(0);
      expect(result.good).toBe(0);
      expect(result.low).toBe(0);
      expect(result.critical).toBe(0);
      expect(result.totalQuantity).toBe(0);
    });

    it('should throw NotFoundError if workspace does not exist', async () => {
      (Workspace.findOne as jest.Mock) = jest.fn().mockResolvedValue(null);

      await expect(
        resourceService.getResourceStatistics(mockWorkspaceId, mockUserId)
      ).rejects.toThrow(NotFoundError);
    });
  });
});

