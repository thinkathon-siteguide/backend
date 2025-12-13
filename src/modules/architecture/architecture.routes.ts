import { Router } from 'express';
import * as architectureController from './architecture.controller';
import { protect } from '../../middlewares/auth.middleware';

const router = Router();

router.use(protect);

router
  .route('/:workspaceId/architecture')
  .get(architectureController.getArchitecturePlan)
  .post(architectureController.saveArchitecturePlan)
  .put(architectureController.updateArchitecturePlan)
  .delete(architectureController.deleteArchitecturePlan);

router.get('/:workspaceId/architecture/sections', architectureController.getArchitectureSections);
router.post('/:workspaceId/architecture/sections', architectureController.addArchitectureSection);

router.get('/:workspaceId/architecture/materials', architectureController.getArchitectureMaterials);
router.post('/:workspaceId/architecture/materials', architectureController.addArchitectureMaterial);

router.get('/:workspaceId/architecture/stages', architectureController.getArchitectureStages);
router.post('/:workspaceId/architecture/stages', architectureController.addArchitectureStage);

export default router;

