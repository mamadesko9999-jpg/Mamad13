// 🤖 AGENT 3: DATA QUALITY CHECK AGENT
// کار: بررسی کیفیت داده‌ها

import { logger } from '../utils/logger';

interface QualityCheckResult {
  match_id: string;
  quality_score: number;
  checks: {
    identity_verified: boolean;
    date_valid: boolean;
    teams_valid: boolean;
    league_valid: boolean;
    status_valid: boolean;
    source_credibility: number;
    data_completeness: number;
  };
  passed: boolean;
  notes: string[];
}

class DataQualityAgent {
  async executeAgent(normalizedMatches: any[]): Promise<QualityCheckResult[]> {
    logger.info('🤖 [AGENT 3] Starting Quality Checks...');
    
    const results: QualityCheckResult[] = [];
    let passedCount = 0;

    for (const match of normalizedMatches) {
      const result = this.checkQuality(match);
      results.push(result);
      if (result.passed) passedCount++;
    }

    logger.info(`✅ [AGENT 3] Quality check complete: ${passedCount}/${results.length} passed`);
    return results;
  }

  private checkQuality(match: any): QualityCheckResult {
    const checks = {
      identity_verified: !!match.hermes_id,
      date_valid: match.match_date instanceof Date && !isNaN(match.match_date.getTime()),
      teams_valid: match.home_team && match.away_team && match.home_team !== match.away_team,
      league_valid: !!match.league && match.league !== 'Unknown',
      status_valid: ['scheduled', 'live', 'finished', 'postponed', 'cancelled'].includes(match.status),
      source_credibility: match.sources.length > 1 ? 90 : 70,
      data_completeness: this.calculateCompleteness(match),
    };

    const qualityScore = this.calculateQualityScore(checks);
    const passed = qualityScore >= 70 && checks.identity_verified && checks.teams_valid;

    const notes: string[] = [];
    if (!checks.identity_verified) notes.push('Missing unique ID');
    if (!checks.date_valid) notes.push('Invalid match date');
    if (!checks.teams_valid) notes.push('Invalid team names');
    if (!checks.league_valid) notes.push('Unknown league');
    if (checks.data_completeness < 70) notes.push('Incomplete data');

    return {
      match_id: match.hermes_id,
      quality_score: qualityScore,
      checks,
      passed,
      notes,
    };
  }

  private calculateCompleteness(match: any): number {
    let complete = 0;
    if (match.home_team) complete += 15;
    if (match.away_team) complete += 15;
    if (match.match_date) complete += 15;
    if (match.league) complete += 15;
    if (match.status) complete += 10;
    if (match.stadium) complete += 10;
    if (match.home_score !== undefined && match.away_score !== undefined) complete += 5;
    return Math.min(complete, 100);
  }

  private calculateQualityScore(checks: any): number {
    let score = 0;
    if (checks.identity_verified) score += 15;
    if (checks.date_valid) score += 15;
    if (checks.teams_valid) score += 15;
    if (checks.league_valid) score += 15;
    if (checks.status_valid) score += 10;
    score += Math.min(checks.source_credibility / 10, 10);
    score += Math.min(checks.data_completeness / 10, 10);
    return Math.min(score, 100);
  }
}

export const agent3 = new DataQualityAgent();
