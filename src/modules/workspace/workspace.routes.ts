import { Router } from 'express';
import * as workspaceController from './workspace.controller';
import { protect } from '../../middlewares/auth.middleware';

const router = Router();

router.use(protect);

router
  .route('/')
  .get(workspaceController.getAllWorkspaces)
  .post(workspaceController.createWorkspace);

router
  .route('/:id')
  .get(workspaceController.getWorkspace)
  .put(workspaceController.updateWorkspace)
  .delete(workspaceController.deleteWorkspace);

router.patch('/:id/progress', workspaceController.updateProgress);
router.patch('/:id/status', workspaceController.toggleStatus);

router
  .route('/:workspaceId/resources')
  .get(workspaceController.getAllResources)
  .post(workspaceController.addResource)
  .put(workspaceController.bulkReplaceResources);

router
  .route('/:workspaceId/resources/:resourceId')
  .put(workspaceController.updateResource)
  .delete(workspaceController.deleteResource);

router.patch(
  '/:workspaceId/resources/:resourceId/quantity',
  workspaceController.updateResourceQuantity
);

router
  .route('/:workspaceId/architecture')
  .get(workspaceController.getArchitecturePlan)
  .post(workspaceController.saveArchitecturePlan);

router
  .route('/:workspaceId/safety-reports')
  .get(workspaceController.getAllSafetyReports)
  .post(workspaceController.saveSafetyReport);

router
  .route('/:workspaceId/safety-reports/:reportId')
  .get(workspaceController.getSafetyReport);

export default router;

