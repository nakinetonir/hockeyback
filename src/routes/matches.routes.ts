import { Router } from 'express';
import { getMatchById, getMatches, getMatchesByLeague } from '../controllers/matches.controller.js';

const router = Router();
router.get('/', getMatches);
router.get('/league/:leagueKey', getMatchesByLeague);
router.get('/:id', getMatchById);

export default router;
