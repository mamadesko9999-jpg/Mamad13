-- 🏆 DATABASE TABLE برای 48 ساعت بازی‌های آینده

CREATE TABLE IF NOT EXISTS matches_48h (
  id VARCHAR PRIMARY KEY,
  tournament VARCHAR NOT NULL,
  league VARCHAR NOT NULL,
  home_team VARCHAR NOT NULL,
  away_team VARCHAR NOT NULL,
  match_time TIMESTAMP NOT NULL,
  status VARCHAR DEFAULT 'scheduled',
  stadium VARCHAR,
  home_logo VARCHAR,
  away_logo VARCHAR,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  -- Indexes برای سرعت
  INDEX idx_match_time (match_time),
  INDEX idx_status (status),
  INDEX idx_league (league),
  INDEX idx_tournament (tournament),
  INDEX idx_match_time_status (match_time, status)
);

-- Table برای ذخیره احصائیات
CREATE TABLE IF NOT EXISTS matches_48h_stats (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  total_matches INTEGER,
  scheduled_count INTEGER,
  live_count INTEGER,
  finished_count INTEGER,
  stats_json JSONB,
  updated_at TIMESTAMP DEFAULT NOW(),
  
  INDEX idx_updated (updated_at)
);
