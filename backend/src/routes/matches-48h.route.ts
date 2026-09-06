// 🔌 API ROUTES - دسترسی به تمام بازی‌های 48 ساعت آینده

import { Router, Request, Response } from 'express';
import { tournamentScheduler } from '../services/tournament-scheduler.service';
import { logger } from '../utils/logger';

const router = Router();

/**
 * GET /api/v1/matches/48h
 * دریافت تمام بازی‌های 48 ساعت آینده
 */
router.get('/48h', async (req: Request, res: Response) => {
  try {
    const matches = await tournamentScheduler.getAllMatches();
    const stats = await tournamentScheduler.getStats();

    res.json({
      success: true,
      data: {
        total_matches: matches.length,
        matches,
        stats,
      },
      metadata: {
        timestamp: new Date(),
        time_range: '48 hours from now',
      },
    });
  } catch (error) {
    logger.error('Error fetching 48h matches:', error);
    res.status(500).json({
      success: false,
      error: { code: 'FETCH_ERROR', message: String(error) },
    });
  }
});

/**
 * GET /api/v1/matches/48h/status/:status
 * فیلتر بر اساس وضعیت (scheduled, live, finished)
 */
router.get('/48h/status/:status', async (req: Request, res: Response) => {
  try {
    const { status } = req.params;
    const matches = await tournamentScheduler.getMatchesByStatus(
      status as 'scheduled' | 'live' | 'finished'
    );

    res.json({
      success: true,
      data: {
        status,
        count: matches.length,
        matches,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { code: 'FILTER_ERROR', message: String(error) },
    });
  }
});

/**
 * GET /api/v1/matches/48h/league/:league
 * فیلتر بر اساس لیگ
 */
router.get('/48h/league/:league', async (req: Request, res: Response) => {
  try {
    const { league } = req.params;
    const matches = await tournamentScheduler.getMatchesByLeague(league);

    res.json({
      success: true,
      data: {
        league,
        count: matches.length,
        matches,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { code: 'FILTER_ERROR', message: String(error) },
    });
  }
});

/**
 * GET /api/v1/matches/48h/today
 * بازی‌های امروز
 */
router.get('/48h/today', async (req: Request, res: Response) => {
  try {
    const matches = await tournamentScheduler.getTodayMatches();
    const stats = await tournamentScheduler.getStats();

    res.json({
      success: true,
      data: {
        day: 'Today',
        count: matches.length,
        matches: matches.sort((a, b) => 
          a.match_time.getTime() - b.match_time.getTime()
        ),
        stats,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { code: 'FETCH_ERROR', message: String(error) },
    });
  }
});

/**
 * GET /api/v1/matches/48h/tomorrow
 * بازی‌های فردا
 */
router.get('/48h/tomorrow', async (req: Request, res: Response) => {
  try {
    const matches = await tournamentScheduler.getTomorrowMatches();
    const stats = await tournamentScheduler.getStats();

    res.json({
      success: true,
      data: {
        day: 'Tomorrow',
        count: matches.length,
        matches: matches.sort((a, b) => 
          a.match_time.getTime() - b.match_time.getTime()
        ),
        stats,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { code: 'FETCH_ERROR', message: String(error) },
    });
  }
});

/**
 * GET /api/v1/matches/48h/upcoming
 * بازی‌های آینده‌روز (بعد از 1 ساعت)
 */
router.get('/48h/upcoming', async (req: Request, res: Response) => {
  try {
    const matches = await tournamentScheduler.getUpcomingMatches();

    res.json({
      success: true,
      data: {
        count: matches.length,
        matches,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { code: 'FETCH_ERROR', message: String(error) },
    });
  }
});

/**
 * GET /api/v1/matches/48h/live
 * بازی‌های زنده
 */
router.get('/48h/live', async (req: Request, res: Response) => {
  try {
    const matches = await tournamentScheduler.getMatchesByStatus('live');

    res.json({
      success: true,
      data: {
        status: 'live',
        count: matches.length,
        matches: matches.map(m => ({
          ...m,
          live_status: 'IN_PLAY',
        })),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { code: 'FETCH_ERROR', message: String(error) },
    });
  }
});

/**
 * GET /api/v1/matches/48h/stats
 * آمار کلی
 */
router.get('/48h/stats', async (req: Request, res: Response) => {
  try {
    const stats = await tournamentScheduler.getStats();

    res.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { code: 'STATS_ERROR', message: String(error) },
    });
  }
});

export default router;
