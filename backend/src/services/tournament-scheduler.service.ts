// 🏆 TOURNAMENT SCHEDULER - جمع‌آوری تمام بازی‌های 48 ساعت آینده
// هر 30 دقیقه به‌صورت خودکار update می‌شود

import axios from 'axios';
import { logger } from '../utils/logger';
import { query } from '../config/database';
import { CronJob } from 'cron';

interface Tournament {
  id: string;
  name: string;
  country: string;
  matches: any[];
}

interface Match {
  id: string;
  tournament: string;
  home_team: string;
  away_team: string;
  match_time: Date;
  status: string;
  league: string;
  stadium?: string;
  home_logo?: string;
  away_logo?: string;
  odds?: any;
}

class TournamentScheduler {
  private tournaments: Tournament[] = [];
  private allMatches: Match[] = [];
  private cronJob: CronJob | null = null;

  // تمام لیگ‌های جهانی
  private leagues = [
    // Premier League
    { name: 'Premier League', country: 'England', id: 'PL' },
    // La Liga
    { name: 'La Liga', country: 'Spain', id: 'LA' },
    // Serie A
    { name: 'Serie A', country: 'Italy', id: 'SA' },
    // Bundesliga
    { name: 'Bundesliga', country: 'Germany', id: 'BL' },
    // Ligue 1
    { name: 'Ligue 1', country: 'France', id: 'L1' },
    // Eredivisie
    { name: 'Eredivisie', country: 'Netherlands', id: 'ED' },
    // Portuguese Liga
    { name: 'Liga Portugal', country: 'Portugal', id: 'LP' },
    // Turkish Super Lig
    { name: 'Super Lig', country: 'Turkey', id: 'TSL' },
    // Russian Premier League
    { name: 'Russian Premier', country: 'Russia', id: 'RPL' },
    // MLS
    { name: 'MLS', country: 'USA', id: 'MLS' },
    // Liga MX
    { name: 'Liga MX', country: 'Mexico', id: 'LMX' },
    // Brazilian Serie A
    { name: 'Serie A', country: 'Brazil', id: 'BSA' },
    // Argentine Primera
    { name: 'Primera Division', country: 'Argentina', id: 'APD' },
    // Chinese Super League
    { name: 'Chinese Super', country: 'China', id: 'CSL' },
    // J-League
    { name: 'J-League', country: 'Japan', id: 'JL' },
    // K-League
    { name: 'K-League', country: 'South Korea', id: 'KL' },
    // Saudi League
    { name: 'Saudi League', country: 'Saudi Arabia', id: 'SPL' },
    // UAE League
    { name: 'UAE League', country: 'UAE', id: 'UAEL' },
    // AFC Champions League
    { name: 'AFC Champions', country: 'Asia', id: 'AFCC' },
    // Europa League
    { name: 'Europa League', country: 'Europe', id: 'EL' },
    // Champions League
    { name: 'Champions League', country: 'Europe', id: 'CL' },
    // Cup Competitions
    { name: 'FA Cup', country: 'England', id: 'FAC' },
    { name: 'Copa del Rey', country: 'Spain', id: 'CDR' },
    { name: 'Coppa Italia', country: 'Italy', id: 'CI' },
    { name: 'DFB Pokal', country: 'Germany', id: 'DFB' },
    { name: 'Coupe de France', country: 'France', id: 'CDF' },
  ];

  constructor() {
    logger.info('🏆 Tournament Scheduler Initialized');
  }

  /**
   * شروع Scheduler - هر 30 دقیقه update کن
   */
  start() {
    logger.info('🚀 Starting Tournament Scheduler...');
    
    // اول بار بلافاصله
    this.fetchAllMatches();
    
    // سپس هر 30 دقیقه
    this.cronJob = new CronJob('*/30 * * * *', () => {
      logger.info('⏰ Scheduled update: Fetching latest matches...');
      this.fetchAllMatches();
    });
    
    this.cronJob.start();
    logger.info('✅ Tournament Scheduler Started - Updates every 30 minutes');
  }

  /**
   * توقف Scheduler
   */
  stop() {
    if (this.cronJob) {
      this.cronJob.stop();
      logger.info('⛔ Tournament Scheduler Stopped');
    }
  }

  /**
   * جمع‌آوری تمام بازی‌های 48 ساعت آینده
   */
  async fetchAllMatches() {
    logger.info('\n' + '='.repeat(80));
    logger.info('🏆 FETCHING ALL MATCHES FOR NEXT 48 HOURS');
    logger.info('='.repeat(80) + '\n');

    const allMatches: Match[] = [];
    const startTime = new Date();
    const endTime = new Date(startTime.getTime() + 48 * 60 * 60 * 1000);

    logger.info(`📅 Date Range: ${startTime.toLocaleString()} to ${endTime.toLocaleString()}\n`);

    // Fetch from each league/tournament
    for (const league of this.leagues) {
      try {
        logger.info(`🔍 Fetching ${league.name} (${league.country})...`);
        const matches = await this.fetchLeagueMatches(league, startTime, endTime);
        allMatches.push(...matches);
        logger.info(`✅ ${league.name}: ${matches.length} matches found\n`);
      } catch (error) {
        logger.error(`❌ Error fetching ${league.name}:`, error);
      }
    }

    // Store in database
    await this.storeMatches(allMatches);
    
    this.allMatches = allMatches;

    logger.info('\n' + '='.repeat(80));
    logger.info(`✅ TOTAL MATCHES FOUND: ${allMatches.length}`);
    logger.info(`📊 Summary by Status:`);
    logger.info(`   - Scheduled: ${allMatches.filter(m => m.status === 'scheduled').length}`);
    logger.info(`   - Live: ${allMatches.filter(m => m.status === 'live').length}`);
    logger.info(`   - Finished: ${allMatches.filter(m => m.status === 'finished').length}`);
    logger.info('='.repeat(80) + '\n');

    return allMatches;
  }

  /**
   * دریافت بازی‌های یک لیگ خاص
   */
  private async fetchLeagueMatches(
    league: any,
    startTime: Date,
    endTime: Date
  ): Promise<Match[]> {
    const matches: Match[] = [];

    try {
      // Football-Data.org API
      const response = await axios.get(
        `https://api.football-data.org/v4/competitions/${league.id}/matches`,
        {
          headers: {
            'X-Auth-Token': process.env.FOOTBALL_DATA_API_KEY || '',
          },
          params: {
            status: 'SCHEDULED,LIVE,FINISHED',
          },
        }
      );

      if (response.data?.matches) {
        for (const match of response.data.matches) {
          const matchTime = new Date(match.utcDate);
          
          // فقط بازی‌های 48 ساعت آینده
          if (matchTime >= startTime && matchTime <= endTime) {
            matches.push({
              id: `${league.id}-${match.id}`,
              tournament: league.name,
              home_team: match.homeTeam?.name || 'Unknown',
              away_team: match.awayTeam?.name || 'Unknown',
              match_time: matchTime,
              status: match.status?.toLowerCase() || 'scheduled',
              league: league.name,
              stadium: match.venue || undefined,
              home_logo: match.homeTeam?.crest,
              away_logo: match.awayTeam?.crest,
            });
          }
        }
      }
    } catch (error) {
      logger.error(`Error fetching ${league.name}:`, error);
    }

    return matches;
  }

  /**
   * ذخیره‌سازی بازی‌ها در دیتابیس
   */
  private async storeMatches(matches: Match[]) {
    logger.info(`💾 Storing ${matches.length} matches in database...`);

    try {
      for (const match of matches) {
        await query(
          `
          INSERT INTO matches_48h (
            id, tournament, home_team, away_team, match_time, status, 
            league, stadium, home_logo, away_logo, created_at, updated_at
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW(), NOW())
          ON CONFLICT (id) DO UPDATE SET 
            status = $6, 
            updated_at = NOW()
          `,
          [
            match.id,
            match.tournament,
            match.home_team,
            match.away_team,
            match.match_time,
            match.status,
            match.league,
            match.stadium,
            match.home_logo,
            match.away_logo,
          ]
        );
      }
      logger.info(`✅ Stored ${matches.length} matches`);
    } catch (error) {
      logger.error('Error storing matches:', error);
    }
  }

  /**
   * دریافت تمام بازی‌های ذخیره‌شده
   */
  async getAllMatches() {
    return this.allMatches;
  }

  /**
   * فیلتر بازی‌های بر اساس وضعیت
   */
  async getMatchesByStatus(status: 'scheduled' | 'live' | 'finished') {
    return this.allMatches.filter(m => m.status === status);
  }

  /**
   * فیلتر بازی‌های بر اساس لیگ
   */
  async getMatchesByLeague(league: string) {
    return this.allMatches.filter(m => m.league === league);
  }

  /**
   * دریافت بازی‌های بعد از ساعت مشخص
   */
  async getMatchesAfterTime(hours: number) {
    const futureTime = new Date(Date.now() + hours * 60 * 60 * 1000);
    return this.allMatches.filter(m => m.match_time > futureTime);
  }

  /**
   * دریافت بازی‌های اگر پیش‌رو (بعد از 1 ساعت)
   */
  async getUpcomingMatches() {
    const oneHourLater = new Date(Date.now() + 60 * 60 * 1000);
    return this.allMatches
      .filter(m => m.status === 'scheduled' && m.match_time > oneHourLater)
      .sort((a, b) => a.match_time.getTime() - b.match_time.getTime());
  }

  /**
   * دریافت بازی‌های امروز
   */
  async getTodayMatches() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    return this.allMatches.filter(
      m => m.match_time >= today && m.match_time < tomorrow
    );
  }

  /**
   * دریافت بازی‌های فردا
   */
  async getTomorrowMatches() {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    const dayAfter = new Date(tomorrow);
    dayAfter.setDate(dayAfter.getDate() + 1);

    return this.allMatches.filter(
      m => m.match_time >= tomorrow && m.match_time < dayAfter
    );
  }

  /**
   * آمار کلی
   */
  async getStats() {
    const total = this.allMatches.length;
    const scheduled = this.allMatches.filter(m => m.status === 'scheduled').length;
    const live = this.allMatches.filter(m => m.status === 'live').length;
    const finished = this.allMatches.filter(m => m.status === 'finished').length;

    // دسته‌بندی بر اساس لیگ
    const byLeague: Record<string, number> = {};
    this.allMatches.forEach(m => {
      byLeague[m.league] = (byLeague[m.league] || 0) + 1;
    });

    return {
      total,
      scheduled,
      live,
      finished,
      by_league: byLeague,
      updated_at: new Date(),
    };
  }
}

export const tournamentScheduler = new TournamentScheduler();
