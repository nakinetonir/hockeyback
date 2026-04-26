import { Schema, model } from 'mongoose';

export interface GoalieMatchStat {
  league_key?: string;
  league_name?: string;
  match_id?: string;
  goalie: string;
  team?: string;
  goals_allowed?: number;
  shots?: number;
  scraped_at?: string;
}

const goalieMatchStatSchema = new Schema<GoalieMatchStat>(
  {
    league_key: { type: String, index: true },
    league_name: String,
    match_id: { type: String, index: true },
    goalie: { type: String, required: true, index: true },
    team: { type: String, index: true },
    goals_allowed: Number,
    shots: Number,
    scraped_at: String
  },
  {
    collection: 'goalie_match_stats',
    versionKey: false
  }
);

export const GoalieMatchStatModel = model<GoalieMatchStat>('GoalieMatchStat', goalieMatchStatSchema);
