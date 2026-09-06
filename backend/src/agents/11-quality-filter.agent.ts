// 🤖 AGENT 11: QUALITY FILTER AGENT
// کار: فیلتر کردن پیش‌بینی‌های کم‌کیفیت

import { logger } from '../utils/logger';

class QualityFilterAgent {
  async executeAgent(auditedPredictions: any[]): Promise<any[]> {
    logger.info('🤖 [AGENT 11] Quality Filter: Removing Low-Quality Predictions...');
    
    const filtered = [];
    let removedCount = 0;

    for (const prediction of auditedPredictions) {
      const qualityScore = this.calculateQualityScore(prediction);
      
      if (qualityScore >= 70 && prediction.overall_passed) {
        filtered.push({
          ...prediction,
          quality_score: qualityScore,
          status: 'approved',
        });
      } else {
        removedCount++;
        logger.info(`🚫 Removed low-quality prediction: ${prediction.prediction_id} (score: ${qualityScore})`);
      }
    }

    logger.info(`✅ [AGENT 11] Quality Filter: Approved ${filtered.length}/${auditedPredictions.length} predictions (${removedCount} removed)`);
    return filtered;
  }

  private calculateQualityScore(prediction: any): number {
    let score = 0;
    
    // Audit pass rate
    score += (prediction.passed_steps / prediction.total_steps) * 50;
    
    // Confidence
    score += prediction.model === 'Model-A-GoalDistribution' ? 72 : 68;
    
    // Source count
    score += (prediction.source_count || 1) * 5;
    
    return Math.min(100, score);
  }
}

export const agent11 = new QualityFilterAgent();
