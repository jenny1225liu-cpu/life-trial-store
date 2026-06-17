import { supabase, type Industry, type Job, type City, type SalaryData, type RiskAssessment, type MarketAnalysis } from "./supabase";

// ============================================
// 通用查询：先 Supabase，失败则降级到本地数据
// ============================================

let _dbAvailable: boolean | null = null;

async function isDbAvailable(): Promise<boolean> {
  if (_dbAvailable !== null) return _dbAvailable;
  try {
    const { count, error } = await supabase
      .from("industries")
      .select("*", { count: "exact", head: true });
    _dbAvailable = !error && (count ?? 0) > 0;
    return _dbAvailable;
  } catch {
    _dbAvailable = false;
    return false;
  }
}

// ============================================
// 行业数据
// ============================================

const LOCAL_INDUSTRIES: Industry[] = [
  { id: "internet", name: "互联网/科技", icon: "💻", description: "以软件开发、产品运营为核心的数字经济产业", trend: "从野蛮增长转向精细化运营，AI 重塑产品与技术栈", outlook: "结构性调整，但好人才永远稀缺", hot_skills: ["AI产品化", "数据驱动决策", "系统设计"], avg_salary_range: "8k-60k/月", risk_level: "中", is_active: true },
  { id: "creative", name: "创意设计/文创", icon: "🎨", description: "视觉传达、品牌设计、插画、文创产品等创意产业", trend: "AI工具普及让执行力贬值，个人风格越来越值钱", outlook: "看涨——个人IP时代，有温度的设计者最吃香", hot_skills: ["AI协作设计", "个人IP运营", "品牌美学"], avg_salary_range: "6k-35k/月", risk_level: "中", is_active: true },
  { id: "finance", name: "金融/投资", icon: "🏦", description: "银行、证券、基金、保险、金融科技等", trend: "传统岗位竞争白热化，金融科技赛道催生新一代精英", outlook: "分化严重——细分领域机会巨大", hot_skills: ["量化分析", "风控建模", "金融科技"], avg_salary_range: "10k-80k/月", risk_level: "中", is_active: true },
  { id: "education", name: "教育/培训", icon: "📚", description: "K12、高等教育、职业培训、在线教育等", trend: "AI辅助教学已成趋势，有温度的教育者永远稀缺", outlook: "稳定增长，AI+教育有结构性机会", hot_skills: ["AI辅助教学", "内容设计", "社区运营"], avg_salary_range: "5k-25k/月", risk_level: "低", is_active: true },
  { id: "healthcare", name: "医疗/健康", icon: "🏥", description: "临床医疗、医药研发、医疗器械、健康管理", trend: "AI辅助诊断正在改变规则，但医生核心价值不可替代", outlook: "长期看涨，老龄化带来持续需求", hot_skills: ["AI辅助诊断", "精准医疗", "健康管理"], avg_salary_range: "5k-60k/月", risk_level: "低", is_active: true },
  { id: "ecommerce", name: "电商/新零售", icon: "🛒", description: "电商平台、直播带货、跨境电商、供应链管理", trend: "内卷加剧，跨境出海和品牌化是两大结构性机会", outlook: "高速发展期，马太效应加剧", hot_skills: ["跨境运营", "数据选品", "品牌策划"], avg_salary_range: "5k-50k/月", risk_level: "高", is_active: true },
  { id: "media", name: "影视/文娱", icon: "🎬", description: "电影、电视剧、短视频、直播、游戏等", trend: "传统影视遇冷，短剧和AI制作工具正在重塑行业", outlook: "结构性调整，好内容永远有价值", hot_skills: ["短剧制作", "AI辅助创作", "IP运营"], avg_salary_range: "4k-40k/月", risk_level: "高", is_active: true },
  { id: "hospitality", name: "酒店/文旅", icon: "🏨", description: "高端酒店、民宿、旅游定制、文旅策划", trend: "高端旅行回暖，客人更追求在地体验而非标准化", outlook: "稳步增长，个性化服务人才紧缺", hot_skills: ["沉浸式体验设计", "数字化运营", "在地文化挖掘"], avg_salary_range: "6k-40k/月", risk_level: "中", is_active: true },
  { id: "legal", name: "法律/合规", icon: "⚖️", description: "律师事务所、企业法务、合规咨询", trend: "传统诉讼增长放缓，合规、数据隐私等新赛道爆发", outlook: "结构性分化，细分领域机会巨大", hot_skills: ["跨境合规", "数据隐私法", "法律科技"], avg_salary_range: "8k-50k/月", risk_level: "低", is_active: true },
  { id: "food", name: "餐饮/食品", icon: "🍜", description: "餐饮连锁、食品研发、供应链、美食内容", trend: "精品化转型中，小而美的餐饮IP有生存空间", outlook: "高度竞争，差异化才能活", hot_skills: ["餐饮IP打造", "供应链优化", "内容营销"], avg_salary_range: "4k-25k/月", risk_level: "高", is_active: true },
  { id: "public", name: "公共管理/基层治理", icon: "🏛️", description: "公务员、基层治理、公共安全、应急管理", trend: "智慧政务+网格化管理是方向，传统向服务型转变", outlook: "稳定刚需，数字化转型带来新机会", hot_skills: ["数字化治理", "群众工作", "应急响应"], avg_salary_range: "5k-15k/月", risk_level: "低", is_active: true },
  { id: "tea", name: "茶产业/非遗", icon: "🍵", description: "茶叶种植、加工、品牌、茶文化传播", trend: "国潮+短视频让传统茶文化破圈，标准化仍是瓶颈", outlook: "文化价值看涨，商业变现需创新", hot_skills: ["内容创作", "品牌运营", "直播带货"], avg_salary_range: "5k-20k/月", risk_level: "中", is_active: true },
  { id: "automotive", name: "汽车/新能源", icon: "🚗", description: "新能源汽车、智能驾驶、汽车后市场", trend: "新能源和智能化双轮驱动，人才需求井喷", outlook: "强烈看涨，人才供不应求", hot_skills: ["智能驾驶", "三电系统", "车载软件"], avg_salary_range: "10k-50k/月", risk_level: "低", is_active: true },
  { id: "realestate", name: "房产/建筑", icon: "🏗️", description: "房地产开发、建筑设计、城市规划", trend: "行业深度调整期，城市更新和绿色建筑是新方向", outlook: "震荡调整，转型期有机会", hot_skills: ["绿色建筑", "城市更新", "BIM技术"], avg_salary_range: "8k-40k/月", risk_level: "高", is_active: true },
];

export async function getIndustries(): Promise<Industry[]> {
  const dbOk = await isDbAvailable();
  if (dbOk) {
    try {
      const { data, error } = await supabase
        .from("industries")
        .select("*")
        .eq("is_active", true)
        .order("name");
      if (!error && data && data.length > 0) return data as Industry[];
    } catch { /* fallback */ }
  }
  return LOCAL_INDUSTRIES;
}

export async function getIndustry(id: string): Promise<Industry | null> {
  const dbOk = await isDbAvailable();
  if (dbOk) {
    try {
      const { data, error } = await supabase
        .from("industries")
        .select("*")
        .eq("id", id)
        .single();
      if (!error && data) return data as Industry;
    } catch { /* fallback */ }
  }
  return LOCAL_INDUSTRIES.find(i => i.id === id) || null;
}

// ============================================
// 岗位数据
// ============================================

const LOCAL_JOBS: Job[] = [
  // ---------- 互联网/科技 ----------
  { id: "product_manager", industry_id: "internet", name: "产品经理", icon: "📊", description: "连接用户需求与商业目标，定义产品方向与功能优先级", responsibilities: ["需求分析与优先级排序", "跨团队沟通协调", "数据驱动的产品决策", "用户调研与反馈闭环"], required_skills: ["逻辑思维", "数据分析", "沟通表达"], preferred_skills: ["技术理解力", "商业敏感度", "设计审美"], education_required: "本科及以上", experience_required: "0-3年", freedom_score: 55, connection_score: 75, wealth_score: 70, peace_score: 45, growth_score: 75, stability_score: 50, competition_score: 80, related_trial_ids: ["pm_shanghai"], is_active: true },
  { id: "ai_engineer", industry_id: "internet", name: "AI算法工程师", icon: "🧠", description: "研发AI模型与算法，将前沿研究转化为产品能力", responsibilities: ["大模型训练与微调", "算法优化与部署", "前沿论文复现", "技术方案设计"], required_skills: ["Python", "深度学习框架", "数学基础"], preferred_skills: ["工程化能力", "业务理解", "论文写作"], education_required: "硕士及以上", experience_required: "0-5年", freedom_score: 40, connection_score: 45, wealth_score: 85, peace_score: 35, growth_score: 90, stability_score: 60, competition_score: 95, related_trial_ids: ["ai_beijing"], is_active: true },
  { id: "software_engineer", industry_id: "internet", name: "软件工程师", icon: "🧑‍💻", description: "构建和维护软件系统，用代码解决现实问题", responsibilities: ["系统架构设计与开发", "代码审查与优化", "技术文档编写", "线上问题排查"], required_skills: ["编程语言(Java/Go/Python)", "数据结构", "系统设计"], preferred_skills: ["云原生", "DevOps", "AI工程化"], education_required: "本科及以上", experience_required: "0-5年", freedom_score: 50, connection_score: 40, wealth_score: 80, peace_score: 40, growth_score: 85, stability_score: 55, competition_score: 85, related_trial_ids: ["engineer_shenzhen"], is_active: true },
  { id: "sales_manager", industry_id: "internet", name: "大客户销售/BD", icon: "💼", description: "用专业和人脉撬动大客户，驱动业绩增长", responsibilities: ["大客户开发与维护", "商务谈判与签约", "市场情报收集", "团队管理与培训"], required_skills: ["沟通表达", "谈判技巧", "抗压能力"], preferred_skills: ["行业知识", "数据分析", "项目管理"], education_required: "本科及以上", experience_required: "1-5年", freedom_score: 40, connection_score: 90, wealth_score: 80, peace_score: 30, growth_score: 60, stability_score: 45, competition_score: 70, related_trial_ids: ["sales_suzhou"], is_active: true },
  { id: "data_analyst", industry_id: "internet", name: "数据分析师", icon: "📈", description: "从海量数据中提炼洞察，驱动业务决策", responsibilities: ["数据清洗与建模", "业务指标监控与归因", "可视化报表输出", "A/B实验设计与分析"], required_skills: ["SQL", "Python/R", "统计基础"], preferred_skills: ["机器学习", "业务理解", "数据可视化"], education_required: "本科及以上", experience_required: "0-3年", freedom_score: 55, connection_score: 50, wealth_score: 60, peace_score: 55, growth_score: 70, stability_score: 60, competition_score: 65, related_trial_ids: [], is_active: true },
  { id: "frontend_engineer", industry_id: "internet", name: "前端工程师", icon: "🖥️", description: "用代码把设计变成可交互的界面", responsibilities: ["Web/App前端开发", "性能优化与体验打磨", "组件库维护", "与设计/后端协作"], required_skills: ["HTML/CSS/JavaScript", "React/Vue", "浏览器原理"], preferred_skills: ["TypeScript", "工程化", "动画交互"], education_required: "本科及以上", experience_required: "0-3年", freedom_score: 50, connection_score: 40, wealth_score: 70, peace_score: 45, growth_score: 75, stability_score: 50, competition_score: 75, related_trial_ids: [], is_active: true },
  { id: "devops_engineer", industry_id: "internet", name: "运维/DevOps工程师", icon: "⚙️", description: "让系统稳定运行，让部署自动化", responsibilities: ["CI/CD流水线搭建", "服务器监控与告警", "容器化与编排", "故障排查与恢复"], required_skills: ["Linux", "Docker/K8s", "脚本语言"], preferred_skills: ["云平台", "监控工具", "网络基础"], education_required: "本科及以上", experience_required: "1-5年", freedom_score: 45, connection_score: 50, wealth_score: 70, peace_score: 45, growth_score: 70, stability_score: 55, competition_score: 55, related_trial_ids: [], is_active: true },
  { id: "growth_hacker", industry_id: "internet", name: "增长黑客", icon: "🚀", description: "用数据和实验找到增长的突破口", responsibilities: ["增长实验设计", "漏斗分析与优化", "渠道ROI评估", "用户生命周期管理"], required_skills: ["数据分析", "实验设计", "用户心理"], preferred_skills: ["编程基础", "营销知识", "产品思维"], education_required: "本科及以上", experience_required: "1-3年", freedom_score: 55, connection_score: 55, wealth_score: 70, peace_score: 35, growth_score: 85, stability_score: 40, competition_score: 70, related_trial_ids: [], is_active: true },
  { id: "project_manager", industry_id: "internet", name: "项目经理", icon: "📋", description: "让复杂项目按时按质交付", responsibilities: ["项目计划制定", "进度与风险管控", "跨部门协调", "资源分配与优化"], required_skills: ["项目管理", "沟通协调", "风险识别"], preferred_skills: ["PMP认证", "敏捷开发", "技术背景"], education_required: "本科及以上", experience_required: "2-5年", freedom_score: 40, connection_score: 75, wealth_score: 60, peace_score: 45, growth_score: 55, stability_score: 60, competition_score: 50, related_trial_ids: [], is_active: true },

  // ---------- 创意设计/文创 ----------
  { id: "ux_designer", industry_id: "creative", name: "用户体验设计师", icon: "🎨", description: "用设计思维解决用户痛点，让产品既好看又好用", responsibilities: ["用户调研与旅程地图", "交互原型设计", "视觉规范维护", "A/B测试与迭代"], required_skills: ["Figma/Sketch", "交互设计", "用户研究"], preferred_skills: ["前端基础", "数据分析", "心理学"], education_required: "本科及以上", experience_required: "0-3年", freedom_score: 60, connection_score: 50, wealth_score: 55, peace_score: 55, growth_score: 70, stability_score: 55, competition_score: 70, related_trial_ids: ["designer_hangzhou"], is_active: true },
  { id: "brand_designer", industry_id: "creative", name: "平面/品牌设计师", icon: "🎯", description: "用视觉语言构建品牌认知", responsibilities: ["品牌视觉系统设计", "营销物料创意", "包装与排版", "品牌规范维护"], required_skills: ["Photoshop/Illustrator", "排版设计", "色彩理论"], preferred_skills: ["品牌策略", "动态设计", "3D设计"], education_required: "本科及以上", experience_required: "0-3年", freedom_score: 55, connection_score: 45, wealth_score: 50, peace_score: 55, growth_score: 60, stability_score: 50, competition_score: 70, related_trial_ids: [], is_active: true },
  { id: "illustrator", industry_id: "creative", name: "插画师", icon: "✏️", description: "用画笔构建独特的视觉叙事", responsibilities: ["商业插画创作", "绘本/漫画绘制", "IP形象设计", "与品牌方沟通需求"], required_skills: ["绘画功底", "数字绘画工具", "色彩与构图"], preferred_skills: ["个人风格", "IP运营", "动画基础"], education_required: "不限", experience_required: "0-3年", freedom_score: 75, connection_score: 35, wealth_score: 45, peace_score: 65, growth_score: 55, stability_score: 35, competition_score: 60, related_trial_ids: [], is_active: true },
  { id: "copywriter", industry_id: "creative", name: "文案策划", icon: "✍️", description: "用文字打动人心，用故事塑造品牌", responsibilities: ["品牌文案撰写", "社交媒体内容策划", "广告创意发想", "传播方案撰写"], required_skills: ["文字功底", "创意思维", "洞察力"], preferred_skills: ["品牌策略", "数据分析", "短视频脚本"], education_required: "本科及以上", experience_required: "0-3年", freedom_score: 55, connection_score: 50, wealth_score: 50, peace_score: 50, growth_score: 60, stability_score: 45, competition_score: 65, related_trial_ids: [], is_active: true },
  { id: "freelance_designer", industry_id: "creative", name: "独立设计师", icon: "🦄", description: "不隶属任何公司，用设计能力换取自由", responsibilities: ["客户需求对接", "项目报价与排期", "设计交付与迭代", "个人品牌运营"], required_skills: ["设计全栈", "商务沟通", "时间管理"], preferred_skills: ["财务知识", "法律基础", "自媒体运营"], education_required: "不限", experience_required: "2-5年", freedom_score: 90, connection_score: 40, wealth_score: 55, peace_score: 65, growth_score: 50, stability_score: 25, competition_score: 60, related_trial_ids: [], is_active: true },

  // ---------- 金融/投资 ----------
  { id: "ib_analyst", industry_id: "finance", name: "投行分析师", icon: "💎", description: "在金融金字塔尖，用模型和分析撬动亿级交易", responsibilities: ["财务模型搭建", "尽职调查", "招股书撰写", "客户路演支持"], required_skills: ["财务建模", "行业研究", "Excel/PPT"], preferred_skills: ["CPA/CFA", "英语能力", "抗压能力"], education_required: "硕士及以上(名校)", experience_required: "0-3年", freedom_score: 25, connection_score: 75, wealth_score: 90, peace_score: 20, growth_score: 80, stability_score: 45, competition_score: 90, related_trial_ids: [], is_active: true },
  { id: "quant_trader", industry_id: "finance", name: "量化交易员", icon: "📊", description: "用数学模型和算法在市场中猎取alpha", responsibilities: ["交易策略研发", "回测与优化", "实盘监控与风控", "因子挖掘"], required_skills: ["数学/统计", "编程(Python/C++)", "金融知识"], preferred_skills: ["机器学习", "高频交易", "风险管理"], education_required: "硕士及以上(理工)", experience_required: "0-5年", freedom_score: 35, connection_score: 35, wealth_score: 85, peace_score: 30, growth_score: 80, stability_score: 40, competition_score: 85, related_trial_ids: [], is_active: true },
  { id: "risk_analyst", industry_id: "finance", name: "风控分析师", icon: "🛡️", description: "在金融风险的暗流中，做那个亮灯的人", responsibilities: ["风险模型构建", "信用评分体系", "压力测试", "监管合规审查"], required_skills: ["统计学", "风险管理", "SAS/Python"], preferred_skills: ["金融工程", "机器学习", "监管政策"], education_required: "硕士及以上", experience_required: "1-5年", freedom_score: 40, connection_score: 45, wealth_score: 70, peace_score: 50, growth_score: 65, stability_score: 65, competition_score: 55, related_trial_ids: [], is_active: true },
  { id: "fintech_pm", industry_id: "finance", name: "金融产品经理", icon: "💳", description: "用产品思维重塑传统金融服务", responsibilities: ["金融产品规划", "用户需求分析", "合规与风控整合", "产品迭代优化"], required_skills: ["产品思维", "金融知识", "数据分析"], preferred_skills: ["技术理解", "合规知识", "用户研究"], education_required: "本科及以上", experience_required: "1-5年", freedom_score: 45, connection_score: 60, wealth_score: 70, peace_score: 45, growth_score: 75, stability_score: 55, competition_score: 60, related_trial_ids: [], is_active: true },
  { id: "wealth_advisor", industry_id: "finance", name: "理财顾问", icon: "💰", description: "帮助客户实现财富的保值与增值", responsibilities: ["客户资产配置", "投资组合建议", "市场研究与解读", "客户关系维护"], required_skills: ["金融产品知识", "沟通表达", "市场分析"], preferred_skills: ["CFP认证", "高净值客户管理", "税务规划"], education_required: "本科及以上", experience_required: "1-5年", freedom_score: 50, connection_score: 80, wealth_score: 75, peace_score: 45, growth_score: 55, stability_score: 50, competition_score: 65, related_trial_ids: [], is_active: true },

  // ---------- 教育/培训 ----------
  { id: "teacher", industry_id: "education", name: "高中教师", icon: "📖", description: "传道授业解惑，影响下一代的成长", responsibilities: ["课程教学与备课", "学生辅导与答疑", "考试出题与批改", "班级管理与家长沟通"], required_skills: ["学科知识", "教学能力", "沟通表达"], preferred_skills: ["心理辅导", "教育技术", "课程创新"], education_required: "硕士及以上(师范)", experience_required: "0-3年", freedom_score: 40, connection_score: 65, wealth_score: 40, peace_score: 70, growth_score: 45, stability_score: 80, competition_score: 50, related_trial_ids: [], is_active: true },
  { id: "curriculum_designer", industry_id: "education", name: "课程设计师", icon: "🧩", description: "把知识体系拆解成可习得的学习路径", responsibilities: ["课程框架设计", "教学内容开发", "学习效果评估", "教学工具选型"], required_skills: ["教学设计", "内容策划", "用户研究"], preferred_skills: ["在线教育平台", "数据分析", "AI教育工具"], education_required: "硕士及以上", experience_required: "1-5年", freedom_score: 60, connection_score: 45, wealth_score: 50, peace_score: 60, growth_score: 65, stability_score: 60, competition_score: 45, related_trial_ids: [], is_active: true },
  { id: "corporate_trainer", industry_id: "education", name: "企业培训师", icon: "🎤", description: "帮助组织和个人提升能力与认知", responsibilities: ["培训需求分析", "课程开发与授课", "培训效果评估", "组织发展咨询"], required_skills: ["演讲表达", "课程开发", "引导技术"], preferred_skills: ["教练技术", "组织发展", "行业经验"], education_required: "本科及以上", experience_required: "3-8年", freedom_score: 55, connection_score: 85, wealth_score: 55, peace_score: 55, growth_score: 55, stability_score: 55, competition_score: 50, related_trial_ids: [], is_active: true },
  { id: "edtech_specialist", industry_id: "education", name: "教育技术专家", icon: "🎓", description: "用技术重塑教育的交付方式", responsibilities: ["教育AI工具研发", "在线学习平台搭建", "教学数据分析", "智慧校园规划"], required_skills: ["教育理论", "技术理解", "产品思维"], preferred_skills: ["AI/ML基础", "LMS系统", "用户体验"], education_required: "硕士及以上", experience_required: "1-5年", freedom_score: 50, connection_score: 45, wealth_score: 55, peace_score: 55, growth_score: 75, stability_score: 55, competition_score: 40, related_trial_ids: [], is_active: true },

  // ---------- 医疗/健康 ----------
  { id: "doctor", industry_id: "healthcare", name: "临床医生", icon: "🩺", description: "在生死之间，用专业和判断力守护生命", responsibilities: ["门诊与住院诊疗", "手术操作(外科)", "病历书写与查房", "医患沟通与随访"], required_skills: ["医学知识", "临床思维", "操作技能"], preferred_skills: ["科研能力", "沟通技巧", "AI辅助诊断"], education_required: "硕士及以上(医学)", experience_required: "3-8年(含规培)", freedom_score: 25, connection_score: 70, wealth_score: 65, peace_score: 40, growth_score: 55, stability_score: 75, competition_score: 60, related_trial_ids: [], is_active: true },
  { id: "pharma_researcher", industry_id: "healthcare", name: "药物研发员", icon: "💊", description: "在实验室里寻找治愈疾病的钥匙", responsibilities: ["新药靶点筛选", "药效与毒性实验", "临床试验方案设计", "注册申报材料撰写"], required_skills: ["药理学", "实验技术", "数据分析"], preferred_skills: ["分子生物学", "AI药物筛选", "英语论文写作"], education_required: "博士", experience_required: "0-5年", freedom_score: 40, connection_score: 35, wealth_score: 60, peace_score: 55, growth_score: 70, stability_score: 60, competition_score: 50, related_trial_ids: [], is_active: true },
  { id: "nurse", industry_id: "healthcare", name: "护理师", icon: "❤️", description: "用专业和温暖守护患者的每一天", responsibilities: ["患者日常护理", "医嘱执行与监测", "患者与家属沟通", "健康教育与康复指导"], required_skills: ["护理技术", "沟通能力", "责任心"], preferred_skills: ["专科护理", "心理疏导", "英语能力"], education_required: "大专及以上(护理)", experience_required: "0-3年", freedom_score: 20, connection_score: 75, wealth_score: 35, peace_score: 50, growth_score: 35, stability_score: 70, competition_score: 35, related_trial_ids: [], is_active: true },
  { id: "health_manager", industry_id: "healthcare", name: "健康管理师", icon: "🏃", description: "帮助人们建立科学的健康生活方式", responsibilities: ["健康风险评估", "个性化健康方案", "慢性病管理", "健康教育与讲座"], required_skills: ["健康评估", "营养学", "沟通能力"], preferred_skills: ["运动医学", "心理学", "数据分析"], education_required: "本科及以上", experience_required: "0-3年", freedom_score: 55, connection_score: 60, wealth_score: 45, peace_score: 65, growth_score: 55, stability_score: 55, competition_score: 40, related_trial_ids: [], is_active: true },

  // ---------- 电商/新零售 ----------
  { id: "livestream_host", industry_id: "ecommerce", name: "直播主播/操盘手", icon: "🎬", description: "在直播间用内容和话术驱动销售转化", responsibilities: ["直播话术与节奏把控", "选品与定价策略", "粉丝互动与维护", "数据分析与复盘"], required_skills: ["表达力", "镜头感", "选品直觉"], preferred_skills: ["数据分析", "供应链管理", "团队管理"], education_required: "不限", experience_required: "0-2年", freedom_score: 50, connection_score: 60, wealth_score: 75, peace_score: 30, growth_score: 65, stability_score: 25, competition_score: 85, related_trial_ids: ["livestream_guangzhou"], is_active: true },
  { id: "ecommerce_operator", industry_id: "ecommerce", name: "电商运营", icon: "📊", description: "从选品到投流到售后，全链路掌控一个店铺", responsibilities: ["选品与定价策略", "投流优化与ROI管理", "店铺视觉与详情页优化", "售后与复购运营"], required_skills: ["数据分析", "选品直觉", "执行力"], preferred_skills: ["供应链管理", "品牌策划", "AI工具使用"], education_required: "大专及以上", experience_required: "0-3年", freedom_score: 45, connection_score: 50, wealth_score: 70, peace_score: 35, growth_score: 65, stability_score: 40, competition_score: 75, related_trial_ids: ["ecommerce_hangzhou"], is_active: true },
  { id: "crossborder_operator", industry_id: "ecommerce", name: "跨境电商运营", icon: "🌏", description: "把中国好货卖到全世界", responsibilities: ["海外市场调研", "跨境平台运营", "国际物流协调", "海外社媒营销"], required_skills: ["英语能力", "跨境电商平台", "数据分析"], preferred_skills: ["小语种", "国际物流", "海外营销"], education_required: "本科及以上", experience_required: "0-3年", freedom_score: 50, connection_score: 55, wealth_score: 65, peace_score: 40, growth_score: 75, stability_score: 45, competition_score: 55, related_trial_ids: [], is_active: true },
  { id: "supply_chain_manager", industry_id: "ecommerce", name: "供应链经理", icon: "🔗", description: "从原料到消费者，掌控全链条效率", responsibilities: ["供应商开发与管理", "库存优化", "物流成本控制", "供应链数字化"], required_skills: ["供应链管理", "数据分析", "谈判技巧"], preferred_skills: ["ERP系统", "国际物流", "精益管理"], education_required: "本科及以上", experience_required: "2-5年", freedom_score: 35, connection_score: 65, wealth_score: 60, peace_score: 45, growth_score: 60, stability_score: 60, competition_score: 45, related_trial_ids: [], is_active: true },
  { id: "brand_strategist", industry_id: "ecommerce", name: "品牌策划师", icon: "✨", description: "让一个品牌从0到1，从1到N", responsibilities: ["品牌定位与策略", "视觉与文案体系搭建", "营销战役策划", "品牌资产监测"], required_skills: ["品牌策略", "市场洞察", "创意思维"], preferred_skills: ["数据分析", "内容营销", "消费者研究"], education_required: "本科及以上", experience_required: "2-5年", freedom_score: 50, connection_score: 60, wealth_score: 55, peace_score: 45, growth_score: 65, stability_score: 45, competition_score: 60, related_trial_ids: [], is_active: true },

  // ---------- 影视/文娱 ----------
  { id: "film_producer", industry_id: "media", name: "影视制片人/策划", icon: "🎬", description: "将创意从零推进到大银幕，统筹内容与商业", responsibilities: ["项目策划与选题", "预算与进度管理", "主创团队组建", "宣发策略制定"], required_skills: ["项目管理", "内容审美", "商业谈判"], preferred_skills: ["行业人脉", "数据分析", "法律知识"], education_required: "本科及以上", experience_required: "1-5年", freedom_score: 45, connection_score: 80, wealth_score: 55, peace_score: 35, growth_score: 50, stability_score: 30, competition_score: 75, related_trial_ids: ["film_beijing"], is_active: true },
  { id: "kol_creator", industry_id: "media", name: "KOL/内容创作者", icon: "📸", description: "用独特的审美和态度圈粉，实现内容变现", responsibilities: ["内容策划与创作", "品牌合作与商务谈判", "粉丝运营与社群维护", "数据复盘与策略调整"], required_skills: ["内容创作", "审美能力", "表达力"], preferred_skills: ["数据分析", "品牌策划", "视频剪辑"], education_required: "不限", experience_required: "0-2年", freedom_score: 75, connection_score: 65, wealth_score: 60, peace_score: 50, growth_score: 60, stability_score: 25, competition_score: 80, related_trial_ids: ["kol_chengdu"], is_active: true },
  { id: "director", industry_id: "media", name: "导演/编导", icon: "🎥", description: "用镜头语言讲述打动人心的故事", responsibilities: ["剧本解读与二度创作", "拍摄现场调度", "演员指导", "后期把控"], required_skills: ["视听语言", "叙事能力", "团队领导"], preferred_skills: ["剪辑基础", "编剧能力", "预算管理"], education_required: "本科及以上", experience_required: "2-8年", freedom_score: 40, connection_score: 75, wealth_score: 50, peace_score: 35, growth_score: 55, stability_score: 35, competition_score: 75, related_trial_ids: [], is_active: true },
  { id: "video_editor", industry_id: "media", name: "剪辑师", icon: "✂️", description: "在时间线上用剪裁重塑叙事节奏", responsibilities: ["素材整理与初剪", "节奏与叙事打磨", "特效与调色", "成片输出与版本管理"], required_skills: ["Premiere/FCP", "视听节奏感", "叙事理解"], preferred_skills: ["达芬奇调色", "AE特效", "AI辅助剪辑"], education_required: "大专及以上", experience_required: "0-3年", freedom_score: 55, connection_score: 45, wealth_score: 45, peace_score: 55, growth_score: 55, stability_score: 45, competition_score: 60, related_trial_ids: [], is_active: true },
  { id: "game_designer", industry_id: "media", name: "游戏策划", icon: "🎮", description: "构建虚拟世界的规则与乐趣", responsibilities: ["游戏系统设计", "数值平衡与调试", "关卡与剧情设计", "用户体验测试"], required_skills: ["游戏设计理论", "数据分析", "创意思维"], preferred_skills: ["编程基础", "美术审美", "心理学"], education_required: "本科及以上", experience_required: "0-3年", freedom_score: 50, connection_score: 55, wealth_score: 60, peace_score: 45, growth_score: 65, stability_score: 45, competition_score: 70, related_trial_ids: [], is_active: true },

  // ---------- 酒店/文旅 ----------
  { id: "hotel_manager", industry_id: "hospitality", name: "酒店管理", icon: "🏨", description: "统筹酒店运营，为宾客提供极致入住体验", responsibilities: ["前台与客房运营管理", "宾客关系维护", "团队培训与排班", "预算与收益管理"], required_skills: ["沟通协调", "细节管理", "服务意识"], preferred_skills: ["多语言能力", "数据分析", "危机处理"], education_required: "本科及以上", experience_required: "1-5年", freedom_score: 35, connection_score: 85, wealth_score: 65, peace_score: 50, growth_score: 55, stability_score: 65, competition_score: 50, related_trial_ids: ["hotel_mgr_hongkong"], is_active: true },
  { id: "flight_attendant", industry_id: "hospitality", name: "空乘/乘务员", icon: "✈️", description: "在万米高空保障乘客安全，提供温馨服务", responsibilities: ["客舱安全检查与应急处理", "旅客服务与关怀", "团队协作与沟通", "特殊情况应对"], required_skills: ["服务意识", "沟通表达", "形象管理"], preferred_skills: ["英语能力", "急救知识", "跨文化沟通"], education_required: "大专及以上", experience_required: "0-2年", freedom_score: 30, connection_score: 65, wealth_score: 50, peace_score: 45, growth_score: 35, stability_score: 60, competition_score: 65, related_trial_ids: ["flight_attendant_shenzhen"], is_active: true },
  { id: "homestay_owner", industry_id: "hospitality", name: "民宿主理人", icon: "🏡", description: "经营一家有灵魂的小院，让旅人找到家外之家", responsibilities: ["房源装修与维护", "住客接待与关系维护", "内容营销与OTA运营", "在地体验活动设计"], required_skills: ["审美能力", "服务意识", "自媒体运营"], preferred_skills: ["装修设计", "财务管理", "在地文化挖掘"], education_required: "不限", experience_required: "0-3年", freedom_score: 90, connection_score: 55, wealth_score: 45, peace_score: 70, growth_score: 40, stability_score: 30, competition_score: 40, related_trial_ids: ["homestay_dali"], is_active: true },
  { id: "travel_planner", industry_id: "hospitality", name: "旅行策划师", icon: "🗺️", description: "为旅行者定制独一无二的行程体验", responsibilities: ["客户需求沟通", "行程路线设计", "供应商对接", "行中问题解决"], required_skills: ["旅行知识", "沟通能力", "组织能力"], preferred_skills: ["小众目的地", "多语言", "预算管理"], education_required: "大专及以上", experience_required: "0-3年", freedom_score: 60, connection_score: 65, wealth_score: 45, peace_score: 55, growth_score: 50, stability_score: 40, competition_score: 45, related_trial_ids: [], is_active: true },
  { id: "cultural_planner", industry_id: "hospitality", name: "文旅策划师", icon: "🏛️", description: "把在地文化变成可消费的体验产品", responsibilities: ["在地文化调研", "体验产品设计", "活动策划与执行", "IP打造与传播"], required_skills: ["文化研究", "策划能力", "审美能力"], preferred_skills: ["项目运营", "新媒体", "品牌包装"], education_required: "本科及以上", experience_required: "1-5年", freedom_score: 55, connection_score: 65, wealth_score: 50, peace_score: 55, growth_score: 60, stability_score: 45, competition_score: 45, related_trial_ids: [], is_active: true },

  // ---------- 法律/合规 ----------
  { id: "lawyer", industry_id: "legal", name: "律师", icon: "⚖️", description: "运用法律知识维护客户权益，解决法律纠纷", responsibilities: ["法律文书撰写", "案件分析与诉讼策略", "客户咨询与谈判", "合规审查"], required_skills: ["法律分析", "逻辑推理", "文书写作"], preferred_skills: ["行业专精", "谈判技巧", "英语能力"], education_required: "本科及以上(需法考)", experience_required: "1-5年", freedom_score: 45, connection_score: 70, wealth_score: 75, peace_score: 40, growth_score: 60, stability_score: 60, competition_score: 80, related_trial_ids: ["lawyer_beijing"], is_active: true },
  { id: "corporate_counsel", industry_id: "legal", name: "企业法务", icon: "📜", description: "在商业与法律的交汇处保驾护航", responsibilities: ["合同审查与起草", "法律风险排查", "诉讼与仲裁处理", "合规体系建设"], required_skills: ["公司法", "合同法", "风险识别"], preferred_skills: ["行业知识", "商业思维", "英语能力"], education_required: "本科及以上(需法考)", experience_required: "1-5年", freedom_score: 40, connection_score: 60, wealth_score: 65, peace_score: 50, growth_score: 55, stability_score: 65, competition_score: 55, related_trial_ids: [], is_active: true },
  { id: "compliance_officer", industry_id: "legal", name: "合规官", icon: "🔒", description: "确保企业在规则之内安全运行", responsibilities: ["合规制度设计", "监管政策解读", "合规培训", "违规调查与整改"], required_skills: ["合规知识", "监管政策", "风险评估"], preferred_skills: ["数据隐私", "反洗钱", "英语能力"], education_required: "本科及以上", experience_required: "2-8年", freedom_score: 35, connection_score: 55, wealth_score: 65, peace_score: 55, growth_score: 70, stability_score: 70, competition_score: 40, related_trial_ids: [], is_active: true },
  { id: "ip_lawyer", industry_id: "legal", name: "知识产权律师", icon: "©️", description: "守护创新者的无形资产", responsibilities: ["专利/商标申请", "侵权诉讼", "IP战略规划", "技术合同审查"], required_skills: ["知识产权法", "技术理解", "文书写作"], preferred_skills: ["理工背景", "英语能力", "专利代理师"], education_required: "本科及以上(需法考)", experience_required: "1-5年", freedom_score: 45, connection_score: 55, wealth_score: 70, peace_score: 45, growth_score: 70, stability_score: 60, competition_score: 50, related_trial_ids: [], is_active: true },

  // ---------- 餐饮/食品 ----------
  { id: "restaurant_manager", industry_id: "food", name: "餐厅经理", icon: "🍽️", description: "运营一家有灵魂的餐厅", responsibilities: ["日常运营管理", "菜单设计与定价", "团队培训", "客户体验优化"], required_skills: ["运营管理", "服务意识", "成本控制"], preferred_skills: ["营销推广", "供应链", "数据分析"], education_required: "大专及以上", experience_required: "1-5年", freedom_score: 35, connection_score: 75, wealth_score: 50, peace_score: 45, growth_score: 45, stability_score: 50, competition_score: 55, related_trial_ids: [], is_active: true },
  { id: "food_rnd", industry_id: "food", name: "食品研发员", icon: "🧪", description: "在实验室里发明下一个爆款食品", responsibilities: ["新品配方开发", "口感与营养优化", "工艺稳定性测试", "竞品分析与趋势研究"], required_skills: ["食品科学", "实验设计", "感官评定"], preferred_skills: ["营养学", "工业化生产", "消费者洞察"], education_required: "本科及以上(食品科学)", experience_required: "0-5年", freedom_score: 45, connection_score: 40, wealth_score: 50, peace_score: 55, growth_score: 55, stability_score: 60, competition_score: 40, related_trial_ids: [], is_active: true },
  { id: "food_creator", industry_id: "food", name: "美食内容创作者", icon: "📱", description: "用镜头和文字让食物变成内容", responsibilities: ["美食拍摄与后期", "食谱开发与测评", "社交媒体运营", "品牌合作与变现"], required_skills: ["摄影/视频", "美食鉴赏", "内容创作"], preferred_skills: ["社交媒体运营", "品牌合作", "数据分析"], education_required: "不限", experience_required: "0-2年", freedom_score: 75, connection_score: 50, wealth_score: 45, peace_score: 55, growth_score: 55, stability_score: 25, competition_score: 70, related_trial_ids: [], is_active: true },

  // ---------- 公共管理/基层治理 ----------
  { id: "police_officer", industry_id: "public", name: "警察/基层执法", icon: "👮", description: "维护社会治安，保护人民群众生命财产安全", responsibilities: ["治安巡逻与防控", "案件调查与取证", "群众工作与调解", "突发事件应急处理"], required_skills: ["体能", "法律知识", "沟通能力"], preferred_skills: ["心理素质", "数据分析", "谈判技巧"], education_required: "本科及以上(公务员)", experience_required: "0-3年", freedom_score: 25, connection_score: 70, wealth_score: 45, peace_score: 35, growth_score: 40, stability_score: 85, competition_score: 60, related_trial_ids: ["police_officer_qingdao"], is_active: true },
  { id: "civil_servant", industry_id: "public", name: "公务员", icon: "🏢", description: "在体制内服务公众，推动社会运转", responsibilities: ["政策执行与落实", "公文写作与汇报", "群众接待与服务", "跨部门协调"], required_skills: ["公文写作", "政策理解", "沟通协调"], preferred_skills: ["数据分析", "项目管理", "英语能力"], education_required: "本科及以上(需国/省考)", experience_required: "0-3年", freedom_score: 25, connection_score: 60, wealth_score: 45, peace_score: 65, growth_score: 35, stability_score: 90, competition_score: 85, related_trial_ids: [], is_active: true },
  { id: "community_worker", industry_id: "public", name: "社区工作者", icon: "🏘️", description: "在社区一线，连接政策与居民", responsibilities: ["居民服务与矛盾调解", "社区活动组织", "政策宣传与落实", "特殊群体关爱"], required_skills: ["沟通能力", "耐心", "组织能力"], preferred_skills: ["社工证", "心理疏导", "活动策划"], education_required: "大专及以上", experience_required: "0-2年", freedom_score: 35, connection_score: 75, wealth_score: 30, peace_score: 60, growth_score: 35, stability_score: 65, competition_score: 35, related_trial_ids: [], is_active: true },

  // ---------- 茶产业/非遗 ----------
  { id: "tea_artisan", industry_id: "tea", name: "茶艺师/制茶人", icon: "🍵", description: "守护千年茶文化，让传统在当代绽放新生命", responsibilities: ["传统制茶工艺传承", "茶文化体验活动设计", "品牌内容创作", "客户关系维护"], required_skills: ["制茶工艺", "茶文化知识", "审美能力"], preferred_skills: ["自媒体运营", "品牌运营", "直播带货"], education_required: "不限(师徒制)", experience_required: "1-5年", freedom_score: 75, connection_score: 50, wealth_score: 35, peace_score: 80, growth_score: 35, stability_score: 60, competition_score: 25, related_trial_ids: ["tea_grower_anxi"], is_active: true },
  { id: "tea_brand_manager", industry_id: "tea", name: "茶品牌运营", icon: "🏷️", description: "让传统茶文化以新姿态走向市场", responsibilities: ["品牌定位与包装", "线上渠道运营", "线下活动策划", "用户社群维护"], required_skills: ["品牌运营", "内容营销", "数据分析"], preferred_skills: ["茶文化", "电商运营", "直播带货"], education_required: "本科及以上", experience_required: "1-5年", freedom_score: 55, connection_score: 55, wealth_score: 50, peace_score: 55, growth_score: 55, stability_score: 50, competition_score: 45, related_trial_ids: [], is_active: true },
  { id: "tea_space_owner", industry_id: "tea", name: "茶空间主理人", icon: "🍃", description: "经营一间有灵魂的茶空间", responsibilities: ["空间设计与氛围营造", "茶品选品与定价", "茶会与体验活动", "会员体系运营"], required_skills: ["审美能力", "茶文化", "空间设计"], preferred_skills: ["运营管理", "内容营销", "社群运营"], education_required: "不限", experience_required: "1-5年", freedom_score: 85, connection_score: 55, wealth_score: 40, peace_score: 80, growth_score: 40, stability_score: 40, competition_score: 35, related_trial_ids: [], is_active: true },

  // ---------- 汽车/新能源 ----------
  { id: "autonomous_drive_eng", industry_id: "automotive", name: "智能驾驶工程师", icon: "🤖", description: "让汽车拥有自主驾驶的大脑", responsibilities: ["感知算法研发", "决策规划系统设计", "仿真测试与验证", "实车调试与优化"], required_skills: ["深度学习", "C++/Python", "计算机视觉"], preferred_skills: ["ROS", "传感器融合", "实时系统"], education_required: "硕士及以上", experience_required: "0-5年", freedom_score: 35, connection_score: 40, wealth_score: 85, peace_score: 35, growth_score: 95, stability_score: 55, competition_score: 80, related_trial_ids: [], is_active: true },
  { id: "battery_engineer", industry_id: "automotive", name: "新能源电池工程师", icon: "🔋", description: "研发下一代动力电池", responsibilities: ["电池材料研发", "电芯设计与测试", "电池管理系统开发", "安全性能验证"], required_skills: ["电化学", "材料科学", "实验设计"], preferred_skills: ["电池仿真", "BMS开发", "项目管理"], education_required: "硕士及以上", experience_required: "0-5年", freedom_score: 35, connection_score: 40, wealth_score: 75, peace_score: 45, growth_score: 85, stability_score: 55, competition_score: 55, related_trial_ids: [], is_active: true },
  { id: "automotive_designer", industry_id: "automotive", name: "汽车设计师", icon: "🚙", description: "用线条和曲面定义未来出行", responsibilities: ["外观造型设计", "内饰概念设计", "数字模型制作", "色彩与材质定义"], required_skills: ["工业设计", "Alias/Blender", "手绘能力"], preferred_skills: ["汽车工程基础", "CMF设计", "VR展示"], education_required: "本科及以上", experience_required: "0-5年", freedom_score: 50, connection_score: 45, wealth_score: 65, peace_score: 50, growth_score: 70, stability_score: 55, competition_score: 55, related_trial_ids: [], is_active: true },

  // ---------- 房产/建筑 ----------
  { id: "architect", industry_id: "realestate", name: "建筑设计师", icon: "🏛️", description: "用空间和结构表达对生活的理解", responsibilities: ["建筑方案设计", "施工图审核", "与甲方/结构/机电协调", "项目现场跟进"], required_skills: ["建筑设计", "CAD/BIM", "空间思维"], preferred_skills: ["参数化设计", "绿色建筑", "项目管理"], education_required: "本科及以上(建筑学)", experience_required: "0-5年", freedom_score: 45, connection_score: 55, wealth_score: 60, peace_score: 50, growth_score: 50, stability_score: 50, competition_score: 50, related_trial_ids: [], is_active: true },
  { id: "interior_designer", industry_id: "realestate", name: "室内设计师", icon: "🏠", description: "把毛坯房变成有温度的家", responsibilities: ["空间布局规划", "材质与色彩搭配", "施工跟进与验收", "软装方案设计"], required_skills: ["空间设计", "3Dmax/SketchUp", "审美能力"], preferred_skills: ["施工工艺", "预算控制", "灯光设计"], education_required: "本科及以上", experience_required: "0-5年", freedom_score: 55, connection_score: 55, wealth_score: 55, peace_score: 55, growth_score: 50, stability_score: 50, competition_score: 55, related_trial_ids: [], is_active: true },
  { id: "bim_engineer", industry_id: "realestate", name: "BIM工程师", icon: "💻", description: "用数字化模型重塑建筑设计流程", responsibilities: ["BIM模型创建", "碰撞检查与优化", "施工模拟", "运维模型交付"], required_skills: ["Revit/ArchiCAD", "BIM标准", "协同设计"], preferred_skills: ["编程基础", "参数化设计", "项目管理"], education_required: "本科及以上", experience_required: "1-5年", freedom_score: 40, connection_score: 50, wealth_score: 55, peace_score: 50, growth_score: 60, stability_score: 55, competition_score: 35, related_trial_ids: [], is_active: true },
];

export async function getJobs(): Promise<Job[]> {
  const dbOk = await isDbAvailable();
  if (dbOk) {
    try {
      const { data, error } = await supabase
        .from("jobs")
        .select("*")
        .eq("is_active", true)
        .order("name");
      if (!error && data && data.length > 0) return data as Job[];
    } catch { /* fallback */ }
  }
  return LOCAL_JOBS;
}

export async function getJob(id: string): Promise<Job | null> {
  const dbOk = await isDbAvailable();
  if (dbOk) {
    try {
      const { data, error } = await supabase
        .from("jobs")
        .select("*")
        .eq("id", id)
        .single();
      if (!error && data) return data as Job;
    } catch { /* fallback */ }
  }
  return LOCAL_JOBS.find(j => j.id === id) || null;
}

export async function getJobsByIndustry(industryId: string): Promise<Job[]> {
  const dbOk = await isDbAvailable();
  if (dbOk) {
    try {
      const { data, error } = await supabase
        .from("jobs")
        .select("*")
        .eq("industry_id", industryId)
        .eq("is_active", true)
        .order("name");
      if (!error && data && data.length > 0) return data as Job[];
    } catch { /* fallback */ }
  }
  return LOCAL_JOBS.filter(j => j.industry_id === industryId);
}

// ============================================
// 城市数据
// ============================================

const LOCAL_CITIES: City[] = [
  { id: "shanghai", name: "上海", tier: 1, region: "华东", description: "中国最具国际化的商业中心，金融+科技+文创三栖", living_cost: "高", avg_rent: "3500-6000/月", vibe: "精致、高效、国际化", population: "2487万", is_active: true },
  { id: "beijing", name: "北京", tier: 1, region: "华北", description: "政治文化中心，互联网与AI的核心战场", living_cost: "高", avg_rent: "3000-5500/月", vibe: "厚重、学术、权力", population: "2189万", is_active: true },
  { id: "shenzhen", name: "深圳", tier: 1, region: "华南", description: "中国科技心脏，创业密度全国第一", living_cost: "中高", avg_rent: "2500-5000/月", vibe: "年轻、拼搏、创新", population: "1768万", is_active: true },
  { id: "guangzhou", name: "广州", tier: 1, region: "华南", description: "千年商都，电商和直播电商腹地", living_cost: "中", avg_rent: "2000-4000/月", vibe: "务实、烟火、包容", population: "1881万", is_active: true },
  { id: "hangzhou", name: "杭州", tier: 1, region: "华东", description: "电商之都+数字游民天堂", living_cost: "中高", avg_rent: "2500-4500/月", vibe: "诗意、创新、宜居", population: "1237万", is_active: true },
  { id: "chengdu", name: "成都", tier: 1, region: "西南", description: "新一线城市标杆，内容创业和生活方式的沃土", living_cost: "中", avg_rent: "1800-3500/月", vibe: "慢节奏、文艺、烟火", population: "2126万", is_active: true },
  { id: "suzhou", name: "苏州", tier: 2, region: "华东", description: "园林之城，外资和制造业重镇", living_cost: "中", avg_rent: "1800-3500/月", vibe: "精致、稳健、平衡", population: "1292万", is_active: true },
  { id: "nanjing", name: "南京", tier: 2, region: "华东", description: "六朝古都，高校密度全国前三", living_cost: "中", avg_rent: "1800-3000/月", vibe: "学术、历史、沉稳", population: "942万", is_active: true },
  { id: "xiamen", name: "厦门", tier: 2, region: "华东", description: "鹭岛小城，文艺与烟火并存", living_cost: "中", avg_rent: "2000-3500/月", vibe: "清新、文艺、宜居", population: "528万", is_active: true },
  { id: "qingdao", name: "青岛", tier: 2, region: "华东", description: "滨海城市，慢节奏中蕴藏产业活力", living_cost: "中", avg_rent: "1500-3000/月", vibe: "滨海、慢节奏、舒适", population: "1035万", is_active: true },
  { id: "changsha", name: "长沙", tier: 2, region: "华中", description: "网红城市，消费力旺盛的娱乐之都", living_cost: "中低", avg_rent: "1500-2800/月", vibe: "火热、娱乐、实惠", population: "1042万", is_active: true },
  { id: "chongqing", name: "重庆", tier: 1, region: "西南", description: "8D魔幻城市，网红经济与制造业并存", living_cost: "中低", avg_rent: "1500-3000/月", vibe: "魔幻、烟火、豪爽", population: "3212万", is_active: true },
  { id: "xian", name: "西安", tier: 2, region: "西北", description: "古都新貌，西北发展的核心引擎", living_cost: "中低", avg_rent: "1500-2800/月", vibe: "历史、厚重、崛起", population: "1300万", is_active: true },
  { id: "dali", name: "大理", tier: 4, region: "西南", description: "数字游民圣地，最接近乌托邦的地方", living_cost: "低", avg_rent: "800-2000/月", vibe: "自由、慢生活、灵性", population: "333万", is_active: true },
  { id: "hongkong", name: "中国香港", tier: 1, region: "华南", description: "全球金融中心，中西交汇的国际都市", living_cost: "极高", avg_rent: "8000-15000/月", vibe: "高效、国际、精英", population: "750万", is_active: true },
  { id: "anxi", name: "安溪", tier: 5, region: "华东", description: "铁观音故乡，茶文化千年传承之地", living_cost: "低", avg_rent: "500-1200/月", vibe: "传统、手艺、茶香", population: "100万", is_active: true },
  { id: "yiwu", name: "义乌", tier: 3, region: "华东", description: "全球小商品之都，跨境电商跳板", living_cost: "中低", avg_rent: "1200-2500/月", vibe: "商业、务实、全球化", population: "186万", is_active: true },
];

export async function getCities(): Promise<City[]> {
  const dbOk = await isDbAvailable();
  if (dbOk) {
    try {
      const { data, error } = await supabase
        .from("cities")
        .select("*")
        .eq("is_active", true)
        .order("tier");
      if (!error && data && data.length > 0) return data as City[];
    } catch { /* fallback */ }
  }
  return LOCAL_CITIES;
}

export async function getCity(id: string): Promise<City | null> {
  const all = await getCities();
  return all.find(c => c.id === id) || null;
}

// ============================================
// 薪资数据
// ============================================

interface SalaryByCity {
  city_id: string;
  city_name: string;
  entry_min: number | null;
  entry_max: number | null;
  mid_min: number | null;
  mid_max: number | null;
  senior_min: number | null;
  senior_max: number | null;
}

export async function getSalaryByJob(jobId: string): Promise<SalaryByCity[]> {
  const dbOk = await isDbAvailable();
  if (dbOk) {
    try {
      const { data, error } = await supabase
        .from("salary_data")
        .select("*, cities(name)")
        .eq("job_id", jobId);
      if (!error && data && data.length > 0) {
        // 按城市分组
        const cityMap = new Map<string, SalaryByCity>();
        for (const row of data as any[]) {
          const cityId = row.city_id;
          if (!cityMap.has(cityId)) {
            cityMap.set(cityId, {
              city_id: cityId,
              city_name: row.cities?.name || cityId,
              entry_min: null, entry_max: null,
              mid_min: null, mid_max: null,
              senior_min: null, senior_max: null,
            });
          }
          const entry = cityMap.get(cityId)!;
          if (row.experience_level === "entry" || row.experience_level === "junior") {
            entry.entry_min = row.min_salary;
            entry.entry_max = row.max_salary;
          } else if (row.experience_level === "mid") {
            entry.mid_min = row.min_salary;
            entry.mid_max = row.max_salary;
          } else if (row.experience_level === "senior" || row.experience_level === "lead") {
            entry.senior_min = row.min_salary;
            entry.senior_max = row.max_salary;
          }
        }
        return Array.from(cityMap.values());
      }
    } catch { /* fallback */ }
  }

  // Local fallback - use hardcoded salary data from JobPage
  const salaryMap: Record<string, { city: string; entry: string; mid: string; senior: string }[]> = {
    product_manager: [
      { city: "上海", entry: "8-15k", mid: "18-35k", senior: "30-55k" },
      { city: "北京", entry: "10-18k", mid: "20-38k", senior: "35-60k" },
      { city: "深圳", entry: "9-16k", mid: "18-32k", senior: "28-50k" },
      { city: "杭州", entry: "8-14k", mid: "15-28k", senior: "25-45k" },
    ],
    ai_engineer: [
      { city: "北京", entry: "20-35k", mid: "35-60k", senior: "50-80k" },
      { city: "深圳", entry: "22-38k", mid: "35-55k", senior: "50-75k" },
      { city: "上海", entry: "20-35k", mid: "32-55k", senior: "45-70k" },
    ],
  };

  const entries = salaryMap[jobId] || [];
  return entries.map(e => ({
    city_id: "",
    city_name: e.city,
    entry_min: parseK(e.entry), entry_max: parseKHigh(e.entry),
    mid_min: parseK(e.mid), mid_max: parseKHigh(e.mid),
    senior_min: parseK(e.senior), senior_max: parseKHigh(e.senior),
  }));
}

function parseK(s: string): number {
  const m = s.match(/(\d+)/);
  return m ? parseInt(m[1]) : 0;
}

function parseKHigh(s: string): number {
  const nums = s.match(/(\d+)/g);
  return nums && nums.length >= 2 ? parseInt(nums[1]) : (nums ? parseInt(nums[0]) : 0);
}

// ============================================
// 风险评估数据
// ============================================

const LOCAL_RISKS: RiskAssessment[] = [
  // ---------- 互联网 ----------
  { id: 1, job_id: "product_manager", risk_type: "AI替代", risk_level: "中", description: "AI可辅助需求分析和文档撰写，但产品决策仍需人类判断力", mitigation: "培养商业敏感度和跨领域洞察力", probability: 0.3, impact_score: 40 },
  { id: 2, job_id: "product_manager", risk_type: "行业周期", risk_level: "中", description: "互联网行业周期波动，裁员风险存在", mitigation: "建立复合技能矩阵，不绑定单一赛道", probability: 0.4, impact_score: 50 },
  { id: 3, job_id: "ai_engineer", risk_type: "行业周期", risk_level: "低", description: "AI人才需求持续旺盛，短期不会降温", mitigation: "持续学习前沿技术，保持竞争力", probability: 0.15, impact_score: 30 },
  { id: 4, job_id: "ai_engineer", risk_type: "健康风险", risk_level: "中", description: "长期高压研发可能影响身心健康", mitigation: "建立运动习惯，注意劳逸结合", probability: 0.5, impact_score: 55 },
  { id: 5, job_id: "software_engineer", risk_type: "AI替代", risk_level: "中", description: "AI辅助编程普及，初级CRUD工程师最危险", mitigation: "从写代码升级为设计系统", probability: 0.4, impact_score: 50 },
  { id: 6, job_id: "data_analyst", risk_type: "AI替代", risk_level: "中", description: "AI可自动生成基础报表和洞察，但复杂分析仍需人", mitigation: "向数据科学和业务洞察方向升级", probability: 0.4, impact_score: 45 },
  { id: 7, job_id: "frontend_engineer", risk_type: "AI替代", risk_level: "中", description: "AI生成前端页面的能力越来越强", mitigation: "深入交互体验和架构设计，避免只做切图", probability: 0.45, impact_score: 50 },
  { id: 8, job_id: "growth_hacker", risk_type: "行业周期", risk_level: "中", description: "增长预算受经济周期影响大", mitigation: "构建全链路增长能力，不依赖单一渠道", probability: 0.5, impact_score: 55 },
  // ---------- 创意 ----------
  { id: 9, job_id: "ux_designer", risk_type: "AI替代", risk_level: "高", description: "AI设计工具可替代大量基础设计执行工作", mitigation: "从执行者升级为创意策略者，强化个人风格", probability: 0.6, impact_score: 60 },
  { id: 10, job_id: "brand_designer", risk_type: "AI替代", risk_level: "中", description: "AI可快速生成品牌方案初稿", mitigation: "强化品牌策略思维和客户沟通能力", probability: 0.4, impact_score: 45 },
  { id: 11, job_id: "illustrator", risk_type: "AI替代", risk_level: "中", description: "AI绘画工具快速发展，但独特风格仍不可替代", mitigation: "建立强烈的个人风格IP", probability: 0.45, impact_score: 50 },
  { id: 12, job_id: "freelance_designer", risk_type: "收入不稳定", risk_level: "高", description: "项目制收入波动大，无社保保障", mitigation: "建立长期客户关系，储备3-6月应急金", probability: 0.7, impact_score: 65 },
  // ---------- 金融 ----------
  { id: 13, job_id: "ib_analyst", risk_type: "健康风险", risk_level: "高", description: "投行加班文化严重，工作生活极度不平衡", mitigation: "设定健康底线，考虑中长期转岗", probability: 0.7, impact_score: 70 },
  { id: 14, job_id: "ib_analyst", risk_type: "行业周期", risk_level: "中", description: "投行业务随资本市场周期波动", mitigation: "建立可迁移的财务建模和商业分析能力", probability: 0.4, impact_score: 50 },
  { id: 15, job_id: "quant_trader", risk_type: "行业周期", risk_level: "中", description: "量化策略收益受市场环境影响", mitigation: "持续研发新策略，分散策略类型", probability: 0.45, impact_score: 55 },
  { id: 16, job_id: "wealth_advisor", risk_type: "AI替代", risk_level: "低", description: "AI可辅助资产配置建议，但高净值客户更信赖人", mitigation: "深耕客户关系，提供AI无法替代的信任价值", probability: 0.2, impact_score: 25 },
  // ---------- 教育 ----------
  { id: 17, job_id: "teacher", risk_type: "AI替代", risk_level: "低", description: "AI可辅助教学，但教师的情感连接和榜样作用不可替代", mitigation: "强化教学创意和师生关系建设", probability: 0.15, impact_score: 20 },
  { id: 18, job_id: "corporate_trainer", risk_type: "行业周期", risk_level: "中", description: "企业培训预算受经济环境影响", mitigation: "建立个人品牌，拓展多渠道收入", probability: 0.4, impact_score: 45 },
  // ---------- 医疗 ----------
  { id: 19, job_id: "doctor", risk_type: "健康风险", risk_level: "中", description: "长期高压工作和夜班影响健康", mitigation: "注意劳逸结合，建立运动习惯", probability: 0.5, impact_score: 55 },
  { id: 20, job_id: "nurse", risk_type: "健康风险", risk_level: "中", description: "夜班和体力劳动对身体有慢性损伤", mitigation: "注意休息，加强锻炼", probability: 0.55, impact_score: 50 },
  { id: 21, job_id: "pharma_researcher", risk_type: "行业周期", risk_level: "中", description: "新药研发周期长，失败率高", mitigation: "提升跨领域研究能力，关注AI药物筛选", probability: 0.45, impact_score: 45 },
  // ---------- 电商 ----------
  { id: 22, job_id: "livestream_host", risk_type: "行业周期", risk_level: "高", description: "直播行业竞争激烈，流量获取成本持续上升", mitigation: "从流量思维转向品牌思维，建立私域", probability: 0.6, impact_score: 70 },
  { id: 23, job_id: "livestream_host", risk_type: "健康风险", risk_level: "中", description: "长期高强度直播影响嗓子和作息", mitigation: "注意嗓音保护，建立规律作息", probability: 0.5, impact_score: 45 },
  { id: 24, job_id: "ecommerce_operator", risk_type: "行业周期", risk_level: "中", description: "电商竞争白热化，平台规则变化快", mitigation: "掌握多平台运营能力，关注新兴渠道", probability: 0.45, impact_score: 50 },
  { id: 25, job_id: "crossborder_operator", risk_type: "政策风险", risk_level: "中", description: "跨境电商受国际贸易政策影响", mitigation: "多市场布局，关注政策变化", probability: 0.4, impact_score: 50 },
  // ---------- 影视 ----------
  { id: 26, job_id: "film_producer", risk_type: "行业周期", risk_level: "高", description: "影视行业周期性明显，项目制收入不稳定", mitigation: "储备现金流，拓展短剧等轻量级内容", probability: 0.65, impact_score: 60 },
  { id: 27, job_id: "kol_creator", risk_type: "AI替代", risk_level: "中", description: "AI内容工具让创作门槛降低，竞争加剧", mitigation: "强化个人IP的独特性和真实感", probability: 0.35, impact_score: 45 },
  { id: 28, job_id: "game_designer", risk_type: "行业周期", risk_level: "中", description: "游戏行业项目周期性强，裁员潮时有发生", mitigation: "培养独立游戏开发能力，建立个人项目", probability: 0.45, impact_score: 50 },
  // ---------- 酒店/文旅 ----------
  { id: 29, job_id: "homestay_owner", risk_type: "行业周期", risk_level: "高", description: "民宿行业受旅游淡旺季影响大，收入不稳定", mitigation: "发展民宿+模式，淡季做内容/活动", probability: 0.7, impact_score: 65 },
  { id: 30, job_id: "flight_attendant", risk_type: "健康风险", risk_level: "中", description: "长期飞行影响生物钟和身体健康", mitigation: "注意休息规律，加强锻炼", probability: 0.55, impact_score: 40 },
  // ---------- 法律 ----------
  { id: 31, job_id: "lawyer", risk_type: "AI替代", risk_level: "低", description: "法律分析可被AI辅助，但庭审和谈判不可替代", mitigation: "聚焦高价值的人情洞察和复杂案件", probability: 0.2, impact_score: 30 },
  { id: 32, job_id: "lawyer", risk_type: "行业周期", risk_level: "中", description: "经济下行期法律需求反而可能增加", mitigation: "建立多元化客户来源", probability: 0.3, impact_score: 35 },
  { id: 33, job_id: "compliance_officer", risk_type: "职业倦怠", risk_level: "中", description: "合规工作重复性高，容易产生倦怠感", mitigation: "关注新兴合规领域，保持学习新鲜感", probability: 0.4, impact_score: 35 },
  // ---------- 餐饮 ----------
  { id: 34, job_id: "restaurant_manager", risk_type: "行业周期", risk_level: "高", description: "餐饮行业竞争激烈，倒闭率高", mitigation: "打造差异化特色，控制成本", probability: 0.6, impact_score: 65 },
  { id: 35, job_id: "food_creator", risk_type: "收入不稳定", risk_level: "高", description: "内容创作者收入波动大，变现难度增加", mitigation: "建立多元变现渠道，维护品牌合作", probability: 0.65, impact_score: 60 },
  // ---------- 公共管理 ----------
  { id: 36, job_id: "civil_servant", risk_type: "职业倦怠", risk_level: "中", description: "体制内晋升空间有限，工作内容可能单调", mitigation: "积极参与创新项目，保持专业成长", probability: 0.5, impact_score: 40 },
  { id: 37, job_id: "police_officer", risk_type: "安全风险", risk_level: "中", description: "执法过程存在人身安全风险", mitigation: "严格执法规范，加强防护训练", probability: 0.3, impact_score: 65 },
  // ---------- 茶产业 ----------
  { id: 38, job_id: "tea_artisan", risk_type: "AI替代", risk_level: "低", description: "手工制茶工艺难以被AI完全替代", mitigation: "持续精进传统工艺，结合现代营销", probability: 0.1, impact_score: 15 },
  { id: 39, job_id: "tea_space_owner", risk_type: "收入不稳定", risk_level: "中", description: "茶空间客流受季节和天气影响", mitigation: "发展线上茶产品和会员制", probability: 0.5, impact_score: 45 },
  // ---------- 汽车 ----------
  { id: 40, job_id: "autonomous_drive_eng", risk_type: "技术迭代", risk_level: "中", description: "智能驾驶技术路线变化快，需持续学习", mitigation: "保持技术敏感度，关注行业前沿", probability: 0.4, impact_score: 45 },
  { id: 41, job_id: "battery_engineer", risk_type: "行业周期", risk_level: "低", description: "新能源行业长期看涨，短期波动可控", mitigation: "关注固态电池等下一代技术", probability: 0.2, impact_score: 30 },
  // ---------- 建筑 ----------
  { id: 42, job_id: "architect", risk_type: "行业周期", risk_level: "高", description: "建筑行业深度调整，项目减少", mitigation: "拓展城市更新和绿色建筑方向", probability: 0.6, impact_score: 60 },
  { id: 43, job_id: "interior_designer", risk_type: "AI替代", risk_level: "中", description: "AI设计工具可生成初步方案", mitigation: "强化客户沟通和落地实施能力", probability: 0.35, impact_score: 40 },
  { id: 44, job_id: "bim_engineer", risk_type: "技术迭代", risk_level: "低", description: "BIM技术日趋成熟，但数字化趋势明确", mitigation: "持续学习参数化和AI辅助设计", probability: 0.15, impact_score: 20 },
];

export async function getRisksByJob(jobId: string): Promise<RiskAssessment[]> {
  const dbOk = await isDbAvailable();
  if (dbOk) {
    try {
      const { data, error } = await supabase
        .from("risk_assessment")
        .select("*")
        .eq("job_id", jobId);
      if (!error && data && data.length > 0) return data as RiskAssessment[];
    } catch { /* fallback */ }
  }
  return LOCAL_RISKS.filter(r => r.job_id === jobId);
}

// ============================================
// 市场分析数据
// ============================================

const LOCAL_MARKET: MarketAnalysis[] = [
  // ---------- 互联网 ----------
  { id: 1, job_id: "product_manager", analysis_type: "demand", content: "产品经理岗位需求稳中有降，但对高级产品经理的需求反而增加", score: 65, data_date: "2026-05-01" },
  { id: 2, job_id: "product_manager", analysis_type: "trend", content: "AI产品化和出海是两大增长方向，传统互联网产品经理需转型", score: 70, data_date: "2026-05-01" },
  { id: 3, job_id: "ai_engineer", analysis_type: "demand", content: "AI工程师需求井喷，大模型相关岗位同比增长200%+", score: 95, data_date: "2026-05-01" },
  { id: 4, job_id: "ai_engineer", analysis_type: "trend", content: "从大模型训练转向应用落地，Agent架构工程师最稀缺", score: 90, data_date: "2026-05-01" },
  { id: 5, job_id: "software_engineer", analysis_type: "demand", content: "通用开发岗位趋于饱和，但AI工程化和系统架构方向仍有大量需求", score: 60, data_date: "2026-05-01" },
  { id: 6, job_id: "data_analyst", analysis_type: "demand", content: "数据分析师需求稳定增长，但门槛在提高——只会SQL已不够", score: 65, data_date: "2026-05-01" },
  { id: 7, job_id: "data_analyst", analysis_type: "trend", content: "AI让基础分析自动化，分析师需向数据科学家方向升级", score: 60, data_date: "2026-05-01" },
  { id: 8, job_id: "frontend_engineer", analysis_type: "demand", content: "前端岗位需求稳定，但全栈能力成为加分项", score: 65, data_date: "2026-05-01" },
  { id: 9, job_id: "growth_hacker", analysis_type: "trend", content: "增长从买量转向精细化运营，懂AI的增长人才最抢手", score: 70, data_date: "2026-05-01" },
  { id: 10, job_id: "sales_manager", analysis_type: "demand", content: "大客户销售永远是稀缺人才，但数字化正在改变销售方式", score: 70, data_date: "2026-05-01" },
  // ---------- 创意 ----------
  { id: 11, job_id: "ux_designer", analysis_type: "demand", content: "基础UI设计岗位减少，UX研究和体验策略方向需求上升", score: 55, data_date: "2026-05-01" },
  { id: 12, job_id: "brand_designer", analysis_type: "trend", content: "品牌设计从执行向策略转型，AI辅助设计成为标配", score: 60, data_date: "2026-05-01" },
  { id: 13, job_id: "illustrator", analysis_type: "demand", content: "有独特风格的插画师越来越值钱，AI只是廉价替代", score: 55, data_date: "2026-05-01" },
  { id: 14, job_id: "freelance_designer", analysis_type: "trend", content: "自由设计师市场持续扩大，但收入分化严重", score: 50, data_date: "2026-05-01" },
  // ---------- 金融 ----------
  { id: 15, job_id: "ib_analyst", analysis_type: "demand", content: "投行初级岗位需求下降，但中资企业出海带来新机会", score: 55, data_date: "2026-05-01" },
  { id: 16, job_id: "quant_trader", analysis_type: "demand", content: "量化岗位需求稳定，AI量化策略人才最稀缺", score: 75, data_date: "2026-05-01" },
  { id: 17, job_id: "fintech_pm", analysis_type: "trend", content: "金融科技从2C转向2B，企业级金融产品经理走俏", score: 75, data_date: "2026-05-01" },
  { id: 18, job_id: "wealth_advisor", analysis_type: "demand", content: "高净值人群增长，理财顾问需求稳定上升", score: 65, data_date: "2026-05-01" },
  // ---------- 教育 ----------
  { id: 19, job_id: "teacher", analysis_type: "demand", content: "教师岗位供给略大于需求，名校竞争依然激烈", score: 50, data_date: "2026-05-01" },
  { id: 20, job_id: "curriculum_designer", analysis_type: "trend", content: "AI+教育催生大量课程设计需求，人才供不应求", score: 75, data_date: "2026-05-01" },
  { id: 21, job_id: "corporate_trainer", analysis_type: "demand", content: "企业培训需求稳定，能讲AI工具应用的培训师最抢手", score: 60, data_date: "2026-05-01" },
  { id: 22, job_id: "edtech_specialist", analysis_type: "trend", content: "教育技术是蓝海，懂教育又懂技术的人才极度稀缺", score: 80, data_date: "2026-05-01" },
  // ---------- 医疗 ----------
  { id: 23, job_id: "doctor", analysis_type: "demand", content: "医生永远是刚需，尤其基层和全科医生缺口巨大", score: 85, data_date: "2026-05-01" },
  { id: 24, job_id: "pharma_researcher", analysis_type: "trend", content: "AI药物筛选大幅提速，药研人才需掌握AI工具", score: 75, data_date: "2026-05-01" },
  { id: 25, job_id: "health_manager", analysis_type: "demand", content: "健康产业快速增长，健康管理师需求稳步上升", score: 65, data_date: "2026-05-01" },
  // ---------- 电商 ----------
  { id: 26, job_id: "livestream_host", analysis_type: "demand", content: "直播主播供给远大于需求，但优质操盘手仍然稀缺", score: 50, data_date: "2026-05-01" },
  { id: 27, job_id: "ecommerce_operator", analysis_type: "demand", content: "电商运营需求仍然旺盛，尤其跨境和品牌化方向", score: 75, data_date: "2026-05-01" },
  { id: 28, job_id: "crossborder_operator", analysis_type: "trend", content: "跨境电商是结构性机会，TikTok Shop等新平台催生大量需求", score: 80, data_date: "2026-05-01" },
  { id: 29, job_id: "supply_chain_manager", analysis_type: "demand", content: "供应链管理人才长期紧缺，数字化人才最稀缺", score: 70, data_date: "2026-05-01" },
  // ---------- 影视 ----------
  { id: 30, job_id: "film_producer", analysis_type: "demand", content: "传统影视岗位萎缩，短剧和微短剧方向岗位暴增", score: 55, data_date: "2026-05-01" },
  { id: 31, job_id: "kol_creator", analysis_type: "demand", content: "内容创作者数量暴涨，但真正能持续变现的不到5%", score: 50, data_date: "2026-05-01" },
  { id: 32, job_id: "game_designer", analysis_type: "demand", content: "游戏行业需求稳定，独立游戏和小游戏方向机会增多", score: 65, data_date: "2026-05-01" },
  { id: 33, job_id: "director", analysis_type: "trend", content: "短剧和微短剧制作爆发，编导需求暴增", score: 75, data_date: "2026-05-01" },
  // ---------- 酒店/文旅 ----------
  { id: 34, job_id: "homestay_owner", analysis_type: "demand", content: "精品民宿仍有市场空间，但中低端民宿已严重过剩", score: 45, data_date: "2026-05-01" },
  { id: 35, job_id: "travel_planner", analysis_type: "trend", content: "定制旅行需求上升，小众目的地策划师走俏", score: 60, data_date: "2026-05-01" },
  { id: 36, job_id: "cultural_planner", analysis_type: "demand", content: "文旅融合加速，策划师需求稳步增长", score: 65, data_date: "2026-05-01" },
  // ---------- 法律 ----------
  { id: 37, job_id: "lawyer", analysis_type: "demand", content: "律师总需求稳定，但合规、数据隐私等新领域增速显著", score: 70, data_date: "2026-05-01" },
  { id: 38, job_id: "compliance_officer", analysis_type: "demand", content: "合规岗位需求爆发式增长，数据隐私合规人才最稀缺", score: 85, data_date: "2026-05-01" },
  { id: 39, job_id: "ip_lawyer", analysis_type: "trend", content: "AI和科技行业IP纠纷增多，知识产权律师需求上升", score: 75, data_date: "2026-05-01" },
  // ---------- 餐饮 ----------
  { id: 40, job_id: "restaurant_manager", analysis_type: "demand", content: "餐饮行业永远缺优秀店长，但岗位供给也充足", score: 55, data_date: "2026-05-01" },
  { id: 41, job_id: "food_rnd", analysis_type: "trend", content: "健康食品和功能食品是增长点，研发人才走俏", score: 65, data_date: "2026-05-01" },
  // ---------- 公共管理 ----------
  { id: 42, job_id: "civil_servant", analysis_type: "demand", content: "公务员岗位竞争持续激烈，报录比居高不下", score: 40, data_date: "2026-05-01" },
  { id: 43, job_id: "community_worker", analysis_type: "trend", content: "社区工作者职业化加速，薪酬体系逐步完善", score: 55, data_date: "2026-05-01" },
  // ---------- 茶产业 ----------
  { id: 44, job_id: "tea_artisan", analysis_type: "demand", content: "茶艺师需求稳定增长，年轻人对茶文化的兴趣正在回升", score: 60, data_date: "2026-05-01" },
  { id: 45, job_id: "tea_brand_manager", analysis_type: "trend", content: "新茶饮品牌持续涌现，茶品牌运营人才缺口大", score: 70, data_date: "2026-05-01" },
  // ---------- 汽车 ----------
  { id: 46, job_id: "autonomous_drive_eng", analysis_type: "demand", content: "智能驾驶人才极度稀缺，薪资水涨船高", score: 90, data_date: "2026-05-01" },
  { id: 47, job_id: "battery_engineer", analysis_type: "demand", content: "新能源电池研发人才供不应求，固态电池方向最热", score: 85, data_date: "2026-05-01" },
  { id: 48, job_id: "automotive_designer", analysis_type: "trend", content: "新能源车设计需求井喷，中国品牌全球扩张", score: 80, data_date: "2026-05-01" },
  // ---------- 建筑 ----------
  { id: 49, job_id: "architect", analysis_type: "demand", content: "传统建筑项目减少，城市更新和绿色建筑是增长点", score: 45, data_date: "2026-05-01" },
  { id: 50, job_id: "interior_designer", analysis_type: "demand", content: "室内设计师需求稳定，旧改和适老化改造带来新需求", score: 55, data_date: "2026-05-01" },
  { id: 51, job_id: "bim_engineer", analysis_type: "trend", content: "BIM成为建筑行业数字化标配，人才需求快速增长", score: 75, data_date: "2026-05-01" },
];

export async function getMarketAnalysis(jobId: string): Promise<MarketAnalysis[]> {
  const dbOk = await isDbAvailable();
  if (dbOk) {
    try {
      const { data, error } = await supabase
        .from("market_analysis")
        .select("*")
        .eq("job_id", jobId);
      if (!error && data && data.length > 0) return data as MarketAnalysis[];
    } catch { /* fallback */ }
  }
  return LOCAL_MARKET.filter(m => m.job_id === jobId);
}

// ============================================
// 生活方式分类（PRD：按生活方式探索）
// ============================================

export interface LifestyleCategory {
  id: string;
  name: string;
  emoji: string;
  desc: string;
  jobs: string[];     // job names (for display)
  industryIds: string[]; // industry ids (for linking)
}

export const LIFESTYLE_CATEGORIES: LifestyleCategory[] = [
  {
    id: "freedom",
    name: "自由自在",
    emoji: "🦋",
    desc: "不受打卡约束，掌控自己的时间",
    jobs: ["KOL/内容创作者", "民宿主理人", "茶艺师/制茶人", "独立设计师", "插画师", "美食内容创作者", "茶空间主理人"],
    industryIds: ["creative", "ecommerce", "tea", "hospitality", "media"],
  },
  {
    id: "ambition",
    name: "金戈铁马",
    emoji: "⚔️",
    desc: "追逐高薪和权力，在竞争中证明自己",
    jobs: ["AI算法工程师", "产品经理", "软件工程师", "大客户销售/BD", "投行分析师", "量化交易员", "智能驾驶工程师"],
    industryIds: ["internet", "finance", "automotive"],
  },
  {
    id: "connection",
    name: "人情世故",
    emoji: "🤝",
    desc: "善用关系和影响力，让事情发生",
    jobs: ["律师", "酒店管理", "影视制片人", "大客户销售/BD", "企业培训师", "旅行策划师", "理财顾问"],
    industryIds: ["legal", "hospitality", "media", "internet", "finance"],
  },
  {
    id: "peace",
    name: "岁月静好",
    emoji: "🧘",
    desc: "内心安宁，不被外界裹挟",
    jobs: ["茶艺师/制茶人", "公务员", "民宿主理人", "高中教师", "护理师", "茶空间主理人", "社区工作者"],
    industryIds: ["tea", "public", "hospitality", "education", "healthcare"],
  },
  {
    id: "creative",
    name: "创意无限",
    emoji: "✨",
    desc: "用想象力和审美创造价值",
    jobs: ["用户体验设计师", "平面/品牌设计师", "插画师", "文案策划", "游戏策划", "汽车设计师", "建筑设计师"],
    industryIds: ["creative", "media", "automotive", "realestate"],
  },
  {
    id: "healing",
    name: "济世利他",
    emoji: "🌿",
    desc: "守护生命，帮助他人，让世界更好",
    jobs: ["临床医生", "护理师", "健康管理师", "高中教师", "社区工作者", "警察/基层执法"],
    industryIds: ["healthcare", "education", "public"],
  },
];

// ============================================
// 用户档案（localStorage + Supabase 双写）
// ============================================

export interface LocalProfile {
  school: string;
  major: string;
  educationLevel: string;
  graduationYear: string;
  preferredCities: string[];
  minSalary: number;
  budget: string;
  freedomWeight: number;
  connectionWeight: number;
  wealthWeight: number;
  peaceWeight: number;
}

const PROFILE_KEY = "user_profile";

export function saveProfileLocal(profile: LocalProfile): void {
  localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
}

export function loadProfileLocal(): LocalProfile | null {
  const saved = localStorage.getItem(PROFILE_KEY);
  if (!saved) return null;
  try {
    return JSON.parse(saved);
  } catch {
    return null;
  }
}

// ============================================
// 岗位收藏（localStorage + Supabase 双写）
// ============================================

const FAVORITES_KEY = "job_favorites";

export interface LocalFavorite {
  jobId: string;
  addedAt: string;
  source: string;
}

export function saveFavoritesLocal(favorites: LocalFavorite[]): void {
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
}

export function loadFavoritesLocal(): LocalFavorite[] {
  const saved = localStorage.getItem(FAVORITES_KEY);
  if (!saved) return [];
  try {
    return JSON.parse(saved);
  } catch {
    return [];
  }
}

export function addFavoriteLocal(jobId: string, source = "explore"): LocalFavorite[] {
  const favorites = loadFavoritesLocal();
  if (!favorites.find(f => f.jobId === jobId)) {
    favorites.push({ jobId, addedAt: new Date().toISOString().slice(0, 10), source });
    saveFavoritesLocal(favorites);
  }
  return favorites;
}

export function removeFavoriteLocal(jobId: string): LocalFavorite[] {
  const favorites = loadFavoritesLocal().filter(f => f.jobId !== jobId);
  saveFavoritesLocal(favorites);
  return favorites;
}

export function isFavoritedLocal(jobId: string): boolean {
  return loadFavoritesLocal().some(f => f.jobId === jobId);
}
