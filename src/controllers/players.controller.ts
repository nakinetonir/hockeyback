import { Request, Response } from 'express';
import { PlayerMatchStatModel } from '../models/player-match-stat.model.js';
import { PlayerTotalModel } from '../models/player-total.model.js';
import { buildSearchFilter, escapeRegex, getPagination } from '../models/common.js';

export async function getPlayers(req: Request, res: Response) {
  const { page, limit, skip } = getPagination(req.query);
  const filter = buildSearchFilter(req.query, ['player', 'team', 'league_name']);

  const [items, total] = await Promise.all([
    PlayerTotalModel.find(filter).sort({ goals: -1, assists: -1, player: 1 }).skip(skip).limit(limit).lean(),
    PlayerTotalModel.countDocuments(filter)
  ]);

  res.json({ items, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } });
}

export async function getPlayerById(req: Request, res: Response) {
  const rawId = req.params.id;
  const id = Array.isArray(rawId) ? rawId[0] : rawId;
  const { league_key } = req.query as { league_key?: string };

  if (!id) {
    res.status(400).json({ message: 'ID inválido' });
    return;
  }

  const leagueFilter = league_key ? { league_key } : {};
  const playerFilter = { ...leagueFilter, $or: [{ _id: id }, { player: new RegExp(`^${escapeRegex(id)}$`, 'i') }] };
  const matchesFilter = { ...leagueFilter, player: new RegExp(`^${escapeRegex(id)}$`, 'i') };

  const [player, matches] = await Promise.all([
    PlayerTotalModel.findOne(playerFilter).lean(),
    PlayerMatchStatModel.find(matchesFilter).sort({ match_id: -1 }).lean()
  ]);

  if (!player) {
    res.status(404).json({ message: 'Jugador no encontrado' });
    return;
  }

  res.json({ player, matches });
}
