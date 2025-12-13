import * as workspaceService from './workspace.service';
import { Workspace } from './models/Workspace';
import { BadRequestError, NotFoundError } from '../../core/error.response';

jest.mock('./models/Workspace');
jest.mock('uuid', () => ({
  v4: () => 'test-uuid-' + Math.random().toString(36).substr(2, 9)
}));

describe('Workspace Service', () => {
  const mockUserId = '507f1f77bcf86cd799439011';
  const mockWorkspaceId = '507f1f77bcf86cd799439012';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllWorkspaces', () => {
    it('should return all workspaces for a user', async () => {
      const mockWorkspaces = [
        { _id: mockWorkspaceId, name: 'Test Workspace', userId: mockUserId },
      ];

      const sortMock = jest.fn().mockResolvedValue(mockWorkspaces);
      (Workspace.find as jest.Mock) = jest.fn().mockReturnValue({
        sort: sortMock,
      });

      const result = await workspaceService.getAllWorkspaces(mockUserId);

      expect(Workspace.find).toHaveBeenCalledWith({ userId: mockUserId });
      expect(sortMock).toHaveBeenCalledWith({ updatedAt: -1 });
      expect(result).toEqual(mockWorkspaces);
    });
  });

  describe('getWorkspaceById', () => {
    it('should return a workspace by id', async () => {
      const mockWorkspace = {
        _id: mockWorkspaceId,
        name: 'Test Workspace',
        userId: mockUserId,
      };

      (Workspace.findOne as jest.Mock) = jest.fn().mockResolvedValue(mockWorkspace);

      const result = await workspaceService.getWorkspaceById(
        mockWorkspaceId,
        mockUserId
      );

      expect(Workspace.findOne).toHaveBeenCalledWith({
        _id: mockWorkspaceId,
        userId: mockUserId,
      });
      expect(result).toEqual(mockWorkspace);
    });

    it('should throw NotFoundError if workspace does not exist', async () => {
      (Workspace.findOne as jest.Mock) = jest.fn().mockResolvedValue(null);

      await expect(
        workspaceService.getWorkspaceById(mockWorkspaceId, mockUserId)
      ).rejects.toThrow(NotFoundError);
    });
  });

  describe('createWorkspace', () => {
    it('should create a new workspace with default resources', async () => {
      const workspaceData = {
        name: 'New Workspace',
        location: 'Lagos',
        stage: 'Planning',
        type: 'Residential',
        budget: '50000000',
      };

      const mockCreatedWorkspace = {
        _id: mockWorkspaceId,
        ...workspaceData,
        userId: mockUserId,
        progress: 0,
        safetyScore: 100,
        status: 'Under Construction',
        resources: expect.any(Array),
      };

      (Workspace.create as jest.Mock) = jest.fn().mockResolvedValue(mockCreatedWorkspace);

      const result = await workspaceService.createWorkspace(mockUserId, workspaceData);

      expect(Workspace.create).toHaveBeenCalledWith(
        expect.objectContaining({
          userId: mockUserId,
          name: workspaceData.name,
          location: workspaceData.location,
          stage: workspaceData.stage,
          type: workspaceData.type,
          budget: workspaceData.budget,
          progress: 0,
          safetyScore: 100,
          status: 'Under Construction',
          resources: expect.arrayContaining([
            expect.objectContaining({ name: 'Cement' }),
          ]),
        })
      );
      expect(result).toEqual(mockCreatedWorkspace);
    });

    it('should throw BadRequestError if required fields are missing', async () => {
      const incompleteData = {
        name: 'Test',
        location: 'Lagos',
      } as any;

      await expect(
        workspaceService.createWorkspace(mockUserId, incompleteData)
      ).rejects.toThrow(BadRequestError);
    });
  });

  describe('updateWorkspace', () => {
    it('should update workspace details', async () => {
      const updateData = { name: 'Updated Name', location: 'Abuja' };
      const mockWorkspace = {
        _id: mockWorkspaceId,
        name: 'Old Name',
        location: 'Lagos',
        userId: mockUserId,
        save: jest.fn().mockResolvedValue(true),
      };

      (Workspace.findOne as jest.Mock) = jest.fn().mockResolvedValue(mockWorkspace);

      const result = await workspaceService.updateWorkspace(
        mockWorkspaceId,
        mockUserId,
        updateData
      );

      expect(mockWorkspace.save).toHaveBeenCalled();
      expect(mockWorkspace.name).toBe(updateData.name);
      expect(mockWorkspace.location).toBe(updateData.location);
    });

    it('should throw NotFoundError if workspace does not exist', async () => {
      (Workspace.findOne as jest.Mock) = jest.fn().mockResolvedValue(null);

      await expect(
        workspaceService.updateWorkspace(mockWorkspaceId, mockUserId, {})
      ).rejects.toThrow(NotFoundError);
    });
  });

  describe('deleteWorkspace', () => {
    it('should delete a workspace', async () => {
      const mockWorkspace = {
        _id: mockWorkspaceId,
        userId: mockUserId,
      };

      (Workspace.findOne as jest.Mock) = jest.fn().mockResolvedValue(mockWorkspace);
      (Workspace.deleteOne as jest.Mock) = jest.fn().mockResolvedValue({ deletedCount: 1 });

      await workspaceService.deleteWorkspace(mockWorkspaceId, mockUserId);

      expect(Workspace.deleteOne).toHaveBeenCalledWith({ _id: mockWorkspaceId });
    });

    it('should throw NotFoundError if workspace does not exist', async () => {
      (Workspace.findOne as jest.Mock) = jest.fn().mockResolvedValue(null);

      await expect(
        workspaceService.deleteWorkspace(mockWorkspaceId, mockUserId)
      ).rejects.toThrow(NotFoundError);
    });
  });

  describe('updateProgress', () => {
    it('should update workspace progress', async () => {
      const mockWorkspace = {
        _id: mockWorkspaceId,
        progress: 50,
        save: jest.fn().mockResolvedValue(true),
      };

      (Workspace.findOne as jest.Mock) = jest.fn().mockResolvedValue(mockWorkspace);

      const result = await workspaceService.updateProgress(
        mockWorkspaceId,
        mockUserId,
        75
      );

      expect(mockWorkspace.progress).toBe(75);
      expect(mockWorkspace.save).toHaveBeenCalled();
    });

    it('should throw BadRequestError if progress is out of range', async () => {
      await expect(
        workspaceService.updateProgress(mockWorkspaceId, mockUserId, 150)
      ).rejects.toThrow(BadRequestError);

      await expect(
        workspaceService.updateProgress(mockWorkspaceId, mockUserId, -10)
      ).rejects.toThrow(BadRequestError);
    });
  });

  describe('toggleStatus', () => {
    it('should toggle status from Under Construction to Finished', async () => {
      const mockWorkspace = {
        _id: mockWorkspaceId,
        status: 'Under Construction',
        progress: 50,
        save: jest.fn().mockResolvedValue(true),
      };

      (Workspace.findOne as jest.Mock) = jest.fn().mockResolvedValue(mockWorkspace);

      await workspaceService.toggleStatus(mockWorkspaceId, mockUserId);

      expect(mockWorkspace.status).toBe('Finished');
      expect(mockWorkspace.progress).toBe(100);
      expect(mockWorkspace.save).toHaveBeenCalled();
    });

    it('should toggle status from Finished to Under Construction', async () => {
      const mockWorkspace = {
        _id: mockWorkspaceId,
        status: 'Finished',
        progress: 100,
        save: jest.fn().mockResolvedValue(true),
      };

      (Workspace.findOne as jest.Mock) = jest.fn().mockResolvedValue(mockWorkspace);

      await workspaceService.toggleStatus(mockWorkspaceId, mockUserId);

      expect(mockWorkspace.status).toBe('Under Construction');
      expect(mockWorkspace.save).toHaveBeenCalled();
    });
  });

  describe('getAllResources', () => {
    it('should return all resources for a workspace', async () => {
      const mockResources = [
        { id: '1', name: 'Cement', quantity: 100, unit: 'Bags', threshold: 50, status: 'Good' },
      ];

      const mockWorkspace = {
        resources: mockResources,
      };

      (Workspace.findOne as jest.Mock) = jest.fn().mockResolvedValue(mockWorkspace);

      const result = await workspaceService.getAllResources(mockWorkspaceId, mockUserId);

      expect(result).toEqual(mockResources);
    });
  });

  describe('addResource', () => {
    it('should add a new resource to workspace', async () => {
      const resourceData = {
        name: 'Paint',
        quantity: 50,
        unit: 'L',
        threshold: 30,
      };

      const mockWorkspace = {
        resources: [],
        save: jest.fn().mockResolvedValue(true),
      };

      (Workspace.findOne as jest.Mock) = jest.fn().mockResolvedValue(mockWorkspace);

      const result = await workspaceService.addResource(
        mockWorkspaceId,
        mockUserId,
        resourceData
      );

      expect(mockWorkspace.resources).toHaveLength(1);
      expect(result.name).toBe(resourceData.name);
      expect(result.status).toBe('Good');
      expect(mockWorkspace.save).toHaveBeenCalled();
    });

    it('should throw BadRequestError if required fields are missing', async () => {
      const incompleteData = { name: 'Paint' } as any;

      await expect(
        workspaceService.addResource(mockWorkspaceId, mockUserId, incompleteData)
      ).rejects.toThrow(BadRequestError);
    });

    it('should throw BadRequestError if quantity is negative', async () => {
      const invalidData = {
        name: 'Paint',
        quantity: -10,
        unit: 'L',
        threshold: 30,
      };

      await expect(
        workspaceService.addResource(mockWorkspaceId, mockUserId, invalidData)
      ).rejects.toThrow(BadRequestError);
    });

    it('should set status to Low when quantity <= threshold', async () => {
      const resourceData = {
        name: 'Paint',
        quantity: 20,
        unit: 'L',
        threshold: 30,
      };

      const mockWorkspace = {
        resources: [],
        save: jest.fn().mockResolvedValue(true),
      };

      (Workspace.findOne as jest.Mock) = jest.fn().mockResolvedValue(mockWorkspace);

      const result = await workspaceService.addResource(
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
        threshold: 30,
      };

      const mockWorkspace = {
        resources: [],
        save: jest.fn().mockResolvedValue(true),
      };

      (Workspace.findOne as jest.Mock) = jest.fn().mockResolvedValue(mockWorkspace);

      const result = await workspaceService.addResource(
        mockWorkspaceId,
        mockUserId,
        resourceData
      );

      expect(result.status).toBe('Critical');
    });
  });

  describe('updateResourceQuantity', () => {
    it('should update resource quantity and recalculate status', async () => {
      const resourceId = 'resource-1';
      const mockResource = {
        id: resourceId,
        name: 'Cement',
        quantity: 100,
        unit: 'Bags',
        threshold: 50,
        status: 'Good',
      };

      const mockWorkspace = {
        resources: [mockResource],
        save: jest.fn().mockResolvedValue(true),
      };

      (Workspace.findOne as jest.Mock) = jest.fn().mockResolvedValue(mockWorkspace);

      const result = await workspaceService.updateResourceQuantity(
        mockWorkspaceId,
        resourceId,
        mockUserId,
        30
      );

      expect(result.quantity).toBe(30);
      expect(result.status).toBe('Low');
      expect(mockWorkspace.save).toHaveBeenCalled();
    });

    it('should throw BadRequestError if quantity is negative', async () => {
      await expect(
        workspaceService.updateResourceQuantity(
          mockWorkspaceId,
          'resource-1',
          mockUserId,
          -10
        )
      ).rejects.toThrow(BadRequestError);
    });

    it('should throw NotFoundError if resource does not exist', async () => {
      const mockWorkspace = {
        resources: [],
      };

      (Workspace.findOne as jest.Mock) = jest.fn().mockResolvedValue(mockWorkspace);

      await expect(
        workspaceService.updateResourceQuantity(
          mockWorkspaceId,
          'nonexistent',
          mockUserId,
          50
        )
      ).rejects.toThrow(NotFoundError);
    });
  });

  describe('updateResource', () => {
    it('should update resource details', async () => {
      const resourceId = 'resource-1';
      const mockResource = {
        id: resourceId,
        name: 'Cement',
        quantity: 100,
        unit: 'Bags',
        threshold: 50,
        status: 'Good',
      };

      const mockWorkspace = {
        resources: [mockResource],
        save: jest.fn().mockResolvedValue(true),
      };

      (Workspace.findOne as jest.Mock) = jest.fn().mockResolvedValue(mockWorkspace);

      const updateData = { name: 'Premium Cement', quantity: 150 };
      const result = await workspaceService.updateResource(
        mockWorkspaceId,
        resourceId,
        mockUserId,
        updateData
      );

      expect(result.name).toBe(updateData.name);
      expect(result.quantity).toBe(updateData.quantity);
      expect(mockWorkspace.save).toHaveBeenCalled();
    });

    it('should throw BadRequestError if quantity is negative', async () => {
      const resourceId = 'resource-1';
      const mockResource = {
        id: resourceId,
        name: 'Cement',
        quantity: 100,
        unit: 'Bags',
        threshold: 50,
        status: 'Good',
      };

      const mockWorkspace = {
        resources: [mockResource],
      };

      (Workspace.findOne as jest.Mock) = jest.fn().mockResolvedValue(mockWorkspace);

      await expect(
        workspaceService.updateResource(mockWorkspaceId, resourceId, mockUserId, {
          quantity: -10,
        })
      ).rejects.toThrow(BadRequestError);
    });

    it('should throw BadRequestError if threshold is negative', async () => {
      const resourceId = 'resource-1';
      const mockResource = {
        id: resourceId,
        name: 'Cement',
        quantity: 100,
        unit: 'Bags',
        threshold: 50,
        status: 'Good',
      };

      const mockWorkspace = {
        resources: [mockResource],
      };

      (Workspace.findOne as jest.Mock) = jest.fn().mockResolvedValue(mockWorkspace);

      await expect(
        workspaceService.updateResource(mockWorkspaceId, resourceId, mockUserId, {
          threshold: -10,
        })
      ).rejects.toThrow(BadRequestError);
    });
  });

  describe('deleteResource', () => {
    it('should delete a resource from workspace', async () => {
      const resourceId = 'resource-1';
      const mockResource = {
        id: resourceId,
        name: 'Cement',
      };

      const mockWorkspace = {
        resources: [mockResource],
        save: jest.fn().mockResolvedValue(true),
      };

      (Workspace.findOne as jest.Mock) = jest.fn().mockResolvedValue(mockWorkspace);

      await workspaceService.deleteResource(mockWorkspaceId, resourceId, mockUserId);

      expect(mockWorkspace.resources).toHaveLength(0);
      expect(mockWorkspace.save).toHaveBeenCalled();
    });

    it('should throw NotFoundError if resource does not exist', async () => {
      const mockWorkspace = {
        resources: [],
      };

      (Workspace.findOne as jest.Mock) = jest.fn().mockResolvedValue(mockWorkspace);

      await expect(
        workspaceService.deleteResource(mockWorkspaceId, 'nonexistent', mockUserId)
      ).rejects.toThrow(NotFoundError);
    });
  });

  describe('bulkReplaceResources', () => {
    it('should replace all resources in workspace', async () => {
      const newResources = [
        { name: 'Paint', quantity: 50, unit: 'L', threshold: 30 },
        { name: 'Tiles', quantity: 200, unit: 'Pcs', threshold: 100 },
      ];

      const mockWorkspace = {
        resources: [{ id: 'old-1', name: 'Old Resource' }],
        save: jest.fn().mockResolvedValue(true),
      };

      (Workspace.findOne as jest.Mock) = jest.fn().mockResolvedValue(mockWorkspace);

      const result = await workspaceService.bulkReplaceResources(
        mockWorkspaceId,
        mockUserId,
        newResources
      );

      expect(result).toHaveLength(2);
      expect(result[0].name).toBe('Paint');
      expect(result[1].name).toBe('Tiles');
      expect(mockWorkspace.save).toHaveBeenCalled();
    });

    it('should throw BadRequestError if any resource has missing fields', async () => {
      const invalidResources = [{ name: 'Paint', quantity: 50 }] as any;

      const mockWorkspace = {
        resources: [],
      };

      (Workspace.findOne as jest.Mock) = jest.fn().mockResolvedValue(mockWorkspace);

      await expect(
        workspaceService.bulkReplaceResources(
          mockWorkspaceId,
          mockUserId,
          invalidResources
        )
      ).rejects.toThrow(BadRequestError);
    });

    it('should throw BadRequestError if any resource has negative values', async () => {
      const invalidResources = [
        { name: 'Paint', quantity: -10, unit: 'L', threshold: 30 },
      ];

      const mockWorkspace = {
        resources: [],
      };

      (Workspace.findOne as jest.Mock) = jest.fn().mockResolvedValue(mockWorkspace);

      await expect(
        workspaceService.bulkReplaceResources(
          mockWorkspaceId,
          mockUserId,
          invalidResources
        )
      ).rejects.toThrow(BadRequestError);
    });
  });

  describe('saveArchitecturePlan', () => {
    it('should save architecture plan to workspace', async () => {
      const plan = {
        costEstimate: '₦50,000,000',
        timeline: '12 months',
        materials: ['Cement', 'Steel'],
        stages: [
          { name: 'Planning', description: 'Initial planning', duration: '2 weeks' },
        ],
        summary: 'A comprehensive plan',
      };

      const mockWorkspace = {
        architecturePlan: null,
        save: jest.fn().mockResolvedValue(true),
      };

      (Workspace.findOne as jest.Mock) = jest.fn().mockResolvedValue(mockWorkspace);

      const result = await workspaceService.saveArchitecturePlan(
        mockWorkspaceId,
        mockUserId,
        plan
      );

      expect(mockWorkspace.architecturePlan).toEqual(plan);
      expect(mockWorkspace.save).toHaveBeenCalled();
      expect(result).toEqual(plan);
    });

    it('should throw BadRequestError if plan data is invalid', async () => {
      const invalidPlan = { costEstimate: '₦50,000,000' } as any;

      const mockWorkspace = {
        architecturePlan: null,
      };

      (Workspace.findOne as jest.Mock) = jest.fn().mockResolvedValue(mockWorkspace);

      await expect(
        workspaceService.saveArchitecturePlan(
          mockWorkspaceId,
          mockUserId,
          invalidPlan
        )
      ).rejects.toThrow(BadRequestError);
    });
  });

  describe('getArchitecturePlan', () => {
    it('should return architecture plan if exists', async () => {
      const plan = {
        costEstimate: '₦50,000,000',
        timeline: '12 months',
        materials: ['Cement'],
        stages: [],
        summary: 'Plan',
      };

      const mockWorkspace = {
        architecturePlan: plan,
      };

      (Workspace.findOne as jest.Mock) = jest.fn().mockResolvedValue(mockWorkspace);

      const result = await workspaceService.getArchitecturePlan(
        mockWorkspaceId,
        mockUserId
      );

      expect(result).toEqual(plan);
    });

    it('should return null if no plan exists', async () => {
      const mockWorkspace = {
        architecturePlan: undefined,
      };

      (Workspace.findOne as jest.Mock) = jest.fn().mockResolvedValue(mockWorkspace);

      const result = await workspaceService.getArchitecturePlan(
        mockWorkspaceId,
        mockUserId
      );

      expect(result).toBeNull();
    });
  });

  describe('saveSafetyReport', () => {
    it('should save safety report and update safety score', async () => {
      const reportData = {
        riskScore: 30,
        hazards: [
          {
            description: 'No helmets',
            severity: 'High' as const,
            recommendation: 'Enforce PPE',
          },
        ],
        summary: 'Safety issues found',
      };

      const mockWorkspace = {
        safetyReports: [],
        safetyScore: 100,
        save: jest.fn().mockResolvedValue(true),
      };

      (Workspace.findOne as jest.Mock) = jest.fn().mockResolvedValue(mockWorkspace);

      const result = await workspaceService.saveSafetyReport(
        mockWorkspaceId,
        mockUserId,
        reportData
      );

      expect(result.riskScore).toBe(30);
      expect(result.hazards).toEqual(reportData.hazards);
      expect(mockWorkspace.safetyScore).toBe(70);
      expect(mockWorkspace.safetyReports).toHaveLength(1);
      expect(mockWorkspace.save).toHaveBeenCalled();
    });

    it('should throw BadRequestError if risk score is out of range', async () => {
      const invalidReport = {
        riskScore: 150,
        hazards: [],
        summary: 'Test',
      };

      const mockWorkspace = {
        safetyReports: [],
        safetyScore: 100,
      };

      (Workspace.findOne as jest.Mock) = jest.fn().mockResolvedValue(mockWorkspace);

      await expect(
        workspaceService.saveSafetyReport(mockWorkspaceId, mockUserId, invalidReport)
      ).rejects.toThrow(BadRequestError);
    });
  });

  describe('getAllSafetyReports', () => {
    it('should return all safety reports', async () => {
      const mockReports = [
        {
          id: 'report-1',
          date: '2024-12-13',
          riskScore: 30,
          hazards: [],
          summary: 'Report 1',
        },
      ];

      const mockWorkspace = {
        safetyReports: mockReports,
      };

      (Workspace.findOne as jest.Mock) = jest.fn().mockResolvedValue(mockWorkspace);

      const result = await workspaceService.getAllSafetyReports(
        mockWorkspaceId,
        mockUserId
      );

      expect(result).toEqual(mockReports);
    });
  });

  describe('getSafetyReportById', () => {
    it('should return a specific safety report', async () => {
      const reportId = 'report-1';
      const mockReport = {
        id: reportId,
        date: '2024-12-13',
        riskScore: 30,
        hazards: [],
        summary: 'Report 1',
      };

      const mockWorkspace = {
        safetyReports: [mockReport],
      };

      (Workspace.findOne as jest.Mock) = jest.fn().mockResolvedValue(mockWorkspace);

      const result = await workspaceService.getSafetyReportById(
        mockWorkspaceId,
        reportId,
        mockUserId
      );

      expect(result).toEqual(mockReport);
    });

    it('should throw NotFoundError if report does not exist', async () => {
      const mockWorkspace = {
        safetyReports: [],
      };

      (Workspace.findOne as jest.Mock) = jest.fn().mockResolvedValue(mockWorkspace);

      await expect(
        workspaceService.getSafetyReportById(
          mockWorkspaceId,
          'nonexistent',
          mockUserId
        )
      ).rejects.toThrow(NotFoundError);
    });
  });
});

