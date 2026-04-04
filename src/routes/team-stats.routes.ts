import { Router } from 'express';
import { getTeamStats } from '../controllers/team-stats.controller.js';

const router = Router();
router.get('/', getTeamStats);

export default router;
