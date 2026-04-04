import { Schema, model } from 'mongoose';

export interface TeamSummary {
  team: string;
  matches?: number;
  goals_for?: number;
  goals_against?: number;
  shots_for?: number;
  shots_against?: number;
  avg_goals_for?: number | null;
  avg_goals_against?: number | null;
  avg_shots_for?: number | null;
  avg_shots_against?: number | null;
  last_scraped_at?: string;
}

const teamSchema = new Schema<TeamSummary>(
  {
    team: { type: String, required: true, index: true },
    matches: Number,
    goals_for: Number,
    goals_against: Number,
    shots_for: Number,
    shots_against: Number,
    avg_goals_for: Number,
    avg_goals_against: Number,
    avg_shots_for: Number,
    avg_shots_against: Number,
    last_scraped_at: String,
  },
  {
    collection: 'team',
    versionKey: false,
  }
);

export const TeamModel = model<TeamSummary>('Team', teamSchema);
