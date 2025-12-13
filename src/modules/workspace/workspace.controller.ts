import { Response, NextFunction } from 'express';
import { AuthRequest } from '../../middlewares/auth.middleware';
import * as workspaceService from './workspace.service';
import { SuccessResponse } from '../../core/success.response';

export const getAllWorkspaces = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const workspaces = await workspaceService.getAllWorkspaces(req.user._id);
    new SuccessResponse('Workspaces retrieved successfully', workspaces).send(res);
  } catch (error) {
    next(error);
  }
};

export const getWorkspace = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const workspace = await workspaceService.getWorkspaceById(req.params.id, req.user._id);
    new SuccessResponse('Workspace retrieved successfully', workspace).send(res);
  } catch (error) {
    next(error);
  }
};

export const createWorkspace = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const workspace = await workspaceService.createWorkspace(req.user._id, req.body);
    new SuccessResponse('Workspace created successfully', workspace, 201).send(res);
  } catch (error) {
    next(error);
  }
};

export const updateWorkspace = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const workspace = await workspaceService.updateWorkspace(req.params.id, req.user._id, req.body);
    new SuccessResponse('Workspace updated successfully', workspace).send(res);
  } catch (error) {
    next(error);
  }
};

export const deleteWorkspace = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    await workspaceService.deleteWorkspace(req.params.id, req.user._id);
    new SuccessResponse('Workspace deleted successfully', null, 204).send(res);
  } catch (error) {
    next(error);
  }
};

export const updateProgress = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const workspace = await workspaceService.updateProgress(
      req.params.id,
      req.user._id,
      req.body.progress
    );
    new SuccessResponse('Progress updated successfully', workspace).send(res);
  } catch (error) {
    next(error);
  }
};

export const toggleStatus = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const workspace = await workspaceService.toggleStatus(req.params.id, req.user._id);
    new SuccessResponse('Status toggled successfully', workspace).send(res);
  } catch (error) {
    next(error);
  }
};

export const getAllResources = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const resources = await workspaceService.getAllResources(req.params.workspaceId, req.user._id);
    new SuccessResponse('Resources retrieved successfully', resources).send(res);
  } catch (error) {
    next(error);
  }
};

export const addResource = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const resource = await workspaceService.addResource(
      req.params.workspaceId,
      req.user._id,
      req.body
    );
    new SuccessResponse('Resource added successfully', resource, 201).send(res);
  } catch (error) {
    next(error);
  }
};

export const updateResourceQuantity = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const resource = await workspaceService.updateResourceQuantity(
      req.params.workspaceId,
      req.params.resourceId,
      req.user._id,
      req.body.quantity
    );
    new SuccessResponse('Resource quantity updated successfully', resource).send(res);
  } catch (error) {
    next(error);
  }
};

export const updateResource = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const resource = await workspaceService.updateResource(
      req.params.workspaceId,
      req.params.resourceId,
      req.user._id,
      req.body
    );
    new SuccessResponse('Resource updated successfully', resource).send(res);
  } catch (error) {
    next(error);
  }
};

export const deleteResource = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    await workspaceService.deleteResource(
      req.params.workspaceId,
      req.params.resourceId,
      req.user._id
    );
    new SuccessResponse('Resource deleted successfully', null, 204).send(res);
  } catch (error) {
    next(error);
  }
};

export const bulkReplaceResources = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const resources = await workspaceService.bulkReplaceResources(
      req.params.workspaceId,
      req.user._id,
      req.body.resources
    );
    new SuccessResponse('Resources replaced successfully', resources).send(res);
  } catch (error) {
    next(error);
  }
};

export const saveArchitecturePlan = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const plan = await workspaceService.saveArchitecturePlan(
      req.params.workspaceId,
      req.user._id,
      req.body
    );
    new SuccessResponse('Architecture plan saved successfully', plan, 201).send(res);
  } catch (error) {
    next(error);
  }
};

export const getArchitecturePlan = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const plan = await workspaceService.getArchitecturePlan(req.params.workspaceId, req.user._id);
    new SuccessResponse('Architecture plan retrieved successfully', plan).send(res);
  } catch (error) {
    next(error);
  }
};

export const saveSafetyReport = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const report = await workspaceService.saveSafetyReport(
      req.params.workspaceId,
      req.user._id,
      req.body
    );
    new SuccessResponse('Safety report saved successfully', report, 201).send(res);
  } catch (error) {
    next(error);
  }
};

export const getAllSafetyReports = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const reports = await workspaceService.getAllSafetyReports(
      req.params.workspaceId,
      req.user._id
    );
    new SuccessResponse('Safety reports retrieved successfully', reports).send(res);
  } catch (error) {
    next(error);
  }
};

export const getSafetyReport = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const report = await workspaceService.getSafetyReportById(
      req.params.workspaceId,
      req.params.reportId,
      req.user._id
    );
    new SuccessResponse('Safety report retrieved successfully', report).send(res);
  } catch (error) {
    next(error);
  }
};
