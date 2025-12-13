import { Response, NextFunction } from 'express';
import { AuthRequest } from './auth.middleware';
import { ForbiddenError, NotFoundError } from '../core/error.response';
import { Workspace } from '../modules/workspace/models/Workspace';

export const verifyWorkspaceOwnership = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const workspaceId = req.params.workspaceId || req.params.id;

    if (!workspaceId) {
      throw new NotFoundError('Workspace ID is required');
    }

    const workspace = await Workspace.findById(workspaceId);

    if (!workspace) {
      throw new NotFoundError('Workspace not found');
    }

    if (workspace.userId.toString() !== req.user._id.toString()) {
      throw new ForbiddenError('You do not have permission to access this workspace');
    }

    req.workspace = workspace;
    next();
  } catch (error) {
    next(error);
  }
};

declare module 'express' {
  interface Request {
    workspace?: any;
  }
}
