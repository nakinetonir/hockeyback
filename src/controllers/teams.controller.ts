import { Request, Response } from 'express';
import { GoalieTotalModel } from '../models/goalie-total.model.js';
import { PlayerTotalModel } from '../models/player-total.model.js';
import { TeamModel } from '../models/team.model.js';
import { buildLeagueFilter } from '../models/common.js';

export async function getTeams(req: Request, res: Response) {
  const filter = buildLeagueFilter(req.query);

  const [playerTeams, goalieTeams, teamStats] = await Promise.all([
    PlayerTotalModel.distinct('team', filter),
    GoalieTotalModel.distinct('team', filter),
    TeamModel.distinct('team', filter)
  ]);

  const teams = Array.from(new Set([...playerTeams, ...goalieTeams, ...teamStats].filter(Boolean))).sort();
  res.json({ items: teams });
}
