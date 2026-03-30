import { Request, Response } from 'express';
import { MatchModel } from '../models/match.model.js';
import { GoalieMatchStatModel } from '../models/goalie-match-stat.model.js';
import { PlayerMatchStatModel } from '../models/player-match-stat.model.js';
import { getPagination } from '../models/common.js';

export async function getMatches(req: Request, res: Response) {
  const { page, limit, skip } = getPagination(req.query);
  const { team, search } = req.query as { team?: string; search?: string };

  const filter: Record<string, unknown> = {};

  if (team) {
    filter.$or = [
      { home_team: new RegExp(team, 'i') },
      { away_team: new RegExp(team, 'i') }
    ];
  }

  if (search) {
    const clauses = [
      { home_team: new RegExp(search, 'i') },
      { away_team: new RegExp(search, 'i') },
      { venue: new RegExp(search, 'i') },
      { date: new RegExp(search, 'i') },
      { title: new RegExp(search, 'i') }
    ];

    if (filter.$or) {
      filter.$and = [{ $or: filter.$or }, { $or: clauses }];
      delete filter.$or;
    } else {
      filter.$or = clauses;
    }
  }

  const [items, total] = await Promise.all([
    MatchModel.find(filter).sort({ date: -1, match_id: -1 }).skip(skip).limit(limit).lean(),
    MatchModel.countDocuments(filter)
  ]);

  res.json({ items, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } });
}

export async function getMatchById(req: Request, res: Response) {
  const { id } = req.params;

  const [match, playerStats, goalieStats] = await Promise.all([
    MatchModel.findOne({ $or: [{ match_id: id }, { _id: id }] }).lean(),
    PlayerMatchStatModel.find({ match_id: id }).sort({ team: 1, goals: -1, assists: -1, player: 1 }).lean(),
    GoalieMatchStatModel.find({ match_id: id }).sort({ team: 1, shots: -1, goalie: 1 }).lean()
  ]);

  if (!match) {
    res.status(404).json({ message: 'Partido no encontrado' });
    return;
  }

  res.json({ match, playerStats, goalieStats });
}
