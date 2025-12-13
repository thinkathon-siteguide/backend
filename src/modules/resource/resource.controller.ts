import { Response, NextFunction } from 'express';
import { AuthRequest } from '../../middlewares/auth.middleware';
import * as resourceService from './resource.service';
import { SuccessResponse } from '../../core/success.response';

export const getAllResources = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const resources = await resourceService.getAllResources(
      req.params.workspaceId,
      req.user._id
    );
    new SuccessResponse('Resources retrieved successfully', resources).send(res);
  } catch (error) {
    next(error);
  }
};

export const getResource = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const resource = await resourceService.getResourceById(
      req.params.workspaceId,
      req.params.resourceId,
      req.user._id
    );
    new SuccessResponse('Resource retrieved successfully', resource).send(res);
  } catch (error) {
    next(error);
  }
};

export const addResource = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const resource = await resourceService.addResource(
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
    const resource = await resourceService.updateResourceQuantity(
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

export const updateResource = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const resource = await resourceService.updateResource(
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

export const deleteResource = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    await resourceService.deleteResource(
      req.params.workspaceId,
      req.params.resourceId,
      req.user._id
    );
    new SuccessResponse('Resource deleted successfully', null, 204).send(res);
  } catch (error) {
    next(error);
  }
};

export const bulkReplaceResources = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const resources = await resourceService.bulkReplaceResources(
      req.params.workspaceId,
      req.user._id,
      req.body.resources
    );
    new SuccessResponse('Resources replaced successfully', resources).send(res);
  } catch (error) {
    next(error);
  }
};

export const getResourceStatistics = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const stats = await resourceService.getResourceStatistics(
      req.params.workspaceId,
      req.user._id
    );
    new SuccessResponse('Resource statistics retrieved successfully', stats).send(res);
  } catch (error) {
    next(error);
  }
};

