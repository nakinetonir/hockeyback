import { Router } from 'express';
import { getMatchById, getMatches } from '../controllers/matches.controller.js';

const router = Router();
router.get('/', getMatches);
router.get('/:id', getMatchById);

export default router;
