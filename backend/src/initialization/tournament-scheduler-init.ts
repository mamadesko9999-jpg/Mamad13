// 🚀 INIT - شروع Tournament Scheduler

import { tournamentScheduler } from '../services/tournament-scheduler.service';
import { logger } from '../utils/logger';

/**
 * Initialize Tournament Scheduler
 * این تابع در هنگام شروع Backend فراخوانی می‌شود
 */
export async function initializeTournamentScheduler() {
  logger.info('\n🏆 Initializing Tournament Scheduler...');
  
  try {
    // Start the scheduler
    tournamentScheduler.start();
    
    logger.info('✅ Tournament Scheduler Ready');
    logger.info('📅 Updates scheduled every 30 minutes');
    logger.info('📊 Monitoring 25+ leagues worldwide');
    logger.info('⏰ Time range: Next 48 hours');
    
  } catch (error) {
    logger.error('❌ Failed to initialize Tournament Scheduler:', error);
  }
}

/**
 * Cleanup on shutdown
 */
export async function shutdownTournamentScheduler() {
  logger.info('Shutting down Tournament Scheduler...');
  tournamentScheduler.stop();
}
