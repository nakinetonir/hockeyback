import { GoalieTotalModel } from '../models/goalie-total.model.js';
import { MatchModel } from '../models/match.model.js';
import { PlayerTotalModel } from '../models/player-total.model.js';
import { TeamModel } from '../models/team.model.js';

export async function getDashboardSummary() {
  const [totalMatches, totalPlayers, totalGoalies, topScorers, topAssisters, topGoalies, topTeams] = await Promise.all([
    MatchModel.countDocuments(),
    PlayerTotalModel.countDocuments(),
    GoalieTotalModel.countDocuments(),
    PlayerTotalModel.find().sort({ goals: -1, assists: -1, player: 1 }).limit(10).lean(),
    PlayerTotalModel.find().sort({ assists: -1, goals: -1, player: 1 }).limit(10).lean(),
    GoalieTotalModel.find().sort({ save_pct: -1, shots: -1, goalie: 1 }).limit(10).lean(),
    TeamModel.find().sort({ goals_for: -1, shots_for: -1, team: 1 }).limit(10).lean()
  ]);

  return {
    totalMatches,
    totalPlayers,
    totalGoalies,
    topScorers,
    topAssisters,
    topGoalies,
    topTeams
  };
}
