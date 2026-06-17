-- ============================================
-- 职业导航系统 - 一键迁移脚本
-- 包含：建表 + 种子数据 + RLS + 索引 + 触发器
-- 执行方式：在 Supabase SQL Editor 中粘贴运行
-- ============================================

-- 先删除可能存在的旧表（按依赖顺序）
DROP TABLE IF EXISTS career_reports CASCADE;
DROP TABLE IF EXISTS compare_history CASCADE;
DROP TABLE IF EXISTS job_favorites CASCADE;
DROP TABLE IF EXISTS user_profiles CASCADE;
DROP TABLE IF EXISTS risk_assessment CASCADE;
DROP TABLE IF EXISTS market_analysis CASCADE;
DROP TABLE IF EXISTS salary_data CASCADE;
DROP TABLE IF EXISTS jobs CASCADE;
DROP TABLE IF EXISTS cities CASCADE;
DROP TABLE IF EXISTS industries CASCADE;

-- ============================================
-- 1. 行业表
-- ============================================
CREATE TABLE industries (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  icon TEXT NOT NULL DEFAULT '🏢',
  description TEXT,
  trend TEXT,
  outlook TEXT,
  hot_skills TEXT[],
  avg_salary_range TEXT,
  risk_level TEXT DEFAULT '中等',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 2. 岗位表
-- ============================================
CREATE TABLE jobs (
  id TEXT PRIMARY KEY,
  industry_id TEXT NOT NULL REFERENCES industries(id),
  name TEXT NOT NULL,
  icon TEXT NOT NULL DEFAULT '💼',
  description TEXT,
  responsibilities TEXT[],
  required_skills TEXT[],
  preferred_skills TEXT[],
  education_required TEXT,
  experience_required TEXT,
  freedom_score INTEGER DEFAULT 50,
  connection_score INTEGER DEFAULT 50,
  wealth_score INTEGER DEFAULT 50,
  peace_score INTEGER DEFAULT 50,
  growth_score INTEGER DEFAULT 50,
  stability_score INTEGER DEFAULT 50,
  competition_score INTEGER DEFAULT 50,
  related_trial_ids TEXT[],
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 3. 城市表
-- ============================================
CREATE TABLE cities (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  tier INTEGER NOT NULL,
  region TEXT,
  description TEXT,
  living_cost TEXT,
  avg_rent TEXT,
  vibe TEXT,
  population TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 4. 薪资表
-- ============================================
CREATE TABLE salary_data (
  id BIGSERIAL PRIMARY KEY,
  job_id TEXT NOT NULL REFERENCES jobs(id),
  city_id TEXT NOT NULL REFERENCES cities(id),
  experience_level TEXT NOT NULL,
  min_salary INTEGER,
  max_salary INTEGER,
  median_salary INTEGER,
  bonus_months REAL,
  stock_likelihood REAL DEFAULT 0,
  data_year INTEGER DEFAULT 2026,
  data_source TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(job_id, city_id, experience_level)
);

-- ============================================
-- 5. 市场分析表
-- ============================================
CREATE TABLE market_analysis (
  id BIGSERIAL PRIMARY KEY,
  job_id TEXT NOT NULL REFERENCES jobs(id),
  analysis_type TEXT NOT NULL,
  content TEXT NOT NULL,
  score INTEGER,
  data_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 6. 风险评估表
-- ============================================
CREATE TABLE risk_assessment (
  id BIGSERIAL PRIMARY KEY,
  job_id TEXT NOT NULL REFERENCES jobs(id),
  risk_type TEXT NOT NULL,
  risk_level TEXT NOT NULL,
  description TEXT,
  mitigation TEXT,
  probability REAL,
  impact_score INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 7. 用户档案表
-- ============================================
CREATE TABLE user_profiles (
  id TEXT PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  school TEXT,
  major TEXT,
  education_level TEXT,
  graduation_year INTEGER,
  preferred_cities TEXT[],
  min_salary INTEGER,
  max_salary INTEGER,
  budget TEXT,
  freedom_weight INTEGER DEFAULT 50,
  connection_weight INTEGER DEFAULT 50,
  wealth_weight INTEGER DEFAULT 50,
  peace_weight INTEGER DEFAULT 50,
  latest_trial_result_id TEXT,
  is_deleted BOOLEAN DEFAULT FALSE
);

-- ============================================
-- 8. 岗位收藏表
-- ============================================
CREATE TABLE job_favorites (
  id BIGSERIAL PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES user_profiles(id),
  job_id TEXT NOT NULL REFERENCES jobs(id),
  note TEXT,
  source TEXT DEFAULT 'explore',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, job_id)
);

-- ============================================
-- 9. 职业对比历史表
-- ============================================
CREATE TABLE compare_history (
  id BIGSERIAL PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES user_profiles(id),
  job_ids TEXT[] NOT NULL,
  result_json JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 10. 职业决策报告表
-- ============================================
CREATE TABLE career_reports (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES user_profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  user_summary JSONB,
  recommended_jobs TEXT[],
  analysis TEXT,
  action_items TEXT[],
  ai_provider TEXT DEFAULT 'gemini',
  is_deleted BOOLEAN DEFAULT FALSE
);

-- ============================================
-- 索引
-- ============================================
CREATE INDEX idx_jobs_industry ON jobs(industry_id);
CREATE INDEX idx_salary_job ON salary_data(job_id);
CREATE INDEX idx_salary_city ON salary_data(city_id);
CREATE INDEX idx_market_job ON market_analysis(job_id);
CREATE INDEX idx_risk_job ON risk_assessment(job_id);
CREATE INDEX idx_favorites_user ON job_favorites(user_id);
CREATE INDEX idx_favorites_job ON job_favorites(job_id);
CREATE INDEX idx_compare_user ON compare_history(user_id);
CREATE INDEX idx_reports_user ON career_reports(user_id);

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

CREATE POLICY "Public read industries" ON industries FOR SELECT USING (is_active = true);
CREATE POLICY "Public read jobs" ON jobs FOR SELECT USING (is_active = true);
CREATE POLICY "Public read cities" ON cities FOR SELECT USING (is_active = true);
CREATE POLICY "Public read salary_data" ON salary_data FOR SELECT USING (true);
CREATE POLICY "Public read market_analysis" ON market_analysis FOR SELECT USING (true);
CREATE POLICY "Public read risk_assessment" ON risk_assessment FOR SELECT USING (true);

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
-- 触发器：updated_at 自动更新
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
-- 种子数据：行业
-- ============================================
INSERT INTO industries (id, name, icon, description, trend, outlook, hot_skills, avg_salary_range, risk_level) VALUES
('internet', '互联网/科技', '💻', '以软件开发、产品运营为核心的数字经济产业', '从野蛮增长转向精细化运营，AI 重塑产品与技术栈', '结构性调整，但好人才永远稀缺', '{"AI产品化", "数据驱动决策", "系统设计"}', '8k-60k/月', '中'),
('creative', '创意设计/文创', '🎨', '视觉传达、品牌设计、插画、文创产品等创意产业', 'AI工具普及让执行力贬值，个人风格越来越值钱', '看涨——个人IP时代，有温度的设计者最吃香', '{"AI协作设计", "个人IP运营", "品牌美学"}', '6k-35k/月', '中'),
('finance', '金融/投资', '🏦', '银行、证券、基金、保险、金融科技等', '传统岗位竞争白热化，金融科技赛道催生新一代精英', '分化严重——细分领域机会巨大', '{"量化分析", "风控建模", "金融科技"}', '10k-80k/月', '中'),
('education', '教育/培训', '📚', 'K12、高等教育、职业培训、在线教育等', 'AI辅助教学已成趋势，有温度的教育者永远稀缺', '稳定增长，AI+教育有结构性机会', '{"AI辅助教学", "内容设计", "社区运营"}', '5k-25k/月', '低'),
('healthcare', '医疗/健康', '🏥', '临床医疗、医药研发、医疗器械、健康管理', 'AI辅助诊断正在改变规则，但医生核心价值不可替代', '长期看涨，老龄化带来持续需求', '{"AI辅助诊断", "精准医疗", "健康管理"}', '5k-60k/月', '低'),
('ecommerce', '电商/新零售', '🛒', '电商平台、直播带货、跨境电商、供应链管理', '内卷加剧，跨境出海和品牌化是两大结构性机会', '高速发展期，马太效应加剧', '{"跨境运营", "数据选品", "品牌策划"}', '5k-50k/月', '高'),
('media', '影视/文娱', '🎬', '电影、电视剧、短视频、直播、游戏等', '传统影视遇冷，短剧和AI制作工具正在重塑行业', '结构性调整，好内容永远有价值', '{"短剧制作", "AI辅助创作", "IP运营"}', '4k-40k/月', '高'),
('hospitality', '酒店/文旅', '🏨', '高端酒店、民宿、旅游定制、文旅策划', '高端旅行回暖，客人更追求在地体验而非标准化', '稳步增长，个性化服务人才紧缺', '{"沉浸式体验设计", "数字化运营", "在地文化挖掘"}', '6k-40k/月', '中'),
('legal', '法律/合规', '⚖️', '律师事务所、企业法务、合规咨询', '传统诉讼增长放缓，合规、数据隐私等新赛道爆发', '结构性分化，细分领域机会巨大', '{"跨境合规", "数据隐私法", "法律科技"}', '8k-50k/月', '低'),
('food', '餐饮/食品', '🍜', '餐饮连锁、食品研发、供应链、美食内容', '精品化转型中，小而美的餐饮IP有生存空间', '高度竞争，差异化才能活', '{"餐饮IP打造", "供应链优化", "内容营销"}', '4k-25k/月', '高'),
('public', '公共管理/基层治理', '🏛️', '公务员、基层治理、公共安全、应急管理', '智慧政务+网格化管理是方向，传统向服务型转变', '稳定刚需，数字化转型带来新机会', '{"数字化治理", "群众工作", "应急响应"}', '5k-15k/月', '低'),
('tea', '茶产业/非遗', '🍵', '茶叶种植、加工、品牌、茶文化传播', '国潮+短视频让传统茶文化破圈，标准化仍是瓶颈', '文化价值看涨，商业变现需创新', '{"内容创作", "品牌运营", "直播带货"}', '5k-20k/月', '中'),
('automotive', '汽车/新能源', '🚗', '新能源汽车、智能驾驶、汽车后市场', '新能源和智能化双轮驱动，人才需求井喷', '强烈看涨，人才供不应求', '{"智能驾驶", "三电系统", "车载软件"}', '10k-50k/月', '低'),
('realestate', '房产/建筑', '🏗️', '房地产开发、建筑设计、城市规划', '行业深度调整期，城市更新和绿色建筑是新方向', '震荡调整，转型期有机会', '{"绿色建筑", "城市更新", "BIM技术"}', '8k-40k/月', '高');

-- ============================================
-- 种子数据：城市
-- ============================================
INSERT INTO cities (id, name, tier, region, description, living_cost, avg_rent, vibe, population) VALUES
('shanghai', '上海', 1, '华东', '中国最具国际化的商业中心，金融+科技+文创三栖', '高', '3500-6000/月', '精致、高效、国际化', '2487万'),
('beijing', '北京', 1, '华北', '政治文化中心，互联网与AI的核心战场', '高', '3000-5500/月', '厚重、学术、权力', '2189万'),
('shenzhen', '深圳', 1, '华南', '中国科技心脏，创业密度全国第一', '中高', '2500-5000/月', '年轻、拼搏、创新', '1768万'),
('guangzhou', '广州', 1, '华南', '千年商都，电商和直播电商腹地', '中', '2000-4000/月', '务实、烟火、包容', '1881万'),
('hangzhou', '杭州', 1, '华东', '电商之都+数字游民天堂', '中高', '2500-4500/月', '诗意、创新、宜居', '1237万'),
('chengdu', '成都', 1, '西南', '新一线城市标杆，内容创业和生活方式的沃土', '中', '1800-3500/月', '慢节奏、文艺、烟火', '2126万'),
('suzhou', '苏州', 2, '华东', '园林之城，外资和制造业重镇', '中', '1800-3500/月', '精致、稳健、平衡', '1292万'),
('nanjing', '南京', 2, '华东', '六朝古都，高校密度全国前三', '中', '1800-3000/月', '学术、历史、沉稳', '942万'),
('xiamen', '厦门', 2, '华东', '鹭岛小城，文艺与烟火并存', '中', '2000-3500/月', '清新、文艺、宜居', '528万'),
('qingdao', '青岛', 2, '华东', '滨海城市，慢节奏中蕴藏产业活力', '中', '1500-3000/月', '滨海、慢节奏、舒适', '1035万'),
('changsha', '长沙', 2, '华中', '网红城市，消费力旺盛的娱乐之都', '中低', '1500-2800/月', '火热、娱乐、实惠', '1042万'),
('chongqing', '重庆', 1, '西南', '8D魔幻城市，网红经济与制造业并存', '中低', '1500-3000/月', '魔幻、烟火、豪爽', '3212万'),
('xian', '西安', 2, '西北', '古都新貌，西北发展的核心引擎', '中低', '1500-2800/月', '历史、厚重、崛起', '1300万'),
('dali', '大理', 4, '西南', '数字游民圣地，最接近乌托邦的地方', '低', '800-2000/月', '自由、慢生活、灵性', '333万'),
('hongkong', '中国香港', 1, '华南', '全球金融中心，中西交汇的国际都市', '极高', '8000-15000/月', '高效、国际、精英', '750万'),
('anxi', '安溪', 5, '华东', '铁观音故乡，茶文化千年传承之地', '低', '500-1200/月', '传统、手艺、茶香', '100万'),
('yiwu', '义乌', 3, '华东', '全球小商品之都，跨境电商跳板', '中低', '1200-2500/月', '商业、务实、全球化', '186万');

-- ============================================
-- 种子数据：岗位
-- ============================================
INSERT INTO jobs (id, industry_id, name, icon, description, responsibilities, required_skills, preferred_skills, education_required, experience_required, freedom_score, connection_score, wealth_score, peace_score, growth_score, stability_score, competition_score, related_trial_ids) VALUES
('product_manager', 'internet', '产品经理', '📊', '连接用户需求与商业目标，定义产品方向与功能优先级', '{"需求分析与优先级排序", "跨团队沟通协调", "数据驱动的产品决策", "用户调研与反馈闭环"}', '{"逻辑思维", "数据分析", "沟通表达"}', '{"技术理解力", "商业敏感度", "设计审美"}', '本科及以上', '0-3年', 55, 75, 70, 45, 75, 50, 80, '{"pm_shanghai"}'),
('ux_designer', 'creative', '用户体验设计师', '🎨', '用设计思维解决用户痛点，让产品既好看又好用', '{"用户调研与旅程地图", "交互原型设计", "视觉规范维护", "A/B测试与迭代"}', '{"Figma/Sketch", "交互设计", "用户研究"}', '{"前端基础", "数据分析", "心理学"}', '本科及以上', '0-3年', 60, 50, 55, 55, 70, 55, 70, '{"designer_hangzhou"}'),
('ai_engineer', 'internet', 'AI算法工程师', '🧠', '研发AI模型与算法，将前沿研究转化为产品能力', '{"大模型训练与微调", "算法优化与部署", "前沿论文复现", "技术方案设计"}', '{"Python", "深度学习框架", "数学基础"}', '{"工程化能力", "业务理解", "论文写作"}', '硕士及以上', '0-5年', 40, 45, 85, 35, 90, 60, 95, '{"ai_beijing"}'),
('software_engineer', 'internet', '软件工程师', '🧑‍💻', '构建和维护软件系统，用代码解决现实问题', '{"系统架构设计与开发", "代码审查与优化", "技术文档编写", "线上问题排查"}', '{"编程语言(Java/Go/Python)", "数据结构", "系统设计"}', '{"云原生", "DevOps", "AI工程化"}', '本科及以上', '0-5年', 50, 40, 80, 40, 85, 55, 85, '{"engineer_shenzhen"}'),
('lawyer', 'legal', '律师', '⚖️', '运用法律知识维护客户权益，解决法律纠纷', '{"法律文书撰写", "案件分析与诉讼策略", "客户咨询与谈判", "合规审查"}', '{"法律分析", "逻辑推理", "文书写作"}', '{"行业专精", "谈判技巧", "英语能力"}', '本科及以上(法考)', '1-5年', 45, 70, 75, 40, 60, 60, 80, '{"lawyer_beijing"}'),
('hotel_manager', 'hospitality', '酒店管理', '🏨', '统筹酒店运营，为宾客提供极致入住体验', '{"前台与客房运营管理", "宾客关系维护", "团队培训与排班", "预算与收益管理"}', '{"沟通协调", "细节管理", "服务意识"}', '{"多语言能力", "数据分析", "危机处理"}', '本科及以上', '1-5年', 35, 85, 65, 50, 55, 65, 50, '{"hotel_mgr_hongkong"}'),
('flight_attendant', 'hospitality', '空乘/乘务员', '✈️', '在万米高空保障乘客安全，提供温馨服务', '{"客舱安全检查与应急处理", "旅客服务与关怀", "团队协作与沟通", "特殊情况应对"}', '{"服务意识", "沟通表达", "形象管理"}', '{"英语能力", "急救知识", "跨文化沟通"}', '大专及以上', '0-2年', 30, 65, 50, 45, 35, 60, 65, '{"flight_attendant_shenzhen"}'),
('police_officer', 'public', '警察/基层执法', '👮', '维护社会治安，保护人民群众生命财产安全', '{"治安巡逻与防控", "案件调查与取证", "群众工作与调解", "突发事件应急处理"}', '{"体能", "法律知识", "沟通能力"}', '{"心理素质", "数据分析", "谈判技巧"}', '本科及以上(公务员)', '0-3年', 25, 70, 45, 35, 40, 85, 60, '{"police_officer_qingdao"}'),
('livestream_host', 'ecommerce', '直播主播/操盘手', '🎬', '在直播间用内容和话术驱动销售转化', '{"直播话术与节奏把控", "选品与定价策略", "粉丝互动与维护", "数据分析与复盘"}', '{"表达力", "镜头感", "选品直觉"}', '{"数据分析", "供应链管理", "团队管理"}', '不限', '0-2年', 50, 60, 75, 30, 65, 25, 85, '{"livestream_guangzhou"}'),
('film_producer', 'media', '影视制片人/策划', '🎬', '将创意从零推进到大银幕，统筹内容与商业', '{"项目策划与选题", "预算与进度管理", "主创团队组建", "宣发策略制定"}', '{"项目管理", "内容审美", "商业谈判"}', '{"行业人脉", "数据分析", "法律知识"}', '本科及以上', '1-5年', 45, 80, 55, 35, 50, 30, 75, '{"film_beijing"}'),
('homestay_owner', 'hospitality', '民宿主理人', '🏡', '经营一家有灵魂的小院，让旅人找到家外之家', '{"房源装修与维护", "住客接待与关系维护", "内容营销与OTA运营", "在地体验活动设计"}', '{"审美能力", "服务意识", "自媒体运营"}', '{"装修设计", "财务管理", "在地文化挖掘"}', '不限', '0-3年', 90, 55, 45, 70, 40, 30, 40, '{"homestay_dali"}'),
('kol_creator', 'media', 'KOL/内容创作者', '📸', '用独特的审美和态度圈粉，实现内容变现', '{"内容策划与创作", "品牌合作与商务谈判", "粉丝运营与社群维护", "数据复盘与策略调整"}', '{"内容创作", "审美能力", "表达力"}', '{"数据分析", "品牌策划", "视频剪辑"}', '不限', '0-2年', 75, 65, 60, 50, 60, 25, 80, '{"kol_chengdu"}'),
('ecommerce_operator', 'ecommerce', '电商运营', '📊', '从选品到投流到售后，全链路掌控一个店铺', '{"选品与定价策略", "投流优化与ROI管理", "店铺视觉与详情页优化", "售后与复购运营"}', '{"数据分析", "选品直觉", "执行力"}', '{"供应链管理", "品牌策划", "AI工具使用"}', '大专及以上', '0-3年', 45, 50, 70, 35, 65, 40, 75, '{"ecommerce_hangzhou"}'),
('sales_manager', 'internet', '大客户销售/BD', '💼', '用专业和人脉撬动大客户，驱动业绩增长', '{"大客户开发与维护", "商务谈判与签约", "市场情报收集", "团队管理与培训"}', '{"沟通表达", "谈判技巧", "抗压能力"}', '{"行业知识", "数据分析", "项目管理"}', '本科及以上', '1-5年', 40, 90, 80, 30, 60, 45, 70, '{"sales_suzhou"}'),
('tea_artisan', 'tea', '茶艺师/制茶人', '🍵', '守护千年茶文化，让传统在当代绽放新生命', '{"传统制茶工艺传承", "茶文化体验活动设计", "品牌内容创作", "客户关系维护"}', '{"制茶工艺", "茶文化知识", "审美能力"}', '{"自媒体运营", "品牌运营", "直播带货"}', '不限(师徒制)', '1-5年', 75, 50, 35, 80, 35, 60, 25, '{"tea_grower_anxi"}');

-- ============================================
-- 种子数据：薪资
-- ============================================
INSERT INTO salary_data (job_id, city_id, experience_level, min_salary, max_salary, median_salary, bonus_months, stock_likelihood) VALUES
('product_manager', 'shanghai', 'entry', 8, 15, 11, 1.5, 0.1),
('product_manager', 'shanghai', 'mid', 18, 35, 25, 2.0, 0.3),
('product_manager', 'shanghai', 'senior', 30, 55, 40, 3.0, 0.5),
('product_manager', 'beijing', 'entry', 10, 18, 13, 1.5, 0.15),
('product_manager', 'beijing', 'mid', 20, 38, 28, 2.0, 0.35),
('product_manager', 'shenzhen', 'entry', 9, 16, 12, 1.5, 0.2),
('product_manager', 'hangzhou', 'entry', 8, 14, 10, 1.5, 0.15),
('ai_engineer', 'beijing', 'entry', 20, 35, 28, 2.5, 0.3),
('ai_engineer', 'beijing', 'mid', 35, 60, 45, 3.0, 0.5),
('ai_engineer', 'beijing', 'senior', 50, 80, 65, 4.0, 0.7),
('ai_engineer', 'shenzhen', 'entry', 22, 38, 30, 2.5, 0.35),
('ai_engineer', 'shanghai', 'entry', 20, 35, 27, 2.5, 0.3),
('software_engineer', 'shenzhen', 'entry', 12, 22, 16, 1.5, 0.2),
('software_engineer', 'shenzhen', 'mid', 25, 50, 35, 2.0, 0.4),
('software_engineer', 'shenzhen', 'senior', 40, 80, 55, 3.0, 0.6),
('software_engineer', 'beijing', 'entry', 14, 25, 18, 1.5, 0.2),
('software_engineer', 'shanghai', 'entry', 13, 24, 17, 1.5, 0.2),
('ux_designer', 'hangzhou', 'entry', 7, 14, 10, 1.5, 0.1),
('ux_designer', 'hangzhou', 'mid', 15, 28, 20, 2.0, 0.2),
('ux_designer', 'shanghai', 'entry', 8, 16, 11, 1.5, 0.1),
('ux_designer', 'shenzhen', 'entry', 8, 15, 11, 1.5, 0.15),
('lawyer', 'beijing', 'entry', 6, 12, 8, 1.0, 0.0),
('lawyer', 'beijing', 'mid', 15, 35, 22, 2.0, 0.0),
('lawyer', 'beijing', 'senior', 30, 60, 42, 3.0, 0.0),
('lawyer', 'shanghai', 'entry', 7, 14, 10, 1.0, 0.0),
('lawyer', 'shenzhen', 'entry', 6, 13, 9, 1.0, 0.0),
('hotel_manager', 'hongkong', 'entry', 10, 18, 13, 2.0, 0.0),
('hotel_manager', 'hongkong', 'mid', 20, 40, 28, 2.5, 0.0),
('hotel_manager', 'hongkong', 'senior', 35, 65, 48, 3.0, 0.0),
('hotel_manager', 'shanghai', 'entry', 8, 15, 11, 1.5, 0.0),
('livestream_host', 'guangzhou', 'entry', 5, 10, 7, 0.0, 0.0),
('livestream_host', 'guangzhou', 'mid', 10, 50, 20, 0.0, 0.0),
('livestream_host', 'hangzhou', 'entry', 5, 12, 8, 0.0, 0.0),
('homestay_owner', 'dali', 'entry', 5, 10, 7, 0.0, 0.0),
('homestay_owner', 'dali', 'mid', 8, 20, 12, 0.0, 0.0),
('kol_creator', 'chengdu', 'entry', 3, 8, 5, 0.0, 0.0),
('kol_creator', 'chengdu', 'mid', 8, 30, 15, 0.0, 0.0),
('kol_creator', 'shanghai', 'entry', 5, 12, 7, 0.0, 0.0),
('ecommerce_operator', 'hangzhou', 'entry', 6, 12, 8, 1.0, 0.1),
('ecommerce_operator', 'hangzhou', 'mid', 12, 25, 17, 1.5, 0.2),
('ecommerce_operator', 'guangzhou', 'entry', 5, 10, 7, 1.0, 0.1),
('tea_artisan', 'anxi', 'entry', 4, 8, 5, 0.5, 0.0),
('tea_artisan', 'anxi', 'mid', 8, 18, 11, 0.5, 0.0),
('tea_artisan', 'xiamen', 'entry', 5, 10, 7, 0.5, 0.0),
('sales_manager', 'suzhou', 'entry', 8, 15, 10, 2.0, 0.1),
('sales_manager', 'suzhou', 'mid', 15, 30, 20, 3.0, 0.15),
('sales_manager', 'shanghai', 'entry', 10, 18, 13, 2.0, 0.1),
('film_producer', 'beijing', 'entry', 5, 10, 7, 0.5, 0.0),
('film_producer', 'beijing', 'mid', 12, 25, 17, 1.0, 0.05),
('flight_attendant', 'shenzhen', 'entry', 8, 15, 10, 2.0, 0.0),
('flight_attendant', 'guangzhou', 'entry', 8, 16, 11, 2.0, 0.0),
('police_officer', 'qingdao', 'entry', 6, 10, 7, 2.0, 0.0),
('police_officer', 'beijing', 'entry', 7, 12, 9, 2.0, 0.0);

-- ============================================
-- 种子数据：风险评估
-- ============================================
INSERT INTO risk_assessment (job_id, risk_type, risk_level, description, mitigation, probability, impact_score) VALUES
('product_manager', 'AI替代', '中', 'AI可辅助需求分析和文档撰写，但产品决策仍需人类判断力', '培养商业敏感度和跨领域洞察力', 0.3, 40),
('product_manager', '行业周期', '中', '互联网行业周期波动，裁员风险存在', '建立复合技能矩阵，不绑定单一赛道', 0.4, 50),
('ux_designer', 'AI替代', '高', 'AI设计工具可替代大量基础设计执行工作', '从执行者升级为创意策略者，强化个人风格', 0.6, 60),
('ai_engineer', '行业周期', '低', 'AI人才需求持续旺盛，短期不会降温', '持续学习前沿技术，保持竞争力', 0.15, 30),
('ai_engineer', '健康风险', '中', '长期高压研发可能影响身心健康', '建立运动习惯，注意劳逸结合', 0.5, 55),
('software_engineer', 'AI替代', '中', 'AI辅助编程普及，初级CRUD工程师最危险', '从写代码升级为设计系统', 0.4, 50),
('lawyer', 'AI替代', '低', '法律分析可被AI辅助，但庭审和谈判不可替代', '聚焦高价值的人情洞察和复杂案件', 0.2, 30),
('lawyer', '行业周期', '中', '经济下行期法律需求反而可能增加', '建立多元化客户来源', 0.3, 35),
('livestream_host', '行业周期', '高', '直播行业竞争激烈，流量获取成本持续上升', '从流量思维转向品牌思维，建立私域', 0.6, 70),
('livestream_host', '健康风险', '中', '长期高强度直播影响嗓子和作息', '注意嗓音保护，建立规律作息', 0.5, 45),
('homestay_owner', '行业周期', '高', '民宿行业受旅游淡旺季影响大，收入不稳定', '发展民宿+模式，淡季做内容/活动', 0.7, 65),
('kol_creator', 'AI替代', '中', 'AI内容工具让创作门槛降低，竞争加剧', '强化个人IP的独特性和真实感', 0.35, 45),
('ecommerce_operator', '行业周期', '中', '电商竞争白热化，平台规则变化快', '掌握多平台运营能力，关注新兴渠道', 0.45, 50),
('film_producer', '行业周期', '高', '影视行业周期性明显，项目制收入不稳定', '储备现金流，拓展短剧等轻量级内容', 0.65, 60),
('flight_attendant', '健康风险', '中', '长期飞行影响生物钟和身体健康', '注意休息规律，加强锻炼', 0.55, 40),
('tea_artisan', 'AI替代', '低', '手工制茶工艺难以被AI完全替代', '持续精进传统工艺，结合现代营销', 0.1, 15);

-- ============================================
-- 种子数据：市场分析
-- ============================================
INSERT INTO market_analysis (job_id, analysis_type, content, score, data_date) VALUES
('product_manager', 'demand', '产品经理岗位需求稳中有降，但对高级产品经理的需求反而增加', 65, '2026-05-01'),
('product_manager', 'trend', 'AI产品化和出海是两大增长方向，传统互联网产品经理需转型', 70, '2026-05-01'),
('ai_engineer', 'demand', 'AI工程师需求井喷，大模型相关岗位同比增长200%+', 95, '2026-05-01'),
('ai_engineer', 'trend', '从大模型训练转向应用落地，Agent架构工程师最稀缺', 90, '2026-05-01'),
('software_engineer', 'demand', '通用开发岗位趋于饱和，但AI工程化和系统架构方向仍有大量需求', 60, '2026-05-01'),
('ux_designer', 'demand', '基础UI设计岗位减少，UX研究和体验策略方向需求上升', 55, '2026-05-01'),
('lawyer', 'demand', '律师总需求稳定，但合规、数据隐私等新领域增速显著', 70, '2026-05-01'),
('livestream_host', 'demand', '直播主播供给远大于需求，但优质操盘手仍然稀缺', 50, '2026-05-01'),
('homestay_owner', 'demand', '精品民宿仍有市场空间，但中低端民宿已严重过剩', 45, '2026-05-01'),
('kol_creator', 'demand', '内容创作者数量暴涨，但真正能持续变现的不到5%', 50, '2026-05-01'),
('ecommerce_operator', 'demand', '电商运营需求仍然旺盛，尤其跨境和品牌化方向', 75, '2026-05-01'),
('film_producer', 'demand', '传统影视岗位萎缩，短剧和微短剧方向岗位暴增', 55, '2026-05-01'),
('sales_manager', 'demand', '大客户销售永远是稀缺人才，但数字化正在改变销售方式', 70, '2026-05-01'),
('tea_artisan', 'demand', '茶艺师需求稳定增长，年轻人对茶文化的兴趣正在回升', 60, '2026-05-01');

-- ============================================
-- Realtime 发布
-- ============================================
ALTER PUBLICATION supabase_realtime ADD TABLE industries;
ALTER PUBLICATION supabase_realtime ADD TABLE jobs;
ALTER PUBLICATION supabase_realtime ADD TABLE job_favorites;
