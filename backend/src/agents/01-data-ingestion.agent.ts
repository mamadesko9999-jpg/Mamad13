// 🤖 AGENT 1: DATA INGESTION AGENT
// کار: جمع‌آوری بازی‌ها از تمام منابع

import axios from 'axios';
import { logger } from '../utils/logger';
import { Match } from '../models/Match';

interface MatchRaw {
  id?: string;
  fixture_id?: string;
  homeTeam?: { name: string };
  awayTeam?: { name: string };
  home_team?: string;
  away_team?: string;
  utcDate?: string;
  date?: string;
  kick_off?: string;
  competition?: { name: string };
  league?: { name: string };
  status?: string;
  score?: { fullTime: { home: number; away: number } };
  home_score?: number;
  away_score?: number;
  venue?: string;
}

class DataIngestionAgent {
  private sources = [
    {
      name: 'Football-Data.org',
      url: 'https://api.football-data.org/v4',
      credibility: 95,
    },
    {
      name: 'Understat',
      url: 'https://understat.com/api',
      credibility: 90,
    },
    {
      name: 'WhoScored',
      url: 'https://www.whoscored.com/api',
      credibility: 88,
    },
    {
      name: 'FlashScore',
      url: 'https://www.flashscore.com/api',
      credibility: 85,
    },
  ];

  async executeAgent(): Promise<any[]> {
    logger.info('🤖 [AGENT 1] Starting Data Ingestion...');
    const results = [];

    for (const source of this.sources) {
      try {
        const matches = await this.fetchMatches(source);
        results.push({
          source: source.name,
          count: matches.length,
          status: 'success',
          credibility: source.credibility,
        });
        logger.info(`✅ ${source.name}: ${matches.length} matches fetched`);
      } catch (error) {
        results.push({
          source: source.name,
          count: 0,
          status: 'error',
          error: String(error),
        });
        logger.error(`❌ ${source.name} failed:`, error);
      }
    }

    logger.info('✅ [AGENT 1] Complete - Data Ingestion Summary:', results);
    return results;
  }

  private async fetchMatches(source: any): Promise<any[]> {
    const headers: any = { 'User-Agent': 'HERMES/1.0' };
    if (process.env[`${source.name.replace(/[^A-Z]/g, '')}_API_KEY`]) {
      headers['X-Auth-Token'] = process.env[`${source.name.replace(/[^A-Z]/g, '')}_API_KEY`];
    }

    try {
      const response = await axios.get(`${source.url}/matches?status=today`, {
        headers,
        timeout: 8000,
      });
      return this.normalizeData(response.data, source.name);
    } catch (error) {
      return [];
    }
  }

  private normalizeData(data: any, source: string): any[] {
    const matches = [];
    const raw = data.matches || data.fixtures || data || [];
    
    for (const m of (Array.isArray(raw) ? raw : [])) {
      matches.push({
        id: m.id || m.fixture_id,
        home: m.homeTeam?.name || m.home_team || 'Unknown',
        away: m.awayTeam?.name || m.away_team || 'Unknown',
        date: m.utcDate || m.date || m.kick_off,
        league: m.competition?.name || m.league?.name || 'Unknown',
        status: m.status || 'scheduled',
        homeScore: m.score?.fullTime?.home || m.home_score,
        awayScore: m.score?.fullTime?.away || m.away_score,
        source,
      });
    }
    return matches;
  }
}

export const agent1 = new DataIngestionAgent();
