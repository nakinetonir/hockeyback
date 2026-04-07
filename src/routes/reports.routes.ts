import { Router } from 'express';
import { getPlayerAnalysis } from '../controllers/reports.controller.js';

const router = Router();

router.post('/player-analysis', getPlayerAnalysis);

export default router;
