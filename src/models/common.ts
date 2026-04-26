import { FilterQuery } from 'mongoose';

export interface PaginationQuery {
  page?: string;
  limit?: string;
  search?: string;
  team?: string;
  league_key?: string;
}

export function getPagination(query: PaginationQuery) {
  const page = Math.max(Number(query.page || 1), 1);
  const limit = Math.min(Math.max(Number(query.limit || 20), 1), 200);
  const skip = (page - 1) * limit;
  return { page, limit, skip };
}

export function buildLeagueFilter(query: PaginationQuery): Record<string, unknown> {
  const filter: Record<string, unknown> = {};
  if (query.league_key) {
    filter.league_key = query.league_key;
  }
  return filter;
}

export function buildSearchFilter<T>(query: PaginationQuery, fields: string[]): FilterQuery<T> {
  const filter: Record<string, unknown> = buildLeagueFilter(query);

  if (query.team) {
    filter.team = new RegExp(escapeRegex(query.team), 'i');
  }

  if (query.search) {
    filter.$or = fields.map((field) => ({ [field]: new RegExp(escapeRegex(query.search as string), 'i') }));
  }

  return filter as FilterQuery<T>;
}

export function escapeRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export const LEAGUES = [
  { league_key: 'liga-senior-femenina', league_name: 'Liga Senior Femenina' },
  { league_key: 'liga-senior-1', league_name: 'Liga Senior 1' },
  { league_key: 'liga-senior-2', league_name: 'Liga Senior 2' },
  { league_key: 'liga-senior-3-grupo-1', league_name: 'Liga Senior 3 Grupo 1' },
  { league_key: 'liga-senior-3-grupo-2', league_name: 'Liga Senior 3 Grupo 2' },
  { league_key: 'liga-senior-3-grupo-3', league_name: 'Liga Senior 3 Grupo 3' }
];

export function findLeagueByKey(leagueKey?: string) {
  return LEAGUES.find((item) => item.league_key === leagueKey);
}
