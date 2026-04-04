import { Request, Response } from 'express';
import { GoalieTotalModel } from '../models/goalie-total.model.js';
import { PlayerTotalModel } from '../models/player-total.model.js';
import { TeamModel } from '../models/team.model.js';

export async function getTeams(_req: Request, res: Response) {
  const [playerTeams, goalieTeams, teamStats] = await Promise.all([
    PlayerTotalModel.distinct('team'),
    GoalieTotalModel.distinct('team'),
    TeamModel.distinct('team')
  ]);

  const teams = Array.from(new Set([...playerTeams, ...goalieTeams, ...teamStats].filter(Boolean))).sort();
  res.json({ items: teams });
}
