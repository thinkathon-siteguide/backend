import { Workspace, IArchitecturePlan } from '../workspace/models/Workspace';
import { BadRequestError, NotFoundError } from '../../core/error.response';

export interface SaveArchitecturePlanData {
  sections: Array<{
    title: string;
    description: string;
  }>;
  materials: Array<{
    name: string;
    quantity: string;
    specification: string;
  }>;
  stages: Array<{
    phase: string;
    duration: string;
    tasks: string[];
  }>;
  summary: string;
}

export const saveArchitecturePlan = async (
  workspaceId: string,
  userId: string,
  planData: SaveArchitecturePlanData
): Promise<IArchitecturePlan> => {
  if (!planData.sections || !planData.materials || !planData.stages || !planData.summary) {
    throw new BadRequestError('All architecture plan fields are required');
  }

  if (planData.sections.length === 0) {
    throw new BadRequestError('At least one section is required');
  }

  if (planData.materials.length === 0) {
    throw new BadRequestError('At least one material is required');
  }

  if (planData.stages.length === 0) {
    throw new BadRequestError('At least one stage is required');
  }

  const workspace = await Workspace.findOne({ _id: workspaceId, userId: userId as any });

  if (!workspace) {
    throw new NotFoundError('Workspace not found');
  }

  const architecturePlan: IArchitecturePlan = {
    sections: planData.sections,
    materials: planData.materials,
    stages: planData.stages,
    summary: planData.summary,
    createdAt: new Date()
  };

  workspace.architecturePlan = architecturePlan;
  await workspace.save();

  return architecturePlan;
};

export const getArchitecturePlan = async (
  workspaceId: string,
  userId: string
): Promise<IArchitecturePlan | null> => {
  const workspace = await Workspace.findOne({ _id: workspaceId, userId: userId as any });

  if (!workspace) {
    throw new NotFoundError('Workspace not found');
  }

  return workspace.architecturePlan || null;
};

export const updateArchitecturePlan = async (
  workspaceId: string,
  userId: string,
  planData: Partial<SaveArchitecturePlanData>
): Promise<IArchitecturePlan> => {
  const workspace = await Workspace.findOne({ _id: workspaceId, userId: userId as any });

  if (!workspace) {
    throw new NotFoundError('Workspace not found');
  }

  if (!workspace.architecturePlan) {
    throw new NotFoundError('Architecture plan not found');
  }

  if (planData.sections !== undefined) {
    if (!Array.isArray(planData.sections) || planData.sections.length === 0) {
      throw new BadRequestError('Sections must be a non-empty array');
    }
    workspace.architecturePlan.sections = planData.sections;
  }

  if (planData.materials !== undefined) {
    if (!Array.isArray(planData.materials) || planData.materials.length === 0) {
      throw new BadRequestError('Materials must be a non-empty array');
    }
    workspace.architecturePlan.materials = planData.materials;
  }

  if (planData.stages !== undefined) {
    if (!Array.isArray(planData.stages) || planData.stages.length === 0) {
      throw new BadRequestError('Stages must be a non-empty array');
    }
    workspace.architecturePlan.stages = planData.stages;
  }

  if (planData.summary !== undefined) {
    if (typeof planData.summary !== 'string' || planData.summary.trim() === '') {
      throw new BadRequestError('Summary must be a non-empty string');
    }
    workspace.architecturePlan.summary = planData.summary;
  }

  await workspace.save();

  return workspace.architecturePlan;
};

export const deleteArchitecturePlan = async (
  workspaceId: string,
  userId: string
): Promise<void> => {
  const workspace = await Workspace.findOne({ _id: workspaceId, userId: userId as any });

  if (!workspace) {
    throw new NotFoundError('Workspace not found');
  }

  if (!workspace.architecturePlan) {
    throw new NotFoundError('Architecture plan not found');
  }

  workspace.architecturePlan = undefined;
  await workspace.save();
};

export const getArchitectureSections = async (
  workspaceId: string,
  userId: string
): Promise<Array<{ title: string; description: string }>> => {
  const workspace = await Workspace.findOne({ _id: workspaceId, userId: userId as any });

  if (!workspace) {
    throw new NotFoundError('Workspace not found');
  }

  if (!workspace.architecturePlan) {
    return [];
  }

  return workspace.architecturePlan.sections;
};

export const getArchitectureMaterials = async (
  workspaceId: string,
  userId: string
): Promise<Array<{ name: string; quantity: string; specification: string }>> => {
  const workspace = await Workspace.findOne({ _id: workspaceId, userId: userId as any });

  if (!workspace) {
    throw new NotFoundError('Workspace not found');
  }

  if (!workspace.architecturePlan) {
    return [];
  }

  return workspace.architecturePlan.materials;
};

export const getArchitectureStages = async (
  workspaceId: string,
  userId: string
): Promise<Array<{ phase: string; duration: string; tasks: string[] }>> => {
  const workspace = await Workspace.findOne({ _id: workspaceId, userId: userId as any });

  if (!workspace) {
    throw new NotFoundError('Workspace not found');
  }

  if (!workspace.architecturePlan) {
    return [];
  }

  return workspace.architecturePlan.stages;
};

export const addArchitectureSection = async (
  workspaceId: string,
  userId: string,
  section: { title: string; description: string }
): Promise<IArchitecturePlan> => {
  if (!section.title || !section.description) {
    throw new BadRequestError('Section title and description are required');
  }

  const workspace = await Workspace.findOne({ _id: workspaceId, userId: userId as any });

  if (!workspace) {
    throw new NotFoundError('Workspace not found');
  }

  if (!workspace.architecturePlan) {
    throw new NotFoundError('Architecture plan not found. Please create a plan first.');
  }

  workspace.architecturePlan.sections.push(section);
  await workspace.save();

  return workspace.architecturePlan;
};

export const addArchitectureMaterial = async (
  workspaceId: string,
  userId: string,
  material: { name: string; quantity: string; specification: string }
): Promise<IArchitecturePlan> => {
  if (!material.name || !material.quantity || !material.specification) {
    throw new BadRequestError('Material name, quantity, and specification are required');
  }

  const workspace = await Workspace.findOne({ _id: workspaceId, userId: userId as any });

  if (!workspace) {
    throw new NotFoundError('Workspace not found');
  }

  if (!workspace.architecturePlan) {
    throw new NotFoundError('Architecture plan not found. Please create a plan first.');
  }

  workspace.architecturePlan.materials.push(material);
  await workspace.save();

  return workspace.architecturePlan;
};

export const addArchitectureStage = async (
  workspaceId: string,
  userId: string,
  stage: { phase: string; duration: string; tasks: string[] }
): Promise<IArchitecturePlan> => {
  if (!stage.phase || !stage.duration || !stage.tasks || stage.tasks.length === 0) {
    throw new BadRequestError('Stage phase, duration, and tasks are required');
  }

  const workspace = await Workspace.findOne({ _id: workspaceId, userId: userId as any });

  if (!workspace) {
    throw new NotFoundError('Workspace not found');
  }

  if (!workspace.architecturePlan) {
    throw new NotFoundError('Architecture plan not found. Please create a plan first.');
  }

  workspace.architecturePlan.stages.push(stage);
  await workspace.save();

  return workspace.architecturePlan;
};

