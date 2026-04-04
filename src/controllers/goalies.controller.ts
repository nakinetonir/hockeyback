import { Request, Response } from 'express';
import { GoalieMatchStatModel } from '../models/goalie-match-stat.model.js';
import { GoalieTotalModel } from '../models/goalie-total.model.js';
import { buildSearchFilter, getPagination } from '../models/common.js';

export async function getGoalies(req: Request, res: Response) {
  const { page, limit, skip } = getPagination(req.query);
  const filter = buildSearchFilter(req.query, ['goalie']);

  const [items, total] = await Promise.all([
    GoalieTotalModel.find(filter).sort({ save_pct: -1, shots: -1, goalie: 1 }).skip(skip).limit(limit).lean(),
    GoalieTotalModel.countDocuments(filter)
  ]);

  res.json({ items, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } });
}

export async function getGoalieById(req: Request, res: Response) {
  const rawId = req.params.id;
  const id = Array.isArray(rawId) ? rawId[0] : rawId;

  if (!id) {
    res.status(400).json({ message: 'ID inválido' });
    return;
  }

  const [goalie, matches] = await Promise.all([
    GoalieTotalModel.findOne({ $or: [{ _id: id }, { goalie: new RegExp(`^${escapeRegex(id)}$`, 'i') }] }).lean(),
    GoalieMatchStatModel.find({ $or: [{ goalie: new RegExp(`^${escapeRegex(id)}$`, 'i') }] }).sort({ match_id: -1 }).lean()
  ]);

  if (!goalie) {
    res.status(404).json({ message: 'Portero no encontrado' });
    return;
  }

  res.json({ goalie, matches });
}

function escapeRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
