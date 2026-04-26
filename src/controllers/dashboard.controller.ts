import { Request, Response } from 'express';
import { LEAGUES } from '../models/common.js';
import { getDashboardSummary } from '../services/dashboard.service.js';

export async function getSummary(req: Request, res: Response) {
  const { league_key } = req.query as { league_key?: string };
  const data = await getDashboardSummary(league_key);
  res.json(data);
}

export async function getLeagues(_req: Request, res: Response) {
  res.json({ items: LEAGUES });
}
