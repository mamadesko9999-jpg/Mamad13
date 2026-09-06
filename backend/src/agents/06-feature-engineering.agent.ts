// 🤖 AGENT 6: FEATURE ENGINEERING AGENT
// کار: محاسبه ویژگی‌های برای مدل‌های پیش‌بینی

import { logger } from '../utils/logger';

class FeatureEngineeringAgent {
  async executeAgent(enrichedMatches: any[]): Promise<any[]> {
    logger.info('🤖 [AGENT 6] Starting Feature Engineering...');
    
    const featuredMatches = [];

    for (const match of enrichedMatches) {
      const features = {
        ...match,
        features: {
          home_team_strength: this.calculateTeamStrength(match.team_form.home),
          away_team_strength: this.calculateTeamStrength(match.team_form.away),
          home_advantage: 1.05, // Home teams score 5% more
          h2h_advantage: this.calculateH2HAdvantage(match.head_to_head),
          injury_impact_home: this.calculateInjuryImpact(match.injuries.home),
          injury_impact_away: this.calculateInjuryImpact(match.injuries.away),
          motivation_level: this.getMotivationLevel(match.league),
          recent_form_home: this.calculateFormScore(match.team_form.home),
          recent_form_away: this.calculateFormScore(match.team_form.away),
          tactical_compatibility: this.calculateTacticalMatch(match.tactical_info),
          possession_expectancy_home: 55,
          possession_expectancy_away: 45,
        },
        engineered_at: new Date(),
      };
      featuredMatches.push(features);
    }

    logger.info(`✅ [AGENT 6] Engineered features for ${featuredMatches.length} matches`);
    return featuredMatches;
  }

  private calculateTeamStrength(form: string): number {
    const formMap: Record<string, number> = {
      excellent: 90,
      good: 75,
      average: 55,
      poor: 35,
      unknown: 50,
    };
    return formMap[form.toLowerCase()] || 50;
  }

  private calculateH2HAdvantage(h2h: any): number {
    const total = h2h.home_wins + h2h.draws + h2h.away_wins;
    if (total === 0) return 0;
    return ((h2h.home_wins - h2h.away_wins) / total) * 10;
  }

  private calculateInjuryImpact(injuries: any[]): number {
    return injuries.length > 0 ? injuries.length * 2 : 0;
  }

  private getMotivationLevel(league: string): number {
    return 70; // Placeholder
  }

  private calculateFormScore(form: string): number {
    return this.calculateTeamStrength(form) / 10;
  }

  private calculateTacticalMatch(tacticalInfo: any): number {
    return 0.5; // Placeholder - ranges 0-1
  }
}

export const agent6 = new FeatureEngineeringAgent();
