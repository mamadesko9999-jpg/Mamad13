// 🤖 AGENT 4: DUPLICATE DETECTION AGENT
// کار: تشخیص و حذف رکورد‌های تکراری

import { logger } from '../utils/logger';

interface DuplicateCheckResult {
  total_matches: number;
  duplicates_found: number;
  unique_matches: number;
  merged_data: any[];
}

class DuplicateDetectionAgent {
  async executeAgent(qualityCheckedMatches: any[]): Promise<DuplicateCheckResult> {
    logger.info('🤖 [AGENT 4] Starting Duplicate Detection...');
    
    const mergedMap = new Map();
    let duplicatesFound = 0;

    for (const match of qualityCheckedMatches) {
      if (!match.passed) continue; // Skip low-quality matches

      const fingerprint = this.generateFingerprint(match);
      
      if (mergedMap.has(fingerprint)) {
        // Merge data
        const existing = mergedMap.get(fingerprint);
        existing.sources = [...new Set([...existing.sources, ...match.sources])];
        existing.source_count = existing.sources.length;
        duplicatesFound++;
      } else {
        mergedMap.set(fingerprint, {
          ...match,
          source_count: 1,
        });
      }
    }

    const result: DuplicateCheckResult = {
      total_matches: qualityCheckedMatches.length,
      duplicates_found: duplicatesFound,
      unique_matches: mergedMap.size,
      merged_data: Array.from(mergedMap.values()),
    };

    logger.info(`✅ [AGENT 4] Duplicate check: ${duplicatesFound} duplicates merged into ${mergedMap.size} unique matches`);
    return result;
  }

  private generateFingerprint(match: any): string {
    const date = new Date(match.match_date_time || match.match_date).toDateString();
    return `${match.home_team.toLowerCase()}-${match.away_team.toLowerCase()}-${date}`.replace(/\s+/g, '');
  }
}

export const agent4 = new DuplicateDetectionAgent();
