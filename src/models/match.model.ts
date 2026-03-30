import { Schema, model } from 'mongoose';

export interface Match {
  match_id?: string;
  league_name?: string;
  season?: string;
  date?: string;
  venue?: string;
  home_team?: string;
  away_team?: string;
  home_score?: number;
  away_score?: number;
  status?: string;
  detail_url?: string;
}

const matchSchema = new Schema<Match>(
  {
    match_id: { type: String, index: true },
    league_name: String,
    season: String,
    date: String,
    venue: String,
    home_team: { type: String, index: true },
    away_team: { type: String, index: true },
    home_score: Number,
    away_score: Number,
    status: String,
    detail_url: String
  },
  {
    collection: 'matches',
    versionKey: false
  }
);

export const MatchModel = model<Match>('Match', matchSchema);
