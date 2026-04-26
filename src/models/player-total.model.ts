import { Schema, model } from 'mongoose';

export interface PlayerTotal {
  league_key?: string;
  league_name?: string;
  player: string;
  team?: string;
  matches?: number;
  goals?: number;
  assists?: number;
  points?: number;
  match_ids?: string[];
  last_scraped_at?: string;
}

const playerTotalSchema = new Schema<PlayerTotal>(
  {
    league_key: { type: String, index: true },
    league_name: String,
    player: { type: String, required: true, index: true },
    team: { type: String, index: true },
    matches: Number,
    goals: Number,
    assists: Number,
    points: Number,
    match_ids: [String],
    last_scraped_at: String
  },
  {
    collection: 'player_totals',
    versionKey: false
  }
);

export const PlayerTotalModel = model<PlayerTotal>('PlayerTotal', playerTotalSchema);
