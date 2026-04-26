import { Request, Response } from 'express';
import { TeamShotTotalModel } from '../models/team-shot-total.model.js';
import { buildLeagueFilter, escapeRegex, getPagination } from '../models/common.js';

export async function getTeamShotTotals(req: Request, res: Response) {
  const { page, limit, skip } = getPagination(req.query);
  const { team } = req.query as { team?: string };

  const filter: Record<string, unknown> = buildLeagueFilter(req.query);
  if (team) {
    filter.team = new RegExp(escapeRegex(team), 'i');
  }

  const [items, total] = await Promise.all([
    TeamShotTotalModel.find(filter)
      .sort({ shots_for: -1, shots_against: 1, team: 1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    TeamShotTotalModel.countDocuments(filter),
  ]);

  res.json({ items, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } });
}
