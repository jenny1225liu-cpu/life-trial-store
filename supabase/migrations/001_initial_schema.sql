-- ============================================
-- 人生试玩店 (Life Trial) - Database Schema
-- ============================================

-- 1. 试玩结果表
CREATE TABLE IF NOT EXISTS trial_results (
  id TEXT PRIMARY KEY,                    -- 前端生成的 "archive_" + timestamp
  created_at TIMESTAMPTZ DEFAULT NOW(),
  trial_id TEXT NOT NULL,                 -- 如 "pm_shanghai", "designer_hangzhou"
  trial_title TEXT NOT NULL,              -- 如 "高压与齿轮 · 产品经理的一天"
  city TEXT NOT NULL,                     -- 如 "上海 (超一线城市)"

  -- AI 生成的人生映射报告
  career_title TEXT,                      -- 如 "外滩落日下的带薪留白分析师"
  resonance TEXT,                          -- 灵魂共鸣分析
  city_match_score INTEGER DEFAULT 80,    -- 城市契合度评分
  city_match_comment TEXT,                -- 城市契合点评
  mapped_career TEXT,                      -- 映射职业
  market_vibe TEXT,                        -- 行业氛围
  salary_expectation TEXT,                 -- 薪资预期
  action_item TEXT,                        -- 行动建议

  -- 属性数值
  happiness INTEGER DEFAULT 50,
  health INTEGER DEFAULT 50,
  stress INTEGER DEFAULT 50,
  growth INTEGER DEFAULT 50,
  wealth INTEGER,
  freedom INTEGER,
  connection INTEGER,
  peace INTEGER,

  -- 元数据
  ai_provider TEXT DEFAULT 'gemini',       -- 使用的 AI 模型: gemini / openai
  client_ip TEXT,                          -- 客户端 IP（用于匿名统计）
  is_deleted BOOLEAN DEFAULT FALSE         -- 软删除
);

-- 2. 选择记录表（每次试玩中的决策流）
CREATE TABLE IF NOT EXISTS trial_choices (
  id BIGSERIAL PRIMARY KEY,
  result_id TEXT NOT NULL REFERENCES trial_results(id) ON DELETE CASCADE,
  choice_order INTEGER NOT NULL,           -- 选择顺序
  time_label TEXT NOT NULL,                -- 如 "09:30"
  scene_title TEXT NOT NULL,               -- 场景标题
  selected_option TEXT NOT NULL,            -- 用户选择的选项文字
  narration_result TEXT,                   -- 叙事结果

  -- 选择效果
  effect_happiness INTEGER DEFAULT 0,
  effect_health INTEGER DEFAULT 0,
  effect_stress INTEGER DEFAULT 0,
  effect_growth INTEGER DEFAULT 0,
  effect_wealth INTEGER DEFAULT 0,
  effect_freedom INTEGER DEFAULT 0,
  effect_connection INTEGER DEFAULT 0,
  effect_peace INTEGER DEFAULT 0
);

-- 3. 副本热度统计表
CREATE TABLE IF NOT EXISTS trial_stats (
  trial_id TEXT PRIMARY KEY,               -- 如 "pm_shanghai"
  play_count INTEGER DEFAULT 0,            -- 游玩次数
  last_played_at TIMESTAMPTZ,              -- 最后游玩时间
  avg_happiness REAL,                      -- 平均快乐值
  avg_health REAL,
  avg_stress REAL,
  avg_growth REAL,
  avg_city_match_score REAL                -- 平均城市契合度
);

-- 4. 排行榜视图（物化视图 - 按城市契合度排名）
CREATE MATERIALIZED VIEW IF NOT EXISTS leaderboard AS
SELECT
  id,
  trial_id,
  trial_title,
  city,
  career_title,
  city_match_score,
  happiness,
  health,
  stress,
  growth,
  created_at
FROM trial_results
WHERE is_deleted = false
ORDER BY city_match_score DESC, created_at DESC;

-- 索引
CREATE INDEX IF NOT EXISTS idx_trial_results_trial_id ON trial_results(trial_id);
CREATE INDEX IF NOT EXISTS idx_trial_results_created_at ON trial_results(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_trial_results_city_match_score ON trial_results(city_match_score DESC);
CREATE INDEX IF NOT EXISTS idx_trial_choices_result_id ON trial_choices(result_id);

-- RLS 策略（公开读写 - 适合无需用户认证的匿名使用场景）
ALTER TABLE trial_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE trial_choices ENABLE ROW LEVEL SECURITY;
ALTER TABLE trial_stats ENABLE ROW LEVEL SECURITY;

-- 公开读取策略
CREATE POLICY "Public read trial_results" ON trial_results FOR SELECT USING (is_deleted = false);
CREATE POLICY "Public read trial_choices" ON trial_choices FOR SELECT USING (true);
CREATE POLICY "Public read trial_stats" ON trial_stats FOR SELECT USING (true);

-- 公开写入策略（匿名模式 - 后续可替换为认证策略）
CREATE POLICY "Public insert trial_results" ON trial_results FOR INSERT WITH CHECK (true);
CREATE POLICY "Public insert trial_choices" ON trial_choices FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update trial_stats" ON trial_stats FOR UPDATE USING (true);

-- 更新排行榜的函数
CREATE OR REPLACE FUNCTION refresh_leaderboard()
RETURNS void AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY leaderboard;
END;
$$ LANGUAGE plpgsql;

-- 自动更新 trial_stats 的触发器
CREATE OR REPLACE FUNCTION update_trial_stats()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO trial_stats (trial_id, play_count, last_played_at, avg_happiness, avg_health, avg_stress, avg_growth, avg_city_match_score)
  VALUES (
    NEW.trial_id,
    1,
    NOW(),
    NEW.happiness,
    NEW.health,
    NEW.stress,
    NEW.growth,
    NEW.city_match_score
  )
  ON CONFLICT (trial_id) DO UPDATE SET
    play_count = trial_stats.play_count + 1,
    last_played_at = NOW(),
    avg_happiness = (trial_stats.avg_happiness * trial_stats.play_count + NEW.happiness) / (trial_stats.play_count + 1),
    avg_health = (trial_stats.avg_health * trial_stats.play_count + NEW.health) / (trial_stats.play_count + 1),
    avg_stress = (trial_stats.avg_stress * trial_stats.play_count + NEW.stress) / (trial_stats.play_count + 1),
    avg_growth = (trial_stats.avg_growth * trial_stats.play_count + NEW.growth) / (trial_stats.play_count + 1),
    avg_city_match_score = (trial_stats.avg_city_match_score * trial_stats.play_count + NEW.city_match_score) / (trial_stats.play_count + 1);

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_trial_stats
  AFTER INSERT ON trial_results
  FOR EACH ROW
  EXECUTE FUNCTION update_trial_stats();
