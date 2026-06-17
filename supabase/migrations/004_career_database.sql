-- ============================================
-- 职业导航系统 - 职业数据库 Schema
-- ============================================

-- 1. 行业表
CREATE TABLE IF NOT EXISTS industries (
  id TEXT PRIMARY KEY,                       -- 如 "internet", "finance", "creative"
  name TEXT NOT NULL,                        -- 行业名称，如 "互联网/科技"
  icon TEXT NOT NULL DEFAULT '🏢',           -- 行业图标 emoji
  description TEXT,                          -- 行业简介
  trend TEXT,                                -- 当前趋势描述
  outlook TEXT,                              -- 前景判断（看涨/震荡/调整等）
  hot_skills TEXT[],                         -- 热门技能数组
  avg_salary_range TEXT,                      -- 行业平均薪资范围
  risk_level TEXT DEFAULT '中等',             -- 风险等级：低/中/高
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. 岗位表
CREATE TABLE IF NOT EXISTS jobs (
  id TEXT PRIMARY KEY,                       -- 如 "product_manager", "ux_designer"
  industry_id TEXT NOT NULL REFERENCES industries(id),
  name TEXT NOT NULL,                        -- 岗位名称
  icon TEXT NOT NULL DEFAULT '💼',           -- 岗位图标 emoji
  description TEXT,                          -- 岗位简介

  -- 岗位详情
  responsibilities TEXT[],                    -- 核心职责列表
  required_skills TEXT[],                     -- 必备技能
  preferred_skills TEXT[],                    -- 加分技能
  education_required TEXT,                    -- 学历要求
  experience_required TEXT,                  -- 经验要求

  -- 维度评分 (0-100)
  freedom_score INTEGER DEFAULT 50,         -- 自由度
  connection_score INTEGER DEFAULT 50,       -- 人脉需求
  wealth_score INTEGER DEFAULT 50,           -- 财富潜力
  peace_score INTEGER DEFAULT 50,            -- 内心安宁度
  growth_score INTEGER DEFAULT 50,           -- 成长速度
  stability_score INTEGER DEFAULT 50,        -- 稳定性
  competition_score INTEGER DEFAULT 50,      -- 竞争激烈度

  -- 关联试玩副本（可选）
  related_trial_ids TEXT[],                  -- 关联的试玩副本 ID 数组

  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. 城市表
CREATE TABLE IF NOT EXISTS cities (
  id TEXT PRIMARY KEY,                       -- 如 "shanghai", "beijing"
  name TEXT NOT NULL,                        -- 城市名称
  tier INTEGER NOT NULL,                     -- 城市等级 1-5
  region TEXT,                               -- 区域（华东/华北/华南等）
  description TEXT,                          -- 城市简介
  living_cost TEXT,                          -- 生活成本描述
  avg_rent TEXT,                             -- 平均租金
  vibe TEXT,                                 -- 城市气质标签
  population TEXT,                           -- 人口规模
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. 薪资表（岗位+城市+经验的多维薪资数据）
CREATE TABLE IF NOT EXISTS salary_data (
  id BIGSERIAL PRIMARY KEY,
  job_id TEXT NOT NULL REFERENCES jobs(id),
  city_id TEXT NOT NULL REFERENCES cities(id),
  experience_level TEXT NOT NULL,            -- "entry" / "junior" / "mid" / "senior" / "lead"
  min_salary INTEGER,                        -- 最低月薪（千元）
  max_salary INTEGER,                        -- 最高月薪（千元）
  median_salary INTEGER,                      -- 中位数月薪（千元）
  bonus_months REAL,                         -- 年终奖月数
  stock_likelihood REAL DEFAULT 0,           -- 期权/股票概率 0-1
  data_year INTEGER DEFAULT 2026,
  data_source TEXT,                          -- 数据来源
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(job_id, city_id, experience_level)
);

-- 5. 市场分析表
CREATE TABLE IF NOT EXISTS market_analysis (
  id BIGSERIAL PRIMARY KEY,
  job_id TEXT NOT NULL REFERENCES jobs(id),
  analysis_type TEXT NOT NULL,               -- "demand" / "supply" / "trend" / "season"
  content TEXT NOT NULL,                     -- 分析内容
  score INTEGER,                            -- 0-100 评分
  data_date DATE,                           -- 数据日期
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. 风险评估表
CREATE TABLE IF NOT EXISTS risk_assessment (
  id BIGSERIAL PRIMARY KEY,
  job_id TEXT NOT NULL REFERENCES jobs(id),
  risk_type TEXT NOT NULL,                   -- "ai_replacement" / "market_cycle" / "policy" / "health" / "age"
  risk_level TEXT NOT NULL,                  -- "低" / "中" / "高"
  description TEXT,                          -- 风险描述
  mitigation TEXT,                           -- 应对建议
  probability REAL,                          -- 发生概率 0-1
  impact_score INTEGER,                      -- 影响分 0-100
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. 用户档案表（现实档案馆）
CREATE TABLE IF NOT EXISTS user_profiles (
  id TEXT PRIMARY KEY,                       -- 前端生成的 user_id
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- 基础信息
  school TEXT,                               -- 学校
  major TEXT,                                -- 专业
  education_level TEXT,                      -- 学历：专科/本科/硕士/博士
  graduation_year INTEGER,                   -- 毕业年份

  -- 偏好与约束
  preferred_cities TEXT[],                   -- 偏好城市列表
  min_salary INTEGER,                       -- 最低薪资期望（千元/月）
  max_salary INTEGER,                       -- 最高薪资期望
  budget TEXT,                               -- 生活预算描述

  -- 维度偏好（从试玩结果推导）
  freedom_weight INTEGER DEFAULT 50,         -- 自由度权重
  connection_weight INTEGER DEFAULT 50,      -- 人脉权重
  wealth_weight INTEGER DEFAULT 50,          -- 财富权重
  peace_weight INTEGER DEFAULT 50,           -- 安宁权重

  -- 关联试玩结果
  latest_trial_result_id TEXT REFERENCES trial_results(id),

  is_deleted BOOLEAN DEFAULT FALSE
);

-- 8. 岗位收藏表（候选库）
CREATE TABLE IF NOT EXISTS job_favorites (
  id BIGSERIAL PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES user_profiles(id),
  job_id TEXT NOT NULL REFERENCES jobs(id),
  note TEXT,                                 -- 用户备注
  source TEXT DEFAULT 'explore',             -- 收藏来源：explore/trial/report
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, job_id)
);

-- 9. 职业对比历史表
CREATE TABLE IF NOT EXISTS compare_history (
  id BIGSERIAL PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES user_profiles(id),
  job_ids TEXT[] NOT NULL,                   -- 对比的岗位 ID 列表
  result_json JSONB,                         -- 对比结果快照
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. 职业决策报告表
CREATE TABLE IF NOT EXISTS career_reports (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES user_profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),

  -- 报告内容
  user_summary JSONB,                        -- 用户画像摘要
  recommended_jobs TEXT[],                   -- 推荐岗位 ID 列表
  analysis TEXT,                             -- AI 分析内容
  action_items TEXT[],                       -- 行动建议
  ai_provider TEXT DEFAULT 'gemini',

  is_deleted BOOLEAN DEFAULT FALSE
);

-- ============================================
-- 索引
-- ============================================
CREATE INDEX IF NOT EXISTS idx_jobs_industry ON jobs(industry_id);
CREATE INDEX IF NOT EXISTS idx_salary_job ON salary_data(job_id);
CREATE INDEX IF NOT EXISTS idx_salary_city ON salary_data(city_id);
CREATE INDEX IF NOT EXISTS idx_market_job ON market_analysis(job_id);
CREATE INDEX IF NOT EXISTS idx_risk_job ON risk_assessment(job_id);
CREATE INDEX IF NOT EXISTS idx_favorites_user ON job_favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_favorites_job ON job_favorites(job_id);
CREATE INDEX IF NOT EXISTS idx_compare_user ON compare_history(user_id);
CREATE INDEX IF NOT EXISTS idx_reports_user ON career_reports(user_id);

-- ============================================
-- RLS 策略
-- ============================================
ALTER TABLE industries ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE cities ENABLE ROW LEVEL SECURITY;
ALTER TABLE salary_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE market_analysis ENABLE ROW LEVEL SECURITY;
ALTER TABLE risk_assessment ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE compare_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE career_reports ENABLE ROW LEVEL SECURITY;

-- 公开读取（职业数据库内容无需登录即可浏览）
CREATE POLICY "Public read industries" ON industries FOR SELECT USING (is_active = true);
CREATE POLICY "Public read jobs" ON jobs FOR SELECT USING (is_active = true);
CREATE POLICY "Public read cities" ON cities FOR SELECT USING (is_active = true);
CREATE POLICY "Public read salary_data" ON salary_data FOR SELECT USING (true);
CREATE POLICY "Public read market_analysis" ON market_analysis FOR SELECT USING (true);
CREATE POLICY "Public read risk_assessment" ON risk_assessment FOR SELECT USING (true);

-- 用户数据（公开写入用于匿名模式，后续可替换为认证策略）
CREATE POLICY "Public read user_profiles" ON user_profiles FOR SELECT USING (is_deleted = false);
CREATE POLICY "Public insert user_profiles" ON user_profiles FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update user_profiles" ON user_profiles FOR UPDATE USING (true);

CREATE POLICY "Public read job_favorites" ON job_favorites FOR SELECT USING (true);
CREATE POLICY "Public insert job_favorites" ON job_favorites FOR INSERT WITH CHECK (true);
CREATE POLICY "Public delete job_favorites" ON job_favorites FOR DELETE USING (true);

CREATE POLICY "Public read compare_history" ON compare_history FOR SELECT USING (true);
CREATE POLICY "Public insert compare_history" ON compare_history FOR INSERT WITH CHECK (true);

CREATE POLICY "Public read career_reports" ON career_reports FOR SELECT USING (is_deleted = false);
CREATE POLICY "Public insert career_reports" ON career_reports FOR INSERT WITH CHECK (true);

-- ============================================
-- updated_at 自动更新触发器
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_industries_updated
  BEFORE UPDATE ON industries
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trigger_jobs_updated
  BEFORE UPDATE ON jobs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trigger_user_profiles_updated
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================
-- Realtime 发布（用于前端实时订阅）
-- ============================================
ALTER PUBLICATION supabase_realtime ADD TABLE industries;
ALTER PUBLICATION supabase_realtime ADD TABLE jobs;
ALTER PUBLICATION supabase_realtime ADD TABLE job_favorites;
