import { Schema, model } from 'mongoose';

export interface TeamShotTotal {
  team: string;
  matches?: number;
  shots_for?: number;
  shots_against?: number;
  avg_shots_for?: number | null;
  avg_shots_against?: number | null;
  last_scraped_at?: string;
}

const teamShotTotalSchema = new Schema<TeamShotTotal>(
  {
    team: { type: String, required: true, index: true },
    matches: Number,
    shots_for: Number,
    shots_against: Number,
    avg_shots_for: Number,
    avg_shots_against: Number,
    last_scraped_at: String
  },
  {
    collection: 'team_shot_totals',
    versionKey: false
  }
);

export const TeamShotTotalModel = model<TeamShotTotal>('TeamShotTotal', teamShotTotalSchema);
