import { Schema, model } from 'mongoose';

export interface GoalieTotal {
  goalie: string;
  team?: string;
  matches?: number;
  goals_allowed?: number;
  shots?: number;
  saves?: number;
  save_pct?: number;
  match_ids?: string[];
  last_scraped_at?: string;
}

const goalieTotalSchema = new Schema<GoalieTotal>(
  {
    goalie: { type: String, required: true, index: true },
    team: { type: String, index: true },
    matches: Number,
    goals_allowed: Number,
    shots: Number,
    saves: Number,
    save_pct: Number,
    match_ids: [String],
    last_scraped_at: String
  },
  {
    collection: 'goalie_totals',
    versionKey: false
  }
);

export const GoalieTotalModel = model<GoalieTotal>('GoalieTotal', goalieTotalSchema);
