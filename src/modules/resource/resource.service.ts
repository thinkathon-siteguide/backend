import { Workspace, IResourceItem } from '../workspace/models/Workspace';
import { BadRequestError, NotFoundError } from '../../core/error.response';
import { v4 as uuidv4 } from 'uuid';

const calculateResourceStatus = (
  quantity: number,
  threshold: number
): 'Good' | 'Low' | 'Critical' => {
  if (quantity <= threshold * 0.5) return 'Critical';
  if (quantity <= threshold) return 'Low';
  return 'Good';
};

export const getAllResources = async (
  workspaceId: string,
  userId: string
): Promise<IResourceItem[]> => {
  const workspace = await Workspace.findOne({ _id: workspaceId, userId: userId as any });
  
  if (!workspace) {
    throw new NotFoundError('Workspace not found');
  }

  return workspace.resources;
};

export interface AddResourceData {
  name: string;
  quantity: number;
  unit: string;
  threshold: number;
}

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

  const workspace = await Workspace.findOne({ _id: workspaceId, userId: userId as any });
  
  if (!workspace) {
    throw new NotFoundError('Workspace not found');
  }

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

export const getResourceById = async (
  workspaceId: string,
  resourceId: string,
  userId: string
): Promise<IResourceItem> => {
  const workspace = await Workspace.findOne({ _id: workspaceId, userId: userId as any });
  
  if (!workspace) {
    throw new NotFoundError('Workspace not found');
  }

  const resource = workspace.resources.find((r) => r.id === resourceId);

  if (!resource) {
    throw new NotFoundError('Resource not found');
  }

  return resource;
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

  const workspace = await Workspace.findOne({ _id: workspaceId, userId: userId as any });
  
  if (!workspace) {
    throw new NotFoundError('Workspace not found');
  }

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
  const workspace = await Workspace.findOne({ _id: workspaceId, userId: userId as any });
  
  if (!workspace) {
    throw new NotFoundError('Workspace not found');
  }

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
  const workspace = await Workspace.findOne({ _id: workspaceId, userId: userId as any });
  
  if (!workspace) {
    throw new NotFoundError('Workspace not found');
  }

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
  const workspace = await Workspace.findOne({ _id: workspaceId, userId: userId as any });
  
  if (!workspace) {
    throw new NotFoundError('Workspace not found');
  }

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

export const getResourceStatistics = async (
  workspaceId: string,
  userId: string
): Promise<{
  total: number;
  critical: number;
  low: number;
  good: number;
  totalQuantity: number;
}> => {
  const workspace = await Workspace.findOne({ _id: workspaceId, userId: userId as any });
  
  if (!workspace) {
    throw new NotFoundError('Workspace not found');
  }

  const resources = workspace.resources;
  
  return {
    total: resources.length,
    critical: resources.filter(r => r.status === 'Critical').length,
    low: resources.filter(r => r.status === 'Low').length,
    good: resources.filter(r => r.status === 'Good').length,
    totalQuantity: resources.reduce((sum, r) => sum + r.quantity, 0)
  };
};

