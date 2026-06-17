-- ============================================
-- 人生试玩店 - 职业副本表 (Trials)
-- 将 data.ts 中的副本数据迁移到数据库，支持实时更新
-- ============================================

-- 5. 职业副本表
CREATE TABLE IF NOT EXISTS trials (
  id TEXT PRIMARY KEY,                        -- 如 "pm_shanghai", "designer_hangzhou"
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  sort_order INTEGER DEFAULT 0,               -- 显示排序（越小越靠前）

  -- 基本信息
  title TEXT NOT NULL,                         -- 如 "高压与齿轮"
  subtitle TEXT NOT NULL,                      -- 如 "产品经理的一天"
  career TEXT NOT NULL,                        -- 如 "产品经理 (PM)"
  city TEXT NOT NULL,                          -- 如 "上海 (超一线城市)"
  lifestyle TEXT NOT NULL,                     -- 如 "社畜生活 · 螺丝钉的高频运转"
  vibe TEXT NOT NULL,                          -- 氛围关键词
  duration TEXT NOT NULL,                      -- 如 "3分钟极速副本"

  -- 视觉
  cover_image TEXT NOT NULL,                   -- CSS 渐变或图片URL

  -- 难度与属性基线
  difficulty INTEGER NOT NULL DEFAULT 3,       -- 1-5
  freedom INTEGER NOT NULL DEFAULT 50,         -- 百分比
  connection INTEGER NOT NULL DEFAULT 50,
  wealth INTEGER NOT NULL DEFAULT 50,
  peace INTEGER NOT NULL DEFAULT 50,

  -- 场景数据（JSONB - 包含 scenarios + options 的完整嵌套结构）
  scenarios JSONB NOT NULL DEFAULT '[]'::jsonb,

  -- 状态
  is_active BOOLEAN DEFAULT TRUE,              -- 是否上线（可下线某个副本）
  is_deleted BOOLEAN DEFAULT FALSE             -- 软删除
);

-- 索引
CREATE INDEX IF NOT EXISTS idx_trials_active ON trials(is_active, is_deleted, sort_order);

-- RLS 策略
ALTER TABLE trials ENABLE ROW LEVEL SECURITY;

-- 公开读取（只看上线且未删除的）
CREATE POLICY "Public read active trials" ON trials FOR SELECT
  USING (is_active = true AND is_deleted = false);

-- 服务端写入（用 service_role key 操作，普通用户不能直接改）
CREATE POLICY "Service insert trials" ON trials FOR INSERT WITH CHECK (true);
CREATE POLICY "Service update trials" ON trials FOR UPDATE USING (true);

-- 自动更新 updated_at 的触发器
CREATE OR REPLACE FUNCTION update_trials_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_trials_updated_at
  BEFORE UPDATE ON trials
  FOR EACH ROW
  EXECUTE FUNCTION update_trials_updated_at();

-- ============================================
-- Realtime 配置（需要在 Supabase Dashboard 中手动开启）
-- 执行以下 SQL 启用 Realtime 发布：
-- ============================================
ALTER PUBLICATION supabase_realtime ADD TABLE trials;
ALTER PUBLICATION supabase_realtime ADD TABLE trial_results;
