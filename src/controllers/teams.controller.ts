import { Request, Response } from 'express';
import { GoalieTotalModel } from '../models/goalie-total.model.js';
import { PlayerTotalModel } from '../models/player-total.model.js';

export async function getTeams(_req: Request, res: Response) {
  const [playerTeams, goalieTeams] = await Promise.all([
    PlayerTotalModel.distinct('team'),
    GoalieTotalModel.distinct('team')
  ]);

  const teams = Array.from(new Set([...playerTeams, ...goalieTeams].filter(Boolean))).sort();
  res.json({ items: teams });
}
