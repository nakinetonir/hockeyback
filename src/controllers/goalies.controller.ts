import { Request, Response } from 'express';
import { GoalieMatchStatModel } from '../models/goalie-match-stat.model.js';
import { GoalieTotalModel } from '../models/goalie-total.model.js';
import { buildSearchFilter, escapeRegex, getPagination } from '../models/common.js';

export async function getGoalies(req: Request, res: Response) {
  const { page, limit, skip } = getPagination(req.query);
  const filter = buildSearchFilter(req.query, ['goalie', 'team', 'league_name']);

  const [items, total] = await Promise.all([
    GoalieTotalModel.find(filter).sort({ save_pct: -1, shots: -1, goalie: 1 }).skip(skip).limit(limit).lean(),
    GoalieTotalModel.countDocuments(filter)
  ]);

  res.json({ items, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } });
}

export async function getGoalieById(req: Request, res: Response) {
  const rawId = req.params.id;
  const id = Array.isArray(rawId) ? rawId[0] : rawId;
  const { league_key } = req.query as { league_key?: string };

  if (!id) {
    res.status(400).json({ message: 'ID inválido' });
    return;
  }

  const leagueFilter = league_key ? { league_key } : {};
  const goalieFilter = { ...leagueFilter, $or: [{ _id: id }, { goalie: new RegExp(`^${escapeRegex(id)}$`, 'i') }] };
  const matchesFilter = { ...leagueFilter, goalie: new RegExp(`^${escapeRegex(id)}$`, 'i') };

  const [goalie, matches] = await Promise.all([
    GoalieTotalModel.findOne(goalieFilter).lean(),
    GoalieMatchStatModel.find(matchesFilter).sort({ match_id: -1 }).lean()
  ]);

  if (!goalie) {
    res.status(404).json({ message: 'Portero no encontrado' });
    return;
  }

  res.json({ goalie, matches });
}
