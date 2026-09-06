// 🤖 AGENT 8: PREDICTION MODEL B (Match Outcome)
// کار: پیش‌بینی نتیجه مسابقه

import { logger } from '../utils/logger';

class PredictionModelBAgent {
  async executeAgent(featuredMatches: any[]): Promise<any[]> {
    logger.info('🤖 [AGENT 8] Model B: Match Outcome Prediction...');
    
    const predictions = [];

    for (const match of featuredMatches) {
      const features = match.features;
      
      // Model B: Match Outcome (1X2)
      const homeWinProb = this.calculateOutcomeProbability(
        features.home_team_strength,
        features.away_team_strength,
        features.h2h_advantage,
        1 // Home advantage multiplier
      );
      
      const awayWinProb = this.calculateOutcomeProbability(
        features.away_team_strength,
        features.home_team_strength,
        -features.h2h_advantage,
        0.95 // Away disadvantage
      );
      
      const drawProb = 1 - homeWinProb - awayWinProb;

      const prediction = {
        match_id: match.hermes_id,
        model: 'Model-B-MatchOutcome',
        predictions: {
          home_win_prob: Math.max(0, Math.min(1, homeWinProb)),
          draw_prob: Math.max(0, Math.min(1, drawProb)),
          away_win_prob: Math.max(0, Math.min(1, awayWinProb)),
          most_likely: homeWinProb > awayWinProb && homeWinProb > drawProb ? 'home_win' : awayWinProb > drawProb ? 'away_win' : 'draw',
        },
        confidence: 0.68,
        predicted_at: new Date(),
      };
      predictions.push(prediction);
    }

    logger.info(`✅ [AGENT 8] Model B: Generated ${predictions.length} match outcome predictions`);
    return predictions;
  }

  private calculateOutcomeProbability(
    teamStrength: number,
    opponentStrength: number,
    h2hAdvantage: number,
    multiplicator: number
  ): number {
    const strengthRatio = (teamStrength / (teamStrength + opponentStrength)) * multiplicator;
    const h2hBonus = (h2hAdvantage / 20) * 0.1; // Small h2h bonus
    return Math.min(0.95, strengthRatio + h2hBonus);
  }
}

export const agent8 = new PredictionModelBAgent();
