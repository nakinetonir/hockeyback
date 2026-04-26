import { Router } from 'express';
import { getLeagues, getSummary } from '../controllers/dashboard.controller.js';

const router = Router();
router.get('/summary', getSummary);
router.get('/leagues', getLeagues);

export default router;
