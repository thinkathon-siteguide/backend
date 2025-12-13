import * as architectureService from './architecture.service';
import { Workspace } from '../workspace/models/Workspace';
import { BadRequestError, NotFoundError } from '../../core/error.response';

jest.mock('../workspace/models/Workspace');

describe('Architecture Service', () => {
  const mockUserId = '507f1f77bcf86cd799439011';
  const mockWorkspaceId = '507f1f77bcf86cd799439012';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('saveArchitecturePlan', () => {
    const validPlanData = {
      sections: [{ title: 'Foundation', description: 'Foundation work' }],
      materials: [{ name: 'Cement', quantity: '100 bags', specification: 'Grade 53' }],
      stages: [{ phase: 'Phase 1', duration: '2 months', tasks: ['Task 1', 'Task 2'] }],
      summary: 'Project summary'
    };

    it('should save architecture plan successfully', async () => {
      const mockWorkspace = {
        architecturePlan: undefined,
        save: jest.fn().mockResolvedValue(true)
      };

      (Workspace.findOne as jest.Mock) = jest.fn().mockResolvedValue(mockWorkspace);

      const result = await architectureService.saveArchitecturePlan(
        mockWorkspaceId,
        mockUserId,
        validPlanData
      );

      expect(result.sections).toEqual(validPlanData.sections);
      expect(result.materials).toEqual(validPlanData.materials);
      expect(result.stages).toEqual(validPlanData.stages);
      expect(result.summary).toBe(validPlanData.summary);
      expect(result.createdAt).toBeDefined();
      expect(mockWorkspace.save).toHaveBeenCalled();
    });

    it('should throw BadRequestError if sections is missing', async () => {
      const invalidData = {
        ...validPlanData,
        sections: undefined
      } as any;

      await expect(
        architectureService.saveArchitecturePlan(mockWorkspaceId, mockUserId, invalidData)
      ).rejects.toThrow(BadRequestError);
    });

    it('should throw BadRequestError if materials is missing', async () => {
      const invalidData = {
        ...validPlanData,
        materials: undefined
      } as any;

      await expect(
        architectureService.saveArchitecturePlan(mockWorkspaceId, mockUserId, invalidData)
      ).rejects.toThrow(BadRequestError);
    });

    it('should throw BadRequestError if stages is missing', async () => {
      const invalidData = {
        ...validPlanData,
        stages: undefined
      } as any;

      await expect(
        architectureService.saveArchitecturePlan(mockWorkspaceId, mockUserId, invalidData)
      ).rejects.toThrow(BadRequestError);
    });

    it('should throw BadRequestError if summary is missing', async () => {
      const invalidData = {
        ...validPlanData,
        summary: undefined
      } as any;

      await expect(
        architectureService.saveArchitecturePlan(mockWorkspaceId, mockUserId, invalidData)
      ).rejects.toThrow(BadRequestError);
    });

    it('should throw BadRequestError if sections array is empty', async () => {
      const invalidData = {
        ...validPlanData,
        sections: []
      };

      await expect(
        architectureService.saveArchitecturePlan(mockWorkspaceId, mockUserId, invalidData)
      ).rejects.toThrow(BadRequestError);
    });

    it('should throw BadRequestError if materials array is empty', async () => {
      const invalidData = {
        ...validPlanData,
        materials: []
      };

      await expect(
        architectureService.saveArchitecturePlan(mockWorkspaceId, mockUserId, invalidData)
      ).rejects.toThrow(BadRequestError);
    });

    it('should throw BadRequestError if stages array is empty', async () => {
      const invalidData = {
        ...validPlanData,
        stages: []
      };

      await expect(
        architectureService.saveArchitecturePlan(mockWorkspaceId, mockUserId, invalidData)
      ).rejects.toThrow(BadRequestError);
    });

    it('should throw NotFoundError if workspace does not exist', async () => {
      (Workspace.findOne as jest.Mock) = jest.fn().mockResolvedValue(null);

      await expect(
        architectureService.saveArchitecturePlan(mockWorkspaceId, mockUserId, validPlanData)
      ).rejects.toThrow(NotFoundError);
    });
  });

  describe('getArchitecturePlan', () => {
    it('should return architecture plan if exists', async () => {
      const mockPlan = {
        sections: [{ title: 'Foundation', description: 'Foundation work' }],
        materials: [{ name: 'Cement', quantity: '100', specification: 'Grade 53' }],
        stages: [{ phase: 'Phase 1', duration: '2 months', tasks: ['Task 1'] }],
        summary: 'Summary',
        createdAt: new Date()
      };

      const mockWorkspace = {
        architecturePlan: mockPlan
      };

      (Workspace.findOne as jest.Mock) = jest.fn().mockResolvedValue(mockWorkspace);

      const result = await architectureService.getArchitecturePlan(mockWorkspaceId, mockUserId);

      expect(result).toEqual(mockPlan);
    });

    it('should return null if no plan exists', async () => {
      const mockWorkspace = {
        architecturePlan: undefined
      };

      (Workspace.findOne as jest.Mock) = jest.fn().mockResolvedValue(mockWorkspace);

      const result = await architectureService.getArchitecturePlan(mockWorkspaceId, mockUserId);

      expect(result).toBeNull();
    });

    it('should throw NotFoundError if workspace does not exist', async () => {
      (Workspace.findOne as jest.Mock) = jest.fn().mockResolvedValue(null);

      await expect(
        architectureService.getArchitecturePlan(mockWorkspaceId, mockUserId)
      ).rejects.toThrow(NotFoundError);
    });
  });

  describe('updateArchitecturePlan', () => {
    const mockExistingPlan = {
      sections: [{ title: 'Foundation', description: 'Foundation work' }],
      materials: [{ name: 'Cement', quantity: '100', specification: 'Grade 53' }],
      stages: [{ phase: 'Phase 1', duration: '2 months', tasks: ['Task 1'] }],
      summary: 'Summary',
      createdAt: new Date()
    };

    it('should update sections', async () => {
      const mockWorkspace = {
        architecturePlan: { ...mockExistingPlan },
        save: jest.fn().mockResolvedValue(true)
      };

      (Workspace.findOne as jest.Mock) = jest.fn().mockResolvedValue(mockWorkspace);

      const newSections = [{ title: 'New Section', description: 'New description' }];
      const result = await architectureService.updateArchitecturePlan(
        mockWorkspaceId,
        mockUserId,
        { sections: newSections }
      );

      expect(result.sections).toEqual(newSections);
      expect(mockWorkspace.save).toHaveBeenCalled();
    });

    it('should update materials', async () => {
      const mockWorkspace = {
        architecturePlan: { ...mockExistingPlan },
        save: jest.fn().mockResolvedValue(true)
      };

      (Workspace.findOne as jest.Mock) = jest.fn().mockResolvedValue(mockWorkspace);

      const newMaterials = [{ name: 'Steel', quantity: '50', specification: 'Grade A' }];
      const result = await architectureService.updateArchitecturePlan(
        mockWorkspaceId,
        mockUserId,
        { materials: newMaterials }
      );

      expect(result.materials).toEqual(newMaterials);
    });

    it('should update stages', async () => {
      const mockWorkspace = {
        architecturePlan: { ...mockExistingPlan },
        save: jest.fn().mockResolvedValue(true)
      };

      (Workspace.findOne as jest.Mock) = jest.fn().mockResolvedValue(mockWorkspace);

      const newStages = [{ phase: 'Phase 2', duration: '3 months', tasks: ['Task 3'] }];
      const result = await architectureService.updateArchitecturePlan(
        mockWorkspaceId,
        mockUserId,
        { stages: newStages }
      );

      expect(result.stages).toEqual(newStages);
    });

    it('should update summary', async () => {
      const mockWorkspace = {
        architecturePlan: { ...mockExistingPlan },
        save: jest.fn().mockResolvedValue(true)
      };

      (Workspace.findOne as jest.Mock) = jest.fn().mockResolvedValue(mockWorkspace);

      const newSummary = 'Updated summary';
      const result = await architectureService.updateArchitecturePlan(
        mockWorkspaceId,
        mockUserId,
        { summary: newSummary }
      );

      expect(result.summary).toBe(newSummary);
    });

    it('should throw BadRequestError if sections is empty array', async () => {
      const mockWorkspace = {
        architecturePlan: { ...mockExistingPlan }
      };

      (Workspace.findOne as jest.Mock) = jest.fn().mockResolvedValue(mockWorkspace);

      await expect(
        architectureService.updateArchitecturePlan(mockWorkspaceId, mockUserId, { sections: [] })
      ).rejects.toThrow(BadRequestError);
    });

    it('should throw BadRequestError if materials is empty array', async () => {
      const mockWorkspace = {
        architecturePlan: { ...mockExistingPlan }
      };

      (Workspace.findOne as jest.Mock) = jest.fn().mockResolvedValue(mockWorkspace);

      await expect(
        architectureService.updateArchitecturePlan(mockWorkspaceId, mockUserId, { materials: [] })
      ).rejects.toThrow(BadRequestError);
    });

    it('should throw BadRequestError if stages is empty array', async () => {
      const mockWorkspace = {
        architecturePlan: { ...mockExistingPlan }
      };

      (Workspace.findOne as jest.Mock) = jest.fn().mockResolvedValue(mockWorkspace);

      await expect(
        architectureService.updateArchitecturePlan(mockWorkspaceId, mockUserId, { stages: [] })
      ).rejects.toThrow(BadRequestError);
    });

    it('should throw BadRequestError if summary is empty string', async () => {
      const mockWorkspace = {
        architecturePlan: { ...mockExistingPlan }
      };

      (Workspace.findOne as jest.Mock) = jest.fn().mockResolvedValue(mockWorkspace);

      await expect(
        architectureService.updateArchitecturePlan(mockWorkspaceId, mockUserId, { summary: '' })
      ).rejects.toThrow(BadRequestError);
    });

    it('should throw NotFoundError if workspace does not exist', async () => {
      (Workspace.findOne as jest.Mock) = jest.fn().mockResolvedValue(null);

      await expect(
        architectureService.updateArchitecturePlan(mockWorkspaceId, mockUserId, {})
      ).rejects.toThrow(NotFoundError);
    });

    it('should throw NotFoundError if plan does not exist', async () => {
      const mockWorkspace = {
        architecturePlan: undefined
      };

      (Workspace.findOne as jest.Mock) = jest.fn().mockResolvedValue(mockWorkspace);

      await expect(
        architectureService.updateArchitecturePlan(mockWorkspaceId, mockUserId, {})
      ).rejects.toThrow(NotFoundError);
    });
  });

  describe('deleteArchitecturePlan', () => {
    it('should delete architecture plan', async () => {
      const mockWorkspace = {
        architecturePlan: { sections: [], materials: [], stages: [], summary: '' },
        save: jest.fn().mockResolvedValue(true)
      };

      (Workspace.findOne as jest.Mock) = jest.fn().mockResolvedValue(mockWorkspace);

      await architectureService.deleteArchitecturePlan(mockWorkspaceId, mockUserId);

      expect(mockWorkspace.architecturePlan).toBeUndefined();
      expect(mockWorkspace.save).toHaveBeenCalled();
    });

    it('should throw NotFoundError if workspace does not exist', async () => {
      (Workspace.findOne as jest.Mock) = jest.fn().mockResolvedValue(null);

      await expect(
        architectureService.deleteArchitecturePlan(mockWorkspaceId, mockUserId)
      ).rejects.toThrow(NotFoundError);
    });

    it('should throw NotFoundError if plan does not exist', async () => {
      const mockWorkspace = {
        architecturePlan: undefined
      };

      (Workspace.findOne as jest.Mock) = jest.fn().mockResolvedValue(mockWorkspace);

      await expect(
        architectureService.deleteArchitecturePlan(mockWorkspaceId, mockUserId)
      ).rejects.toThrow(NotFoundError);
    });
  });

  describe('getArchitectureSections', () => {
    it('should return sections', async () => {
      const mockSections = [{ title: 'Foundation', description: 'Foundation work' }];
      const mockWorkspace = {
        architecturePlan: {
          sections: mockSections,
          materials: [],
          stages: [],
          summary: ''
        }
      };

      (Workspace.findOne as jest.Mock) = jest.fn().mockResolvedValue(mockWorkspace);

      const result = await architectureService.getArchitectureSections(mockWorkspaceId, mockUserId);

      expect(result).toEqual(mockSections);
    });

    it('should return empty array if no plan exists', async () => {
      const mockWorkspace = {
        architecturePlan: undefined
      };

      (Workspace.findOne as jest.Mock) = jest.fn().mockResolvedValue(mockWorkspace);

      const result = await architectureService.getArchitectureSections(mockWorkspaceId, mockUserId);

      expect(result).toEqual([]);
    });

    it('should throw NotFoundError if workspace does not exist', async () => {
      (Workspace.findOne as jest.Mock) = jest.fn().mockResolvedValue(null);

      await expect(
        architectureService.getArchitectureSections(mockWorkspaceId, mockUserId)
      ).rejects.toThrow(NotFoundError);
    });
  });

  describe('getArchitectureMaterials', () => {
    it('should return materials', async () => {
      const mockMaterials = [{ name: 'Cement', quantity: '100', specification: 'Grade 53' }];
      const mockWorkspace = {
        architecturePlan: {
          sections: [],
          materials: mockMaterials,
          stages: [],
          summary: ''
        }
      };

      (Workspace.findOne as jest.Mock) = jest.fn().mockResolvedValue(mockWorkspace);

      const result = await architectureService.getArchitectureMaterials(mockWorkspaceId, mockUserId);

      expect(result).toEqual(mockMaterials);
    });

    it('should return empty array if no plan exists', async () => {
      const mockWorkspace = {
        architecturePlan: undefined
      };

      (Workspace.findOne as jest.Mock) = jest.fn().mockResolvedValue(mockWorkspace);

      const result = await architectureService.getArchitectureMaterials(mockWorkspaceId, mockUserId);

      expect(result).toEqual([]);
    });

    it('should throw NotFoundError if workspace does not exist', async () => {
      (Workspace.findOne as jest.Mock) = jest.fn().mockResolvedValue(null);

      await expect(
        architectureService.getArchitectureMaterials(mockWorkspaceId, mockUserId)
      ).rejects.toThrow(NotFoundError);
    });
  });

  describe('getArchitectureStages', () => {
    it('should return stages', async () => {
      const mockStages = [{ phase: 'Phase 1', duration: '2 months', tasks: ['Task 1'] }];
      const mockWorkspace = {
        architecturePlan: {
          sections: [],
          materials: [],
          stages: mockStages,
          summary: ''
        }
      };

      (Workspace.findOne as jest.Mock) = jest.fn().mockResolvedValue(mockWorkspace);

      const result = await architectureService.getArchitectureStages(mockWorkspaceId, mockUserId);

      expect(result).toEqual(mockStages);
    });

    it('should return empty array if no plan exists', async () => {
      const mockWorkspace = {
        architecturePlan: undefined
      };

      (Workspace.findOne as jest.Mock) = jest.fn().mockResolvedValue(mockWorkspace);

      const result = await architectureService.getArchitectureStages(mockWorkspaceId, mockUserId);

      expect(result).toEqual([]);
    });

    it('should throw NotFoundError if workspace does not exist', async () => {
      (Workspace.findOne as jest.Mock) = jest.fn().mockResolvedValue(null);

      await expect(
        architectureService.getArchitectureStages(mockWorkspaceId, mockUserId)
      ).rejects.toThrow(NotFoundError);
    });
  });

  describe('addArchitectureSection', () => {
    it('should add a new section', async () => {
      const mockPlan = {
        sections: [{ title: 'Old', description: 'Old section' }],
        materials: [],
        stages: [],
        summary: ''
      };
      const mockWorkspace = {
        architecturePlan: mockPlan,
        save: jest.fn().mockResolvedValue(true)
      };

      (Workspace.findOne as jest.Mock) = jest.fn().mockResolvedValue(mockWorkspace);

      const newSection = { title: 'New Section', description: 'New description' };
      const result = await architectureService.addArchitectureSection(
        mockWorkspaceId,
        mockUserId,
        newSection
      );

      expect(result.sections).toHaveLength(2);
      expect(result.sections[1]).toEqual(newSection);
      expect(mockWorkspace.save).toHaveBeenCalled();
    });

    it('should throw BadRequestError if title is missing', async () => {
      const invalidSection = { description: 'Description' } as any;

      await expect(
        architectureService.addArchitectureSection(mockWorkspaceId, mockUserId, invalidSection)
      ).rejects.toThrow(BadRequestError);
    });

    it('should throw BadRequestError if description is missing', async () => {
      const invalidSection = { title: 'Title' } as any;

      await expect(
        architectureService.addArchitectureSection(mockWorkspaceId, mockUserId, invalidSection)
      ).rejects.toThrow(BadRequestError);
    });

    it('should throw NotFoundError if workspace does not exist', async () => {
      (Workspace.findOne as jest.Mock) = jest.fn().mockResolvedValue(null);

      await expect(
        architectureService.addArchitectureSection(mockWorkspaceId, mockUserId, {
          title: 'Title',
          description: 'Description'
        })
      ).rejects.toThrow(NotFoundError);
    });

    it('should throw NotFoundError if plan does not exist', async () => {
      const mockWorkspace = {
        architecturePlan: undefined
      };

      (Workspace.findOne as jest.Mock) = jest.fn().mockResolvedValue(mockWorkspace);

      await expect(
        architectureService.addArchitectureSection(mockWorkspaceId, mockUserId, {
          title: 'Title',
          description: 'Description'
        })
      ).rejects.toThrow(NotFoundError);
    });
  });

  describe('addArchitectureMaterial', () => {
    it('should add a new material', async () => {
      const mockPlan = {
        sections: [],
        materials: [{ name: 'Cement', quantity: '100', specification: 'Grade 53' }],
        stages: [],
        summary: ''
      };
      const mockWorkspace = {
        architecturePlan: mockPlan,
        save: jest.fn().mockResolvedValue(true)
      };

      (Workspace.findOne as jest.Mock) = jest.fn().mockResolvedValue(mockWorkspace);

      const newMaterial = { name: 'Steel', quantity: '50', specification: 'Grade A' };
      const result = await architectureService.addArchitectureMaterial(
        mockWorkspaceId,
        mockUserId,
        newMaterial
      );

      expect(result.materials).toHaveLength(2);
      expect(result.materials[1]).toEqual(newMaterial);
      expect(mockWorkspace.save).toHaveBeenCalled();
    });

    it('should throw BadRequestError if name is missing', async () => {
      const invalidMaterial = { quantity: '100', specification: 'Grade 53' } as any;

      await expect(
        architectureService.addArchitectureMaterial(mockWorkspaceId, mockUserId, invalidMaterial)
      ).rejects.toThrow(BadRequestError);
    });

    it('should throw BadRequestError if quantity is missing', async () => {
      const invalidMaterial = { name: 'Cement', specification: 'Grade 53' } as any;

      await expect(
        architectureService.addArchitectureMaterial(mockWorkspaceId, mockUserId, invalidMaterial)
      ).rejects.toThrow(BadRequestError);
    });

    it('should throw BadRequestError if specification is missing', async () => {
      const invalidMaterial = { name: 'Cement', quantity: '100' } as any;

      await expect(
        architectureService.addArchitectureMaterial(mockWorkspaceId, mockUserId, invalidMaterial)
      ).rejects.toThrow(BadRequestError);
    });

    it('should throw NotFoundError if workspace does not exist', async () => {
      (Workspace.findOne as jest.Mock) = jest.fn().mockResolvedValue(null);

      await expect(
        architectureService.addArchitectureMaterial(mockWorkspaceId, mockUserId, {
          name: 'Cement',
          quantity: '100',
          specification: 'Grade 53'
        })
      ).rejects.toThrow(NotFoundError);
    });

    it('should throw NotFoundError if plan does not exist', async () => {
      const mockWorkspace = {
        architecturePlan: undefined
      };

      (Workspace.findOne as jest.Mock) = jest.fn().mockResolvedValue(mockWorkspace);

      await expect(
        architectureService.addArchitectureMaterial(mockWorkspaceId, mockUserId, {
          name: 'Cement',
          quantity: '100',
          specification: 'Grade 53'
        })
      ).rejects.toThrow(NotFoundError);
    });
  });

  describe('addArchitectureStage', () => {
    it('should add a new stage', async () => {
      const mockPlan = {
        sections: [],
        materials: [],
        stages: [{ phase: 'Phase 1', duration: '2 months', tasks: ['Task 1'] }],
        summary: ''
      };
      const mockWorkspace = {
        architecturePlan: mockPlan,
        save: jest.fn().mockResolvedValue(true)
      };

      (Workspace.findOne as jest.Mock) = jest.fn().mockResolvedValue(mockWorkspace);

      const newStage = { phase: 'Phase 2', duration: '3 months', tasks: ['Task 2', 'Task 3'] };
      const result = await architectureService.addArchitectureStage(
        mockWorkspaceId,
        mockUserId,
        newStage
      );

      expect(result.stages).toHaveLength(2);
      expect(result.stages[1]).toEqual(newStage);
      expect(mockWorkspace.save).toHaveBeenCalled();
    });

    it('should throw BadRequestError if phase is missing', async () => {
      const invalidStage = { duration: '2 months', tasks: ['Task 1'] } as any;

      await expect(
        architectureService.addArchitectureStage(mockWorkspaceId, mockUserId, invalidStage)
      ).rejects.toThrow(BadRequestError);
    });

    it('should throw BadRequestError if duration is missing', async () => {
      const invalidStage = { phase: 'Phase 1', tasks: ['Task 1'] } as any;

      await expect(
        architectureService.addArchitectureStage(mockWorkspaceId, mockUserId, invalidStage)
      ).rejects.toThrow(BadRequestError);
    });

    it('should throw BadRequestError if tasks is missing', async () => {
      const invalidStage = { phase: 'Phase 1', duration: '2 months' } as any;

      await expect(
        architectureService.addArchitectureStage(mockWorkspaceId, mockUserId, invalidStage)
      ).rejects.toThrow(BadRequestError);
    });

    it('should throw BadRequestError if tasks is empty array', async () => {
      const invalidStage = { phase: 'Phase 1', duration: '2 months', tasks: [] };

      await expect(
        architectureService.addArchitectureStage(mockWorkspaceId, mockUserId, invalidStage)
      ).rejects.toThrow(BadRequestError);
    });

    it('should throw NotFoundError if workspace does not exist', async () => {
      (Workspace.findOne as jest.Mock) = jest.fn().mockResolvedValue(null);

      await expect(
        architectureService.addArchitectureStage(mockWorkspaceId, mockUserId, {
          phase: 'Phase 1',
          duration: '2 months',
          tasks: ['Task 1']
        })
      ).rejects.toThrow(NotFoundError);
    });

    it('should throw NotFoundError if plan does not exist', async () => {
      const mockWorkspace = {
        architecturePlan: undefined
      };

      (Workspace.findOne as jest.Mock) = jest.fn().mockResolvedValue(mockWorkspace);

      await expect(
        architectureService.addArchitectureStage(mockWorkspaceId, mockUserId, {
          phase: 'Phase 1',
          duration: '2 months',
          tasks: ['Task 1']
        })
      ).rejects.toThrow(NotFoundError);
    });
  });
});

