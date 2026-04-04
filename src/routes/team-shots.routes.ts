import { Router } from 'express';
import { getTeamShotTotals } from '../controllers/team-shots.controller.js';

const router = Router();
router.get('/', getTeamShotTotals);

export default router;
