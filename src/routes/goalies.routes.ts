import { Router } from 'express';
import { getGoalieById, getGoalies } from '../controllers/goalies.controller.js';

const router = Router();
router.get('/', getGoalies);
router.get('/:id', getGoalieById);

export default router;
