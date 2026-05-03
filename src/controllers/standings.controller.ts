import { Request, Response } from 'express';
import { StandingModel } from '../models/standing.model.js';
import { escapeRegex, getPagination } from '../models/common.js';

export async function getStandings(req: Request, res: Response) {
  const { page, limit, skip } = getPagination(req.query);
  const { league_key, team, search } = req.query as { league_key?: string; team?: string; search?: string };

  const filter: Record<string, unknown> = {};
  if (league_key) {
    filter.league_key = league_key;
  }
  if (team) {
    filter.team = new RegExp(escapeRegex(team), 'i');
  }
  if (search) {
    const regex = new RegExp(escapeRegex(search), 'i');
    filter.$or = [{ team: regex }, { short_name: regex }];
  }

  const [items, total] = await Promise.all([
    StandingModel.find(filter)
      .sort({ league_key: 1, position: 1, points: -1, goal_difference: -1, goals_for: -1, team: 1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    StandingModel.countDocuments(filter),
  ]);

  res.json({ items, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } });
}
