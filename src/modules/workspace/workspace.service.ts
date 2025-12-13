import {
  Workspace,
  IWorkspace,
  IResourceItem,
  IArchitecturePlan,
  ISafetyReport
} from './models/Workspace';
import { BadRequestError, NotFoundError } from '../../core/error.response';
import { v4 as uuidv4 } from 'uuid';

export const getAllWorkspaces = async (userId: string): Promise<IWorkspace[]> => {
  const workspaces = await Workspace.find({ userId: userId as any }).sort({ updatedAt: -1 });
  return workspaces;
};

export const getWorkspaceById = async (
  workspaceId: string,
  userId: string
): Promise<IWorkspace> => {
  const workspace = await Workspace.findOne({ _id: workspaceId, userId: userId as any });

  if (!workspace) {
    throw new NotFoundError('Workspace not found');
  }

  return workspace;
};

export interface CreateWorkspaceData {
  name: string;
  location: string;
  stage: string;
  type: string;
  budget: string;
}

export const createWorkspace = async (
  userId: string,
  workspaceData: CreateWorkspaceData
): Promise<IWorkspace> => {
  const { name, location, stage, type, budget } = workspaceData;

  if (!name || !location || !stage || !type || !budget) {
    throw new BadRequestError('All required fields must be provided');
  }

  const defaultResources: IResourceItem[] = [
    { id: uuidv4(), name: 'Cement', quantity: 0, unit: 'Bags', threshold: 100, status: 'Low' },
    { id: uuidv4(), name: 'Sand', quantity: 0, unit: 'Tons', threshold: 50, status: 'Low' },
    { id: uuidv4(), name: 'Granite', quantity: 0, unit: 'Tons', threshold: 30, status: 'Low' },
    { id: uuidv4(), name: 'Iron Rods', quantity: 0, unit: 'Pieces', threshold: 250, status: 'Low' },
    { id: uuidv4(), name: 'Blocks', quantity: 0, unit: 'Units', threshold: 1000, status: 'Low' }
  ];

  const workspace = await Workspace.create({
    userId: userId as any,
    name,
    location,
    stage,
    type,
    budget,
    resources: defaultResources,
    progress: 0,
    safetyScore: 100,
    status: 'Under Construction',
    safetyReports: []
  });

  return workspace;
};

export interface UpdateWorkspaceData {
  name?: string;
  location?: string;
  stage?: string;
  type?: string;
  budget?: string;
}

export const updateWorkspace = async (
  workspaceId: string,
  userId: string,
  updateData: UpdateWorkspaceData
): Promise<IWorkspace> => {
  const workspace = await Workspace.findOne({ _id: workspaceId, userId: userId as any });

  if (!workspace) {
    throw new NotFoundError('Workspace not found');
  }

  Object.assign(workspace, updateData);
  await workspace.save();

  return workspace;
};

export const deleteWorkspace = async (workspaceId: string, userId: string): Promise<void> => {
  const workspace = await Workspace.findOne({ _id: workspaceId, userId: userId as any });

  if (!workspace) {
    throw new NotFoundError('Workspace not found');
  }

  await Workspace.deleteOne({ _id: workspaceId });
};

export const updateProgress = async (
  workspaceId: string,
  userId: string,
  progress: number
): Promise<IWorkspace> => {
  if (progress < 0 || progress > 100) {
    throw new BadRequestError('Progress must be between 0 and 100');
  }

  const workspace = await Workspace.findOne({ _id: workspaceId, userId: userId as any });

  if (!workspace) {
    throw new NotFoundError('Workspace not found');
  }

  workspace.progress = progress;
  await workspace.save();

  return workspace;
};

export const toggleStatus = async (workspaceId: string, userId: string): Promise<IWorkspace> => {
  const workspace = await Workspace.findOne({ _id: workspaceId, userId: userId as any });

  if (!workspace) {
    throw new NotFoundError('Workspace not found');
  }

  workspace.status = workspace.status === 'Under Construction' ? 'Finished' : 'Under Construction';

  if (workspace.status === 'Finished') {
    workspace.progress = 100;
  }

  await workspace.save();

  return workspace;
};

export const getAllResources = async (
  workspaceId: string,
  userId: string
): Promise<IResourceItem[]> => {
  const workspace = await getWorkspaceById(workspaceId, userId);
  return workspace.resources;
};

export interface AddResourceData {
  name: string;
  quantity: number;
  unit: string;
  threshold: number;
}

const calculateResourceStatus = (
  quantity: number,
  threshold: number
): 'Good' | 'Low' | 'Critical' => {
  if (quantity <= threshold * 0.5) return 'Critical';
  if (quantity <= threshold) return 'Low';
  return 'Good';
};

export const addResource = async (
  workspaceId: string,
  userId: string,
  resourceData: AddResourceData
): Promise<IResourceItem> => {
  const { name, quantity, unit, threshold } = resourceData;

  if (!name || quantity === undefined || !unit || threshold === undefined) {
    throw new BadRequestError('All resource fields are required');
  }

  if (quantity < 0 || threshold < 0) {
    throw new BadRequestError('Quantity and threshold must be positive numbers');
  }

  const workspace = await getWorkspaceById(workspaceId, userId);

  const newResource: IResourceItem = {
    id: uuidv4(),
    name,
    quantity,
    unit,
    threshold,
    status: calculateResourceStatus(quantity, threshold)
  };

  workspace.resources.push(newResource);
  await workspace.save();

  return newResource;
};

export const updateResourceQuantity = async (
  workspaceId: string,
  resourceId: string,
  userId: string,
  quantity: number
): Promise<IResourceItem> => {
  if (quantity < 0) {
    throw new BadRequestError('Quantity must be a positive number');
  }

  const workspace = await getWorkspaceById(workspaceId, userId);

  const resource = workspace.resources.find((r) => r.id === resourceId);

  if (!resource) {
    throw new NotFoundError('Resource not found');
  }

  resource.quantity = quantity;
  resource.status = calculateResourceStatus(quantity, resource.threshold);

  await workspace.save();

  return resource;
};

export interface UpdateResourceData {
  name?: string;
  quantity?: number;
  unit?: string;
  threshold?: number;
}

export const updateResource = async (
  workspaceId: string,
  resourceId: string,
  userId: string,
  updateData: UpdateResourceData
): Promise<IResourceItem> => {
  const workspace = await getWorkspaceById(workspaceId, userId);

  const resource = workspace.resources.find((r) => r.id === resourceId);

  if (!resource) {
    throw new NotFoundError('Resource not found');
  }

  if (updateData.name !== undefined) resource.name = updateData.name;
  if (updateData.quantity !== undefined) {
    if (updateData.quantity < 0) {
      throw new BadRequestError('Quantity must be a positive number');
    }
    resource.quantity = updateData.quantity;
  }
  if (updateData.unit !== undefined) resource.unit = updateData.unit;
  if (updateData.threshold !== undefined) {
    if (updateData.threshold < 0) {
      throw new BadRequestError('Threshold must be a positive number');
    }
    resource.threshold = updateData.threshold;
  }

  resource.status = calculateResourceStatus(resource.quantity, resource.threshold);

  await workspace.save();

  return resource;
};

export const deleteResource = async (
  workspaceId: string,
  resourceId: string,
  userId: string
): Promise<void> => {
  const workspace = await getWorkspaceById(workspaceId, userId);

  const resourceIndex = workspace.resources.findIndex((r) => r.id === resourceId);

  if (resourceIndex === -1) {
    throw new NotFoundError('Resource not found');
  }

  workspace.resources.splice(resourceIndex, 1);
  await workspace.save();
};

export const bulkReplaceResources = async (
  workspaceId: string,
  userId: string,
  resources: AddResourceData[]
): Promise<IResourceItem[]> => {
  const workspace = await getWorkspaceById(workspaceId, userId);

  const newResources: IResourceItem[] = resources.map((r) => {
    if (!r.name || r.quantity === undefined || !r.unit || r.threshold === undefined) {
      throw new BadRequestError('All resource fields are required for bulk replace');
    }
    if (r.quantity < 0 || r.threshold < 0) {
      throw new BadRequestError('Quantity and threshold must be positive numbers');
    }

    return {
      id: uuidv4(),
      name: r.name,
      quantity: r.quantity,
      unit: r.unit,
      threshold: r.threshold,
      status: calculateResourceStatus(r.quantity, r.threshold)
    };
  });

  workspace.resources = newResources;
  await workspace.save();

  return newResources;
};

export const saveArchitecturePlan = async (
  workspaceId: string,
  userId: string,
  plan: IArchitecturePlan
): Promise<IArchitecturePlan> => {
  const workspace = await getWorkspaceById(workspaceId, userId);

  if (!plan.costEstimate || !plan.timeline || !plan.stages || !plan.summary) {
    throw new BadRequestError('Invalid architecture plan data');
  }

  workspace.architecturePlan = plan;
  await workspace.save();

  return plan;
};

export const getArchitecturePlan = async (
  workspaceId: string,
  userId: string
): Promise<IArchitecturePlan | null> => {
  const workspace = await getWorkspaceById(workspaceId, userId);
  return workspace.architecturePlan || null;
};

export const saveSafetyReport = async (
  workspaceId: string,
  userId: string,
  reportData: Omit<ISafetyReport, 'id' | 'date'>
): Promise<ISafetyReport> => {
  const workspace = await getWorkspaceById(workspaceId, userId);

  if (reportData.riskScore < 0 || reportData.riskScore > 100) {
    throw new BadRequestError('Risk score must be between 0 and 100');
  }

  const newReport: ISafetyReport = {
    id: uuidv4(),
    date: new Date().toISOString().split('T')[0],
    riskScore: reportData.riskScore,
    hazards: reportData.hazards,
    summary: reportData.summary
  };

  workspace.safetyReports.unshift(newReport);
  workspace.safetyScore = Math.max(0, 100 - reportData.riskScore);

  await workspace.save();

  return newReport;
};

export const getAllSafetyReports = async (
  workspaceId: string,
  userId: string
): Promise<ISafetyReport[]> => {
  const workspace = await getWorkspaceById(workspaceId, userId);
  return workspace.safetyReports;
};

export const getSafetyReportById = async (
  workspaceId: string,
  reportId: string,
  userId: string
): Promise<ISafetyReport> => {
  const workspace = await getWorkspaceById(workspaceId, userId);

  const report = workspace.safetyReports.find((r) => r.id === reportId);

  if (!report) {
    throw new NotFoundError('Safety report not found');
  }

  return report;
};
