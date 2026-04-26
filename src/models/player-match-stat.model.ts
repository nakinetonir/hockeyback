import { Schema, model } from 'mongoose';

export interface PlayerMatchStat {
  league_key?: string;
  league_name?: string;
  match_id?: string;
  player: string;
  team?: string;
  goals?: number;
  assists?: number;
  scraped_at?: string;
}

const playerMatchStatSchema = new Schema<PlayerMatchStat>(
  {
    league_key: { type: String, index: true },
    league_name: String,
    match_id: { type: String, index: true },
    player: { type: String, required: true, index: true },
    team: { type: String, index: true },
    goals: Number,
    assists: Number,
    scraped_at: String
  },
  {
    collection: 'player_match_stats',
    versionKey: false
  }
);

export const PlayerMatchStatModel = model<PlayerMatchStat>('PlayerMatchStat', playerMatchStatSchema);
