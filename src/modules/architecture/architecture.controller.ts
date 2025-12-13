import { Response, NextFunction } from 'express';
import { AuthRequest } from '../../middlewares/auth.middleware';
import * as architectureService from './architecture.service';
import { SuccessResponse } from '../../core/success.response';

export const saveArchitecturePlan = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const plan = await architectureService.saveArchitecturePlan(
      req.params.workspaceId,
      req.user._id,
      req.body
    );
    new SuccessResponse('Architecture plan saved successfully', plan, 201).send(res);
  } catch (error) {
    next(error);
  }
};

export const getArchitecturePlan = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const plan = await architectureService.getArchitecturePlan(
      req.params.workspaceId,
      req.user._id
    );
    new SuccessResponse('Architecture plan retrieved successfully', plan).send(res);
  } catch (error) {
    next(error);
  }
};

export const updateArchitecturePlan = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const plan = await architectureService.updateArchitecturePlan(
      req.params.workspaceId,
      req.user._id,
      req.body
    );
    new SuccessResponse('Architecture plan updated successfully', plan).send(res);
  } catch (error) {
    next(error);
  }
};

export const deleteArchitecturePlan = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    await architectureService.deleteArchitecturePlan(
      req.params.workspaceId,
      req.user._id
    );
    new SuccessResponse('Architecture plan deleted successfully', null, 204).send(res);
  } catch (error) {
    next(error);
  }
};

export const getArchitectureSections = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const sections = await architectureService.getArchitectureSections(
      req.params.workspaceId,
      req.user._id
    );
    new SuccessResponse('Architecture sections retrieved successfully', sections).send(res);
  } catch (error) {
    next(error);
  }
};

export const getArchitectureMaterials = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const materials = await architectureService.getArchitectureMaterials(
      req.params.workspaceId,
      req.user._id
    );
    new SuccessResponse('Architecture materials retrieved successfully', materials).send(res);
  } catch (error) {
    next(error);
  }
};

export const getArchitectureStages = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const stages = await architectureService.getArchitectureStages(
      req.params.workspaceId,
      req.user._id
    );
    new SuccessResponse('Architecture stages retrieved successfully', stages).send(res);
  } catch (error) {
    next(error);
  }
};

export const addArchitectureSection = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const plan = await architectureService.addArchitectureSection(
      req.params.workspaceId,
      req.user._id,
      req.body
    );
    new SuccessResponse('Architecture section added successfully', plan, 201).send(res);
  } catch (error) {
    next(error);
  }
};

export const addArchitectureMaterial = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const plan = await architectureService.addArchitectureMaterial(
      req.params.workspaceId,
      req.user._id,
      req.body
    );
    new SuccessResponse('Architecture material added successfully', plan, 201).send(res);
  } catch (error) {
    next(error);
  }
};

export const addArchitectureStage = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const plan = await architectureService.addArchitectureStage(
      req.params.workspaceId,
      req.user._id,
      req.body
    );
    new SuccessResponse('Architecture stage added successfully', plan, 201).send(res);
  } catch (error) {
    next(error);
  }
};

