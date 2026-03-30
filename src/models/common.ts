import { FilterQuery } from 'mongoose';

export interface PaginationQuery {
  page?: string;
  limit?: string;
  search?: string;
  team?: string;
}

export function getPagination(query: PaginationQuery) {
  const page = Math.max(Number(query.page || 1), 1);
  const limit = Math.min(Math.max(Number(query.limit || 20), 1), 200);
  const skip = (page - 1) * limit;
  return { page, limit, skip };
}

export function buildSearchFilter<T>(query: PaginationQuery, fields: string[]): FilterQuery<T> {
  const filter: Record<string, unknown> = {};

  if (query.team) {
    filter.team = new RegExp(query.team, 'i');
  }

  if (query.search) {
    filter.$or = fields.map((field) => ({ [field]: new RegExp(query.search as string, 'i') }));
  }

  return filter as FilterQuery<T>;
}
