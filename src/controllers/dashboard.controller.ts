import { Request, Response } from 'express';
import { getDashboardSummary } from '../services/dashboard.service.js';

export async function getSummary(_req: Request, res: Response) {
  const data = await getDashboardSummary();
  res.json(data);
}
