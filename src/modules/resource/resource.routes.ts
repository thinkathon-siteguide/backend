import { Router } from 'express';
import * as resourceController from './resource.controller';
import { protect } from '../../middlewares/auth.middleware';

const router = Router();

router.use(protect);

router
  .route('/:workspaceId/resources')
  .get(resourceController.getAllResources)
  .post(resourceController.addResource)
  .put(resourceController.bulkReplaceResources);

router.get('/:workspaceId/resources/statistics', resourceController.getResourceStatistics);

router
  .route('/:workspaceId/resources/:resourceId')
  .get(resourceController.getResource)
  .put(resourceController.updateResource)
  .delete(resourceController.deleteResource);

router.patch(
  '/:workspaceId/resources/:resourceId/quantity',
  resourceController.updateResourceQuantity
);

export default router;

