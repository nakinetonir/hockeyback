import { Request, Response } from 'express';
import { MatchModel } from '../models/match.model.js';
import { GoalieMatchStatModel } from '../models/goalie-match-stat.model.js';
import { PlayerMatchStatModel } from '../models/player-match-stat.model.js';
import { buildLeagueFilter, escapeRegex, getPagination } from '../models/common.js';

function addAnd(filter: Record<string, unknown>, clause: Record<string, unknown>) {
  if (Object.keys(clause).length === 0) {
    return filter;
  }
  if (Object.keys(filter).length === 0) {
    return clause;
  }
  return { $and: [filter, clause] };
}

export async function getMatches(req: Request, res: Response) {
  const { page, limit, skip } = getPagination(req.query);
  const { team, search } = req.query as { team?: string; search?: string; league_key?: string };

  let filter: Record<string, unknown> = buildLeagueFilter(req.query);

  if (team) {
    filter = addAnd(filter, {
      $or: [
        { home_team: new RegExp(escapeRegex(team), 'i') },
        { away_team: new RegExp(escapeRegex(team), 'i') }
      ]
    });
  }

  if (search) {
    filter = addAnd(filter, {
      $or: [
        { home_team: new RegExp(escapeRegex(search), 'i') },
        { away_team: new RegExp(escapeRegex(search), 'i') },
        { venue: new RegExp(escapeRegex(search), 'i') },
        { date: new RegExp(escapeRegex(search), 'i') },
        { title: new RegExp(escapeRegex(search), 'i') },
        { league_name: new RegExp(escapeRegex(search), 'i') }
      ]
    });
  }

  const [items, total] = await Promise.all([
    MatchModel.find(filter).sort({ date: -1, match_id: -1 }).skip(skip).limit(limit).lean(),
    MatchModel.countDocuments(filter)
  ]);

  res.json({ items, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } });
}

export async function getMatchesByLeague(req: Request, res: Response) {
  const originalQuery = req.query;
  req.query = { ...originalQuery, league_key: req.params.leagueKey };
  return getMatches(req, res);
}

export async function getMatchById(req: Request, res: Response) {
  const { id } = req.params;
  const { league_key } = req.query as { league_key?: string };
  const leagueFilter = league_key ? { league_key } : {};

  const [match, playerStats, goalieStats] = await Promise.all([
    MatchModel.findOne({ ...leagueFilter, $or: [{ match_id: id }, { _id: id }] }).lean(),
    PlayerMatchStatModel.find({ ...leagueFilter, match_id: id }).sort({ team: 1, goals: -1, assists: -1, player: 1 }).lean(),
    GoalieMatchStatModel.find({ ...leagueFilter, match_id: id }).sort({ team: 1, shots: -1, goalie: 1 }).lean()
  ]);

  if (!match) {
    res.status(404).json({ message: 'Partido no encontrado' });
    return;
  }

  res.json({ match, playerStats, goalieStats });
}
