import { Request, Response } from 'express';
import { GoalieTotalModel } from '../models/goalie-total.model.js';
import { PlayerTotalModel } from '../models/player-total.model.js';
import { TeamShotTotalModel } from '../models/team-shot-total.model.js';

export async function getTeams(_req: Request, res: Response) {
  const [playerTeams, goalieTeams, shotTeams] = await Promise.all([
    PlayerTotalModel.distinct('team'),
    GoalieTotalModel.distinct('team'),
    TeamShotTotalModel.distinct('team')
  ]);

  const teams = Array.from(new Set([...playerTeams, ...goalieTeams, ...shotTeams].filter(Boolean))).sort();
  res.json({ items: teams });
}
