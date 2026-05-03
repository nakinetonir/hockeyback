import { Schema, model } from 'mongoose';

export interface Standing {
  league_id: string;
  league_key: string;
  league_name: string;
  league_url: string;
  logo_url: string;
  team: string;
  short_name: string;
  position: number;
  points: number;
  matches: number;
  wins: number;
  draws: number;
  losses: number;
  goals_for: number;
  goals_against: number;
  goal_difference: number;
  penalty_points: number;
  notes: string;
  scraped_at: string;
  bonus_points?: number;
}

const standingSchema = new Schema<Standing>(
  {
    league_id: { type: String, default: '' },
    league_key: { type: String, required: true, index: true },
    league_name: { type: String, default: '' },
    league_url: { type: String, default: '' },
    logo_url: { type: String, default: '' },
    team: { type: String, required: true, index: true },
    short_name: { type: String, default: '' },
    position: { type: Number, default: 0 },
    points: { type: Number, default: 0 },
    matches: { type: Number, default: 0 },
    wins: { type: Number, default: 0 },
    draws: { type: Number, default: 0 },
    losses: { type: Number, default: 0 },
    goals_for: { type: Number, default: 0 },
    goals_against: { type: Number, default: 0 },
    goal_difference: { type: Number, default: 0 },
    penalty_points: { type: Number, default: 0 },
    notes: { type: String, default: '' },
    scraped_at: { type: String, default: '' },
    bonus_points: { type: Number, default: 0 },
  },
  {
    collection: 'standings',
    versionKey: false,
  }
);

standingSchema.index({ league_key: 1, position: 1 });
standingSchema.index({ league_key: 1, team: 1 }, { unique: false });

export const StandingModel = model<Standing>('Standing', standingSchema);
