// 🤖 AGENT 2: DATA NORMALIZATION AGENT
// کار: نرمال‌کردن فرمت داده‌ها

import { logger } from '../utils/logger';

interface NormalizedMatch {
  hermes_id: string;
  home_team: string;
  away_team: string;
  match_date: Date;
  league: string;
  status: string;
  home_score?: number;
  away_score?: number;
  stadium?: string;
  sources: string[];
  fetched_at: Date;
}

class DataNormalizationAgent {
  async executeAgent(rawMatches: any[]): Promise<NormalizedMatch[]> {
    logger.info('🤖 [AGENT 2] Starting Data Normalization...');
    
    const normalized: NormalizedMatch[] = [];
    const duplicateMap = new Map();

    for (const match of rawMatches) {
      const key = `${match.home}-${match.away}-${new Date(match.date).toDateString()}`;
      
      if (!duplicateMap.has(key)) {
        duplicateMap.set(key, {
          hermes_id: this.generateId(),
          home_team: match.home.trim(),
          away_team: match.away.trim(),
          match_date: new Date(match.date),
          league: match.league.trim(),
          status: this.normalizeStatus(match.status),
          home_score: match.homeScore || undefined,
          away_score: match.awayScore || undefined,
          stadium: match.stadium || undefined,
          sources: [match.source],
          fetched_at: new Date(),
        });
      } else {
        duplicateMap.get(key).sources.push(match.source);
      }
    }

    logger.info(`✅ [AGENT 2] Normalized ${duplicateMap.size} matches from ${rawMatches.length} raw records`);
    return Array.from(duplicateMap.values());
  }

  private normalizeStatus(status: string): string {
    const statusMap: Record<string, string> = {
      scheduled: 'scheduled',
      timed: 'scheduled',
      live: 'live',
      in_play: 'live',
      finished: 'finished',
      completed: 'finished',
      postponed: 'postponed',
      cancelled: 'cancelled',
      suspended: 'suspended',
    };
    return statusMap[status.toLowerCase()] || 'scheduled';
  }

  private generateId(): string {
    return `HERMES-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}

export const agent2 = new DataNormalizationAgent();
