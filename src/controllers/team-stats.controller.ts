import { Request, Response } from 'express';
import { TeamModel } from '../models/team.model.js';
import { getPagination } from '../models/common.js';

export async function getTeamStats(req: Request, res: Response) {
  const { page, limit, skip } = getPagination(req.query);
  const { team } = req.query as { team?: string };

  const filter: Record<string, unknown> = {};
  if (team) {
    filter.team = new RegExp(team, 'i');
  }

  const [items, total] = await Promise.all([
    TeamModel.find(filter)
      .sort({ goals_for: -1, shots_for: -1, team: 1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    TeamModel.countDocuments(filter),
  ]);

  res.json({ items, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } });
}
