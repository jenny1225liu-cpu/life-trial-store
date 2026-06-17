-- ============================================
-- 迁移 007: 扩充岗位数据
-- 往 jobs、salary_data、risk_assessment、market_analysis 表中插入 46 个新岗位
-- 涵盖 14 个行业，不新增行业，仅在各行业下新增岗位
-- ============================================

-- ============================================
-- 1. 岗位数据 (46 个新岗位)
-- ============================================
INSERT INTO jobs (id, industry_id, name, icon, description, responsibilities, required_skills, preferred_skills, education_required, experience_required, freedom_score, connection_score, wealth_score, peace_score, growth_score, stability_score, competition_score, related_trial_ids, is_active) VALUES

-- ---- internet (互联网/科技) +5 ----
('data_analyst', 'internet', '数据分析师', '📈', '从海量数据中提炼洞察，驱动业务决策',
  '{"数据清洗与建模", "业务指标体系搭建", "可视化报表与数据看板", "AB测试设计与分析"}',
  '{"SQL/Python", "统计学基础", "数据可视化"}',
  '{"业务理解力", "机器学习基础", "沟通表达"}',
  '本科及以上', '0-3年', 50, 55, 65, 50, 70, 60, 70, '{}', true),

('frontend_engineer', 'internet', '前端工程师', '🖥️', '用代码把设计变成可交互的界面',
  '{"页面开发与性能优化", "组件库搭建与维护", "跨端适配与兼容处理", "与设计师和后端协作"}',
  '{"HTML/CSS/JavaScript", "React/Vue框架", "工程化工具链"}',
  '{"设计审美", "Node.js", "WebGL/3D"}',
  '本科及以上', '0-3年', 55, 45, 70, 45, 80, 55, 75, '{}', true),

('devops_engineer', 'internet', '运维/DevOps工程师', '⚙️', '让系统稳定运行，让部署自动化',
  '{"CI/CD流水线搭建", "服务器监控与故障排查", "容器化与K8s管理", "基础设施即代码"}',
  '{"Linux", "Docker/K8s", "云平台(AWS/阿里云)"}',
  '{"编程能力(Python/Go)", "安全知识", "网络协议"}',
  '本科及以上', '1-5年', 40, 40, 75, 40, 75, 60, 60, '{}', true),

('growth_hacker', 'internet', '增长黑客', '🚀', '用数据和实验找到增长的突破口',
  '{"增长实验设计与执行", "用户漏斗分析与优化", "渠道ROI评估", "跨团队协作推动落地"}',
  '{"数据分析", "实验设计", "营销基础"}',
  '{"编程能力", "产品设计", "心理学"}',
  '本科及以上', '1-3年', 60, 60, 70, 40, 80, 40, 75, '{}', true),

('project_manager', 'internet', '项目经理', '📋', '让复杂项目按时按质交付',
  '{"项目计划与排期管理", "跨部门沟通协调", "风险识别与应对", "进度追踪与汇报"}',
  '{"项目管理方法(敏捷/瀑布)", "沟通协调", "文档能力"}',
  '{"技术背景", "数据分析", "PMP认证"}',
  '本科及以上', '1-5年', 45, 70, 60, 45, 55, 60, 55, '{}', true),

-- ---- creative (创意设计/文创) +4 ----
('brand_designer', 'creative', '平面/品牌设计师', '🎯', '用视觉语言构建品牌认知',
  '{"品牌视觉体系设计", "海报/画册等物料设计", "品牌规范制定与维护", "与客户沟通设计方案"}',
  '{"Photoshop/Illustrator", "版式设计", "色彩理论"}',
  '{"品牌策略", "动态设计", "AI设计工具"}',
  '本科及以上', '0-3年', 55, 50, 50, 55, 55, 45, 65, '{}', true),

('illustrator', 'creative', '插画师', '✏️', '用画笔构建独特的视觉叙事',
  '{"商业插画创作", "个人风格建立与迭代", "与编辑/设计师对接需求", "作品集维护与展示"}',
  '{"绘画功底", "Procreate/PS", "色彩与构图"}',
  '{"动画基础", "3D建模", "AI辅助创作"}',
  '本科及以上', '0-3年', 70, 40, 45, 65, 50, 35, 55, '{}', true),

('copywriter', 'creative', '文案策划', '✍️', '用文字打动人心，用故事塑造品牌',
  '{"品牌文案与slogan创作", "社交媒体内容策划", "创意brief撰写", "与设计/视频团队协作"}',
  '{"文字功底", "创意思维", "用户洞察"}',
  '{"数据分析", "视频脚本", "AI写作工具"}',
  '本科及以上', '0-3年', 65, 55, 45, 55, 55, 40, 60, '{}', true),

('freelance_designer', 'creative', '独立设计师', '🦄', '不隶属任何公司，用设计能力换取自由',
  '{"客户开发与项目谈判", "全流程设计交付", "个人品牌运营", "财务管理与税务"}',
  '{"设计全能(品牌/UI/插画)", "商务谈判", "自我管理"}',
  '{"财务知识", "法务知识", "营销能力"}',
  '不限', '1-5年', 90, 55, 55, 60, 50, 25, 50, '{}', true),

-- ---- finance (金融/投资) +5 ----
('ib_analyst', 'finance', '投行分析师', '💎', '在金融金字塔尖，用模型和分析撬动亿级交易',
  '{"财务建模与估值", "尽职调查", "招股书/交易文件撰写", "客户沟通与项目汇报"}',
  '{"财务分析", "Excel/PPT", "估值模型"}',
  '{"行业研究", "编程(Python/VBA)", "英语流利"}',
  '硕士及以上(目标院校)', '0-3年', 25, 75, 90, 20, 75, 55, 90, '{}', true),

('quant_trader', 'finance', '量化交易员', '📊', '用数学模型和算法在市场中猎取alpha',
  '{"量化策略研发与回测", "交易系统开发与优化", "实时风控与监控", "市场微观结构研究"}',
  '{"数学/统计", "Python/C++", "金融工程"}',
  '{"机器学习", "高频交易系统", "市场直觉"}',
  '硕士及以上(理工科)', '0-5年', 35, 45, 85, 30, 70, 50, 85, '{}', true),

('risk_analyst', 'finance', '风控分析师', '🛡️', '在金融风险的暗流中，做那个亮灯的人',
  '{"风险模型构建与验证", "监管合规审查", "风险报告撰写", "业务条线风险评估"}',
  '{"统计学", "风险模型", "SQL/Python"}',
  '{"金融法规", "机器学习", "行业知识"}',
  '本科及以上', '1-3年', 40, 55, 65, 50, 60, 70, 55, '{}', true),

('fintech_pm', 'finance', '金融产品经理', '💳', '用产品思维重塑传统金融服务',
  '{"金融产品规划与设计", "用户需求调研与验证", "合规与风控需求落地", "跨部门协作推进"}',
  '{"金融知识", "产品设计", "数据分析"}',
  '{"技术理解力", "运营经验", "法律合规"}',
  '本科及以上', '1-5年', 50, 60, 75, 40, 75, 55, 70, '{}', true),

('wealth_advisor', 'finance', '理财顾问', '💰', '帮助客户实现财富的保值与增值',
  '{"客户资产配置方案设计", "理财产品推荐与销售", "客户关系维护与拓展", "市场动态跟踪与分享"}',
  '{"金融产品知识", "沟通表达", "客户服务"}',
  '{"资产配置理论", "法律税务", "心理学"}',
  '本科及以上', '1-5年', 45, 80, 70, 45, 55, 55, 65, '{}', true),

-- ---- education (教育/培训) +4 ----
('teacher', 'education', '高中教师', '📖', '传道授业解惑，影响下一代的成长',
  '{"课程教学与备课", "学生评估与反馈", "班级管理与家校沟通", "教研活动参与"}',
  '{"学科知识", "教学能力", "沟通表达"}',
  '{"心理辅导", "教育技术", "课程开发"}',
  '本科及以上(教师资格证)', '0-3年', 35, 60, 40, 60, 40, 80, 50, '{}', true),

('curriculum_designer', 'education', '课程设计师', '🧩', '把知识体系拆解成可习得的学习路径',
  '{"课程框架与大纲设计", "学习内容与活动编排", "教学效果评估与迭代", "与讲师协作优化内容"}',
  '{"教学设计理论", "内容编排", "用户研究"}',
  '{"在线教育平台", "数据分析", "AI辅助教学"}',
  '本科及以上', '1-3年', 60, 45, 50, 55, 65, 55, 45, '{}', true),

('corporate_trainer', 'education', '企业培训师', '🎤', '帮助组织和个人提升能力与认知',
  '{"培训需求调研", "课程开发与设计", "现场培训交付", "培训效果评估与跟踪"}',
  '{"演讲表达", "课程设计", "需求分析"}',
  '{"行业专精", "教练技术", "在线教学工具"}',
  '本科及以上', '2-5年', 55, 85, 55, 55, 50, 55, 45, '{}', true),

('edtech_specialist', 'education', '教育技术专家', '🎓', '用技术重塑教育的交付方式',
  '{"教育产品技术方案设计", "AI教学工具开发与评估", "在线学习平台运维", "教学数据分析与洞察"}',
  '{"教育理论", "技术能力", "数据分析"}',
  '{"AI/ML知识", "产品设计", "项目管理"}',
  '硕士及以上', '1-5年', 50, 50, 65, 50, 80, 55, 55, '{}', true),

-- ---- healthcare (医疗/健康) +4 ----
('doctor', 'healthcare', '临床医生', '🩺', '在生死之间，用专业和判断力守护生命',
  '{"患者诊断与治疗方案制定", "临床操作与手术", "病历书写与医学研究", "医患沟通与团队协作"}',
  '{"医学知识", "临床技能", "判断力"}',
  '{"科研能力", "管理能力", "心理素质"}',
  '硕士及以上(执业医师证)', '3-8年', 25, 65, 70, 35, 50, 75, 60, '{}', true),

('pharma_researcher', 'healthcare', '药物研发员', '💊', '在实验室里寻找治愈疾病的钥匙',
  '{"药物分子设计与筛选", "临床试验方案设计", "药效与安全性评估", "研发文档撰写与申报"}',
  '{"药理学/化学", "实验技能", "数据分析"}',
  '{"AI药物设计", "项目管理", "法规知识"}',
  '硕士及以上', '1-5年', 40, 40, 65, 55, 65, 65, 55, '{}', true),

('nurse', 'healthcare', '护理师', '❤️', '用专业和温暖守护患者的每一天',
  '{"患者日常护理与监测", "医嘱执行与配药", "患者及家属沟通", "紧急情况处理"}',
  '{"护理专业", "细心耐心", "沟通能力"}',
  '{"心理辅导", "专科护理", "管理能力"}',
  '大专及以上(护士执业证)', '0-3年', 25, 70, 35, 45, 35, 70, 45, '{}', true),

('health_manager', 'healthcare', '健康管理师', '🏃', '帮助人们建立科学的健康生活方式',
  '{"健康风险评估与档案建立", "个性化健康方案制定", "健康知识科普与讲座", "客户跟踪与效果评估"}',
  '{"健康管理学", "营养学", "沟通能力"}',
  '{"心理学", "运动科学", "数据分析"}',
  '本科及以上', '1-3年', 55, 65, 40, 60, 55, 55, 35, '{}', true),

-- ---- ecommerce (电商/新零售) +3 ----
('crossborder_operator', 'ecommerce', '跨境电商运营', '🌏', '把中国好货卖到全世界',
  '{"海外市场调研与选品", "跨境平台店铺运营", "国际物流与清关管理", "本地化营销与推广"}',
  '{"英语/小语种", "电商平台运营", "数据分析"}',
  '{"国际物流", "海外社媒", "供应链管理"}',
  '本科及以上', '1-3年', 50, 50, 65, 40, 75, 45, 60, '{}', true),

('supply_chain_manager', 'ecommerce', '供应链经理', '🔗', '从原料到消费者，掌控全链条效率',
  '{"供应链规划与优化", "供应商管理", "库存与成本控制", "跨部门协调与项目推进"}',
  '{"供应链管理", "数据分析", "谈判能力"}',
  '{"ERP系统", "国际物流", "项目管理"}',
  '本科及以上', '2-5年', 40, 65, 70, 45, 60, 60, 50, '{}', true),

('brand_strategist', 'ecommerce', '品牌策划师', '✨', '让一个品牌从0到1，从1到N',
  '{"品牌定位与策略制定", "品牌视觉与内容体系搭建", "营销战役策划与执行", "品牌资产监测与优化"}',
  '{"品牌理论", "创意策划", "消费者洞察"}',
  '{"数据分析", "媒介策略", "视觉审美"}',
  '本科及以上', '1-5年', 55, 60, 60, 45, 65, 40, 65, '{}', true),

-- ---- media (影视/文娱) +3 ----
('director', 'media', '导演/编导', '🎥', '用镜头语言讲述打动人心的故事',
  '{"剧本创作与改编", "拍摄现场调度", "后期创作指导", "项目预算与进度管控"}',
  '{"视听语言", "叙事能力", "团队管理"}',
  '{"剪辑技术", "特效知识", "市场洞察"}',
  '本科及以上', '2-5年', 50, 70, 55, 40, 55, 35, 70, '{}', true),

('video_editor', 'media', '剪辑师', '✂️', '在时间线上用剪裁重塑叙事节奏',
  '{"素材整理与粗剪", "精剪与节奏把控", "特效与调色", "音画同步与混音"}',
  '{"Premiere/FCP/DaVinci", "视听语言", "节奏感"}',
  '{"特效合成", "调色", "AI剪辑工具"}',
  '大专及以上', '0-3年', 65, 45, 45, 50, 55, 40, 55, '{}', true),

('game_designer', 'media', '游戏策划', '🎮', '构建虚拟世界的规则与乐趣',
  '{"游戏系统与玩法设计", "关卡与数值设计", "剧情与世界观构建", "与程序/美术协作落地"}',
  '{"游戏设计理论", "数值建模", "玩家心理"}',
  '{"编程基础", "项目管理", "数据分析"}',
  '本科及以上', '0-3年', 50, 55, 70, 40, 75, 50, 75, '{}', true),

-- ---- hospitality (酒店/文旅) +2 ----
('travel_planner', 'hospitality', '旅行策划师', '🗺️', '为旅行者定制独一无二的行程体验',
  '{"客户需求深度沟通", "行程方案设计与报价", "在地资源对接与预订", "行中行后服务与反馈"}',
  '{"旅行知识", "沟通能力", "资源整合"}',
  '{"小语种", "摄影技能", "内容营销"}',
  '本科及以上', '1-3年', 70, 65, 45, 65, 50, 40, 40, '{}', true),

('cultural_planner', 'hospitality', '文旅策划师', '🏛️', '把在地文化变成可消费的体验产品',
  '{"在地文化调研与挖掘", "文旅产品方案设计", "政府/企业项目对接", "活动落地执行与复盘"}',
  '{"文化研究", "策划能力", "项目管理"}',
  '{"视觉设计", "新媒体运营", "政府关系"}',
  '本科及以上', '2-5年', 55, 70, 50, 55, 55, 45, 45, '{}', true),

-- ---- legal (法律/合规) +3 ----
('corporate_counsel', 'legal', '企业法务', '📜', '在商业与法律的交汇处保驾护航',
  '{"合同审查与起草", "法律风险评估与预警", "诉讼与仲裁管理", "内部法律培训"}',
  '{"法律分析", "合同审查", "商业思维"}',
  '{"行业专精", "英语能力", "谈判技巧"}',
  '本科及以上(法律职业资格)', '1-5年', 40, 65, 70, 50, 55, 70, 55, '{}', true),

('compliance_officer', 'legal', '合规官', '🔒', '确保企业在规则之内安全运行',
  '{"合规体系搭建与维护", "监管政策解读与应对", "合规审查与风险评估", "合规培训与文化建设"}',
  '{"法律知识", "风险管理", "合规体系"}',
  '{"行业专精", "数据分析", "英语能力"}',
  '本科及以上', '2-5年', 35, 60, 65, 55, 60, 70, 45, '{}', true),

('ip_lawyer', 'legal', '知识产权律师', '©️', '守护创新者的无形资产',
  '{"知识产权申请与布局", "侵权调查与诉讼", "知识产权交易与许可", "企业知产战略咨询"}',
  '{"知识产权法", "逻辑推理", "文书写作"}',
  '{"技术背景", "英语流利", "谈判技巧"}',
  '本科及以上(法律职业资格)', '1-5年', 40, 60, 75, 45, 65, 60, 60, '{}', true),

-- ---- food (餐饮/食品) +3 ----
('restaurant_manager', 'food', '餐厅经理', '🍽️', '运营一家有灵魂的餐厅',
  '{"门店日常运营管理", "人员招聘与培训", "成本控制与采购管理", "客户体验优化"}',
  '{"餐饮运营", "团队管理", "成本控制"}',
  '{"营销推广", "供应链管理", "数据分析"}',
  '大专及以上', '1-5年', 40, 70, 45, 45, 45, 50, 55, '{}', true),

('food_rnd', 'food', '食品研发员', '🧪', '在实验室里发明下一个爆款食品',
  '{"新产品配方研发", "感官评测与口味测试", "生产工艺对接与优化", "竞品分析与市场调研"}',
  '{"食品科学", "实验设计", "感官评价"}',
  '{"消费者洞察", "项目管理", "数据分析"}',
  '本科及以上', '1-3年', 50, 40, 50, 55, 55, 60, 40, '{}', true),

('food_creator', 'food', '美食内容创作者', '📱', '用镜头和文字让食物变成内容',
  '{"美食内容策划与拍摄", "食谱开发与呈现", "品牌合作与商业变现", "粉丝运营与社群维护"}',
  '{"摄影/视频", "美食知识", "内容策划"}',
  '{"剪辑技能", "品牌合作", "直播能力"}',
  '不限', '0-2年', 75, 55, 50, 55, 55, 25, 65, '{}', true),

-- ---- public (公共管理/基层治理) +2 ----
('civil_servant', 'public', '公务员', '🏢', '在体制内服务公众，推动社会运转',
  '{"政策执行与落实", "公文撰写与处理", "群众工作与矛盾调解", "项目推进与协调"}',
  '{"行测/申论", "政策理解", "公文写作"}',
  '{"数据分析", "项目管理", "沟通协调"}',
  '本科及以上(公务员考试)', '0-3年', 20, 55, 40, 60, 30, 90, 65, '{}', true),

('community_worker', 'public', '社区工作者', '🏘️', '在社区一线，连接政策与居民',
  '{"社区事务管理与协调", "居民需求收集与反馈", "社区活动策划与执行", "政策宣传与落实"}',
  '{"沟通能力", "群众工作", "活动组织"}',
  '{"心理辅导", "数据分析", "新媒体运营"}',
  '大专及以上', '0-2年', 35, 75, 30, 55, 30, 75, 40, '{}', true),

-- ---- tea (茶产业/非遗) +2 ----
('tea_brand_manager', 'tea', '茶品牌运营', '🏷️', '让传统茶文化以新姿态走向市场',
  '{"品牌定位与策略规划", "产品线规划与包装设计", "线上线下渠道运营", "内容营销与IP打造"}',
  '{"品牌运营", "茶文化知识", "数据分析"}',
  '{"设计审美", "直播运营", "供应链管理"}',
  '本科及以上', '1-5年', 55, 55, 45, 55, 50, 50, 40, '{}', true),

('tea_space_owner', 'tea', '茶空间主理人', '🍃', '经营一间有灵魂的茶空间',
  '{"空间设计与氛围营造", "茶品选购与菜单设计", "客人接待与茶会策划", "日常运营与财务管理"}',
  '{"茶文化知识", "审美能力", "服务意识"}',
  '{"空间设计", "内容营销", "财务管理"}',
  '不限', '1-5年', 85, 55, 35, 75, 35, 40, 30, '{}', true),

-- ---- automotive (汽车/新能源) +3 ----
('autonomous_drive_eng', 'automotive', '智能驾驶工程师', '🤖', '让汽车拥有自主驾驶的大脑',
  '{"感知算法研发与优化", "规控算法设计与验证", "仿真测试与实车调试", "技术文档与专利撰写"}',
  '{"C++/Python", "深度学习", "控制理论"}',
  '{"ROS/中间件", "嵌入式开发", "汽车工程"}',
  '硕士及以上', '0-5年', 35, 40, 85, 35, 90, 60, 85, '{}', true),

('battery_engineer', 'automotive', '新能源电池工程师', '🔋', '研发下一代动力电池',
  '{"电池材料研发与测试", "电芯设计与性能优化", "电池安全评估与验证", "生产工艺对接与改进"}',
  '{"电化学", "材料科学", "实验设计"}',
  '{"仿真建模", "项目管理", "数据分析"}',
  '硕士及以上', '1-5年', 35, 40, 75, 45, 80, 65, 60, '{}', true),

('automotive_designer', 'automotive', '汽车设计师', '🚙', '用线条和曲面定义未来出行',
  '{"外观造型设计与建模", "内饰设计与CMF方案", "设计评审与方案迭代", "工程可行性对接"}',
  '{"Alias/Blender", "手绘能力", "汽车美学"}',
  '{"工程知识", "VR展示", "品牌策略"}',
  '本科及以上', '1-5年', 55, 50, 65, 50, 65, 50, 65, '{}', true),

-- ---- realestate (房产/建筑) +3 ----
('architect', 'realestate', '建筑设计师', '🏗️', '用空间和结构表达对生活的理解',
  '{"建筑方案设计", "施工图绘制与审核", "与甲方/施工方协调", "项目全程把控"}',
  '{"建筑学", "CAD/BIM", "空间思维"}',
  '{"参数化设计", "绿色建筑", "项目管理"}',
  '本科及以上', '1-5年', 50, 55, 60, 50, 50, 55, 55, '{}', true),

('interior_designer', 'realestate', '室内设计师', '🏠', '把毛坯房变成有温度的家',
  '{"空间规划与方案设计", "材料选择与预算控制", "施工跟进与质量把控", "软装搭配与效果落地"}',
  '{"室内设计", "CAD/SketchUp", "材料知识"}',
  '{"软装搭配", "项目管理", "客户沟通"}',
  '大专及以上', '0-3年', 55, 60, 50, 55, 50, 45, 50, '{}', true),

('bim_engineer', 'realestate', 'BIM工程师', '💻', '用数字化模型重塑建筑设计流程',
  '{"BIM模型创建与维护", "碰撞检测与问题协调", "工程量统计与出图", "BIM标准与流程制定"}',
  '{"Revit/ArchiCAD", "建筑知识", "协调能力"}',
  '{"编程能力", "项目管理", "绿色建筑"}',
  '本科及以上', '1-5年', 45, 50, 60, 50, 65, 60, 40, '{}', true)

ON CONFLICT (id) DO UPDATE SET
  industry_id = EXCLUDED.industry_id, name = EXCLUDED.name, icon = EXCLUDED.icon,
  description = EXCLUDED.description, responsibilities = EXCLUDED.responsibilities,
  required_skills = EXCLUDED.required_skills, preferred_skills = EXCLUDED.preferred_skills,
  education_required = EXCLUDED.education_required, experience_required = EXCLUDED.experience_required,
  freedom_score = EXCLUDED.freedom_score, connection_score = EXCLUDED.connection_score,
  wealth_score = EXCLUDED.wealth_score, peace_score = EXCLUDED.peace_score,
  growth_score = EXCLUDED.growth_score, stability_score = EXCLUDED.stability_score,
  competition_score = EXCLUDED.competition_score, related_trial_ids = EXCLUDED.related_trial_ids,
  is_active = EXCLUDED.is_active;


-- ============================================
-- 2. 薪资数据 (每个岗位 3-5 条)
-- ============================================
INSERT INTO salary_data (job_id, city_id, experience_level, min_salary, max_salary, median_salary, bonus_months, stock_likelihood) VALUES

-- data_analyst 数据分析师
('data_analyst', 'shanghai', 'entry', 8, 15, 11, 1.5, 0.05),
('data_analyst', 'shanghai', 'mid', 15, 28, 20, 2.0, 0.15),
('data_analyst', 'beijing', 'entry', 9, 16, 12, 1.5, 0.08),
('data_analyst', 'shenzhen', 'entry', 8, 14, 10, 1.5, 0.1),
('data_analyst', 'hangzhou', 'entry', 7, 13, 9, 1.5, 0.08),

-- frontend_engineer 前端工程师
('frontend_engineer', 'shanghai', 'entry', 10, 18, 13, 1.5, 0.1),
('frontend_engineer', 'shanghai', 'mid', 20, 38, 28, 2.0, 0.25),
('frontend_engineer', 'beijing', 'entry', 12, 20, 15, 1.5, 0.12),
('frontend_engineer', 'shenzhen', 'entry', 11, 19, 14, 1.5, 0.15),
('frontend_engineer', 'hangzhou', 'mid', 18, 35, 25, 2.0, 0.2),

-- devops_engineer 运维/DevOps工程师
('devops_engineer', 'shanghai', 'mid', 22, 40, 30, 2.0, 0.2),
('devops_engineer', 'shanghai', 'senior', 35, 60, 45, 3.0, 0.4),
('devops_engineer', 'beijing', 'mid', 25, 45, 32, 2.0, 0.25),
('devops_engineer', 'shenzhen', 'mid', 20, 38, 28, 2.0, 0.2),

-- growth_hacker 增长黑客
('growth_hacker', 'shanghai', 'entry', 10, 18, 13, 1.5, 0.1),
('growth_hacker', 'shanghai', 'mid', 18, 35, 25, 2.0, 0.25),
('growth_hacker', 'beijing', 'entry', 10, 20, 14, 1.5, 0.12),
('growth_hacker', 'shenzhen', 'entry', 9, 17, 12, 1.5, 0.1),

-- project_manager 项目经理
('project_manager', 'shanghai', 'mid', 18, 30, 22, 2.0, 0.1),
('project_manager', 'shanghai', 'senior', 25, 45, 33, 2.5, 0.2),
('project_manager', 'beijing', 'mid', 20, 35, 25, 2.0, 0.12),
('project_manager', 'shenzhen', 'mid', 16, 28, 20, 2.0, 0.1),

-- brand_designer 平面/品牌设计师
('brand_designer', 'shanghai', 'entry', 6, 12, 8, 1.0, 0.0),
('brand_designer', 'shanghai', 'mid', 12, 22, 16, 1.5, 0.0),
('brand_designer', 'beijing', 'entry', 6, 11, 8, 1.0, 0.0),
('brand_designer', 'hangzhou', 'entry', 5, 10, 7, 1.0, 0.0),

-- illustrator 插画师
('illustrator', 'shanghai', 'entry', 5, 12, 8, 0.5, 0.0),
('illustrator', 'shanghai', 'mid', 10, 25, 15, 1.0, 0.0),
('illustrator', 'beijing', 'entry', 5, 11, 7, 0.5, 0.0),
('illustrator', 'chengdu', 'entry', 4, 9, 6, 0.5, 0.0),

-- copywriter 文案策划
('copywriter', 'shanghai', 'entry', 6, 12, 8, 1.0, 0.0),
('copywriter', 'shanghai', 'mid', 12, 22, 16, 1.5, 0.0),
('copywriter', 'beijing', 'entry', 7, 13, 9, 1.0, 0.0),
('copywriter', 'guangzhou', 'entry', 5, 10, 7, 1.0, 0.0),

-- freelance_designer 独立设计师
('freelance_designer', 'shanghai', 'mid', 8, 25, 15, 0.0, 0.0),
('freelance_designer', 'beijing', 'mid', 8, 22, 14, 0.0, 0.0),
('freelance_designer', 'hangzhou', 'mid', 6, 20, 12, 0.0, 0.0),
('freelance_designer', 'chengdu', 'mid', 5, 18, 10, 0.0, 0.0),

-- ib_analyst 投行分析师
('ib_analyst', 'shanghai', 'entry', 15, 25, 18, 4.0, 0.1),
('ib_analyst', 'shanghai', 'mid', 25, 50, 35, 6.0, 0.2),
('ib_analyst', 'shanghai', 'senior', 40, 80, 55, 8.0, 0.4),
('ib_analyst', 'beijing', 'entry', 15, 28, 20, 4.0, 0.12),
('ib_analyst', 'hongkong', 'entry', 25, 40, 30, 6.0, 0.15),

-- quant_trader 量化交易员
('quant_trader', 'shanghai', 'entry', 20, 40, 28, 3.0, 0.2),
('quant_trader', 'shanghai', 'mid', 35, 70, 50, 5.0, 0.35),
('quant_trader', 'shanghai', 'senior', 50, 100, 70, 6.0, 0.5),
('quant_trader', 'beijing', 'entry', 18, 38, 25, 3.0, 0.18),
('quant_trader', 'shenzhen', 'entry', 15, 35, 22, 3.0, 0.15),

-- risk_analyst 风控分析师
('risk_analyst', 'shanghai', 'entry', 10, 18, 13, 2.0, 0.05),
('risk_analyst', 'shanghai', 'mid', 18, 35, 25, 2.5, 0.1),
('risk_analyst', 'beijing', 'entry', 10, 17, 12, 2.0, 0.05),
('risk_analyst', 'shenzhen', 'mid', 16, 30, 22, 2.5, 0.08),

-- fintech_pm 金融产品经理
('fintech_pm', 'shanghai', 'entry', 12, 22, 16, 2.0, 0.15),
('fintech_pm', 'shanghai', 'mid', 22, 40, 30, 2.5, 0.3),
('fintech_pm', 'beijing', 'entry', 12, 20, 15, 2.0, 0.12),
('fintech_pm', 'shenzhen', 'mid', 20, 38, 28, 2.5, 0.25),

-- wealth_advisor 理财顾问
('wealth_advisor', 'shanghai', 'entry', 8, 15, 10, 2.0, 0.0),
('wealth_advisor', 'shanghai', 'mid', 15, 30, 20, 3.0, 0.0),
('wealth_advisor', 'beijing', 'entry', 8, 14, 10, 2.0, 0.0),
('wealth_advisor', 'guangzhou', 'mid', 12, 25, 17, 2.5, 0.0),

-- teacher 高中教师
('teacher', 'beijing', 'entry', 6, 10, 8, 2.0, 0.0),
('teacher', 'shanghai', 'entry', 7, 12, 9, 2.0, 0.0),
('teacher', 'chengdu', 'entry', 5, 8, 6, 2.0, 0.0),
('teacher', 'chengdu', 'mid', 7, 12, 9, 2.5, 0.0),

-- curriculum_designer 课程设计师
('curriculum_designer', 'beijing', 'entry', 8, 15, 10, 1.5, 0.05),
('curriculum_designer', 'beijing', 'mid', 14, 25, 18, 2.0, 0.1),
('curriculum_designer', 'shanghai', 'entry', 8, 14, 10, 1.5, 0.05),
('curriculum_designer', 'shenzhen', 'mid', 12, 22, 16, 2.0, 0.08),

-- corporate_trainer 企业培训师
('corporate_trainer', 'shanghai', 'mid', 12, 25, 17, 1.5, 0.0),
('corporate_trainer', 'shanghai', 'senior', 20, 40, 28, 2.0, 0.0),
('corporate_trainer', 'beijing', 'mid', 12, 22, 16, 1.5, 0.0),
('corporate_trainer', 'guangzhou', 'mid', 10, 20, 14, 1.5, 0.0),

-- edtech_specialist 教育技术专家
('edtech_specialist', 'beijing', 'entry', 10, 18, 13, 1.5, 0.1),
('edtech_specialist', 'beijing', 'mid', 18, 30, 22, 2.0, 0.2),
('edtech_specialist', 'shanghai', 'mid', 16, 28, 20, 2.0, 0.15),
('edtech_specialist', 'shenzhen', 'mid', 15, 25, 18, 2.0, 0.12),

-- doctor 临床医生
('doctor', 'shanghai', 'entry', 8, 15, 10, 2.0, 0.0),
('doctor', 'shanghai', 'mid', 15, 30, 20, 2.5, 0.0),
('doctor', 'shanghai', 'senior', 25, 60, 38, 3.0, 0.0),
('doctor', 'beijing', 'entry', 8, 14, 10, 2.0, 0.0),
('doctor', 'chengdu', 'mid', 10, 22, 14, 2.0, 0.0),

-- pharma_researcher 药物研发员
('pharma_researcher', 'shanghai', 'entry', 10, 18, 13, 2.0, 0.05),
('pharma_researcher', 'shanghai', 'mid', 18, 35, 25, 2.5, 0.1),
('pharma_researcher', 'beijing', 'entry', 9, 16, 12, 2.0, 0.05),
('pharma_researcher', 'suzhou', 'mid', 15, 30, 20, 2.5, 0.08),

-- nurse 护理师
('nurse', 'shanghai', 'entry', 5, 9, 7, 1.5, 0.0),
('nurse', 'beijing', 'entry', 5, 8, 6, 1.5, 0.0),
('nurse', 'guangzhou', 'mid', 7, 12, 9, 2.0, 0.0),
('nurse', 'chengdu', 'entry', 4, 7, 5, 1.5, 0.0),

-- health_manager 健康管理师
('health_manager', 'shanghai', 'entry', 6, 12, 8, 1.0, 0.0),
('health_manager', 'beijing', 'mid', 10, 20, 14, 1.5, 0.0),
('health_manager', 'shenzhen', 'entry', 6, 11, 8, 1.0, 0.0),
('health_manager', 'chengdu', 'entry', 5, 9, 6, 1.0, 0.0),

-- crossborder_operator 跨境电商运营
('crossborder_operator', 'shenzhen', 'entry', 7, 14, 10, 1.0, 0.08),
('crossborder_operator', 'shenzhen', 'mid', 14, 28, 20, 1.5, 0.15),
('crossborder_operator', 'guangzhou', 'entry', 6, 12, 8, 1.0, 0.06),
('crossborder_operator', 'hangzhou', 'mid', 12, 25, 17, 1.5, 0.12),

-- supply_chain_manager 供应链经理
('supply_chain_manager', 'shanghai', 'mid', 18, 35, 25, 2.0, 0.05),
('supply_chain_manager', 'shanghai', 'senior', 28, 55, 38, 3.0, 0.1),
('supply_chain_manager', 'shenzhen', 'mid', 16, 30, 22, 2.0, 0.05),
('supply_chain_manager', 'guangzhou', 'mid', 15, 28, 20, 2.0, 0.05),

-- brand_strategist 品牌策划师
('brand_strategist', 'shanghai', 'entry', 8, 15, 11, 1.0, 0.0),
('brand_strategist', 'shanghai', 'mid', 15, 30, 22, 1.5, 0.0),
('brand_strategist', 'beijing', 'mid', 14, 28, 20, 1.5, 0.0),
('brand_strategist', 'hangzhou', 'entry', 7, 13, 9, 1.0, 0.0),

-- director 导演/编导
('director', 'beijing', 'entry', 6, 12, 8, 0.5, 0.0),
('director', 'beijing', 'mid', 15, 30, 20, 1.0, 0.05),
('director', 'shanghai', 'mid', 12, 25, 17, 1.0, 0.05),
('director', 'shanghai', 'senior', 25, 50, 35, 1.5, 0.1),

-- video_editor 剪辑师
('video_editor', 'beijing', 'entry', 5, 10, 7, 0.5, 0.0),
('video_editor', 'beijing', 'mid', 10, 20, 14, 1.0, 0.0),
('video_editor', 'shanghai', 'entry', 6, 11, 8, 0.5, 0.0),
('video_editor', 'chengdu', 'entry', 4, 8, 6, 0.5, 0.0),

-- game_designer 游戏策划
('game_designer', 'shanghai', 'entry', 8, 15, 11, 1.5, 0.1),
('game_designer', 'shanghai', 'mid', 15, 30, 22, 2.0, 0.2),
('game_designer', 'shenzhen', 'entry', 8, 14, 10, 1.5, 0.12),
('game_designer', 'guangzhou', 'mid', 14, 28, 20, 2.0, 0.15),

-- travel_planner 旅行策划师
('travel_planner', 'shanghai', 'entry', 6, 12, 8, 1.0, 0.0),
('travel_planner', 'shanghai', 'mid', 10, 22, 15, 1.5, 0.0),
('travel_planner', 'chengdu', 'entry', 5, 10, 7, 1.0, 0.0),
('travel_planner', 'guangzhou', 'mid', 8, 18, 12, 1.5, 0.0),

-- cultural_planner 文旅策划师
('cultural_planner', 'shanghai', 'mid', 12, 22, 16, 1.5, 0.0),
('cultural_planner', 'chengdu', 'mid', 10, 18, 13, 1.5, 0.0),
('cultural_planner', 'beijing', 'mid', 12, 20, 15, 1.5, 0.0),

-- corporate_counsel 企业法务
('corporate_counsel', 'shanghai', 'entry', 10, 18, 13, 2.0, 0.02),
('corporate_counsel', 'shanghai', 'mid', 18, 35, 25, 2.5, 0.05),
('corporate_counsel', 'beijing', 'entry', 10, 17, 12, 2.0, 0.02),
('corporate_counsel', 'shenzhen', 'mid', 16, 30, 22, 2.5, 0.04),

-- compliance_officer 合规官
('compliance_officer', 'shanghai', 'mid', 20, 38, 28, 2.5, 0.03),
('compliance_officer', 'shanghai', 'senior', 30, 55, 40, 3.0, 0.05),
('compliance_officer', 'beijing', 'mid', 18, 35, 25, 2.5, 0.03),
('compliance_officer', 'shenzhen', 'mid', 16, 32, 22, 2.5, 0.03),

-- ip_lawyer 知识产权律师
('ip_lawyer', 'beijing', 'entry', 10, 18, 13, 1.5, 0.0),
('ip_lawyer', 'beijing', 'mid', 18, 35, 25, 2.0, 0.0),
('ip_lawyer', 'shanghai', 'mid', 16, 32, 22, 2.0, 0.0),
('ip_lawyer', 'shenzhen', 'entry', 9, 16, 12, 1.5, 0.0),

-- restaurant_manager 餐厅经理
('restaurant_manager', 'shanghai', 'entry', 6, 12, 8, 1.0, 0.0),
('restaurant_manager', 'shanghai', 'mid', 10, 20, 14, 1.5, 0.0),
('restaurant_manager', 'beijing', 'mid', 10, 18, 13, 1.5, 0.0),
('restaurant_manager', 'guangzhou', 'entry', 5, 10, 7, 1.0, 0.0),

-- food_rnd 食品研发员
('food_rnd', 'shanghai', 'entry', 7, 14, 10, 1.5, 0.0),
('food_rnd', 'shanghai', 'mid', 12, 22, 16, 2.0, 0.0),
('food_rnd', 'guangzhou', 'entry', 6, 12, 8, 1.5, 0.0),
('food_rnd', 'chengdu', 'mid', 10, 18, 13, 2.0, 0.0),

-- food_creator 美食内容创作者
('food_creator', 'shanghai', 'entry', 4, 10, 6, 0.0, 0.0),
('food_creator', 'shanghai', 'mid', 8, 25, 12, 0.0, 0.0),
('food_creator', 'chengdu', 'entry', 3, 8, 5, 0.0, 0.0),
('food_creator', 'guangzhou', 'mid', 6, 20, 10, 0.0, 0.0),

-- civil_servant 公务员
('civil_servant', 'beijing', 'entry', 7, 12, 9, 2.0, 0.0),
('civil_servant', 'shanghai', 'entry', 8, 13, 10, 2.0, 0.0),
('civil_servant', 'chengdu', 'entry', 5, 9, 7, 2.0, 0.0),
('civil_servant', 'suzhou', 'entry', 6, 10, 8, 2.0, 0.0),

-- community_worker 社区工作者
('community_worker', 'shanghai', 'entry', 5, 8, 6, 1.5, 0.0),
('community_worker', 'beijing', 'entry', 5, 8, 6, 1.5, 0.0),
('community_worker', 'chengdu', 'entry', 4, 7, 5, 1.5, 0.0),
('community_worker', 'suzhou', 'entry', 4, 7, 5, 1.5, 0.0),

-- tea_brand_manager 茶品牌运营
('tea_brand_manager', 'xiamen', 'entry', 5, 10, 7, 1.0, 0.0),
('tea_brand_manager', 'xiamen', 'mid', 10, 20, 14, 1.5, 0.0),
('tea_brand_manager', 'shanghai', 'mid', 10, 18, 13, 1.5, 0.0),
('tea_brand_manager', 'hangzhou', 'mid', 8, 16, 11, 1.5, 0.0),

-- tea_space_owner 茶空间主理人
('tea_space_owner', 'xiamen', 'entry', 5, 12, 8, 0.0, 0.0),
('tea_space_owner', 'xiamen', 'mid', 8, 20, 12, 0.0, 0.0),
('tea_space_owner', 'chengdu', 'entry', 4, 10, 6, 0.0, 0.0),
('tea_space_owner', 'hangzhou', 'mid', 8, 18, 11, 0.0, 0.0),

-- autonomous_drive_eng 智能驾驶工程师
('autonomous_drive_eng', 'shanghai', 'entry', 20, 38, 28, 2.5, 0.3),
('autonomous_drive_eng', 'shanghai', 'mid', 35, 60, 45, 3.0, 0.45),
('autonomous_drive_eng', 'shanghai', 'senior', 50, 80, 62, 4.0, 0.6),
('autonomous_drive_eng', 'beijing', 'entry', 22, 40, 30, 2.5, 0.32),
('autonomous_drive_eng', 'shenzhen', 'mid', 30, 55, 40, 3.0, 0.4),

-- battery_engineer 新能源电池工程师
('battery_engineer', 'shanghai', 'entry', 12, 22, 16, 2.0, 0.1),
('battery_engineer', 'shanghai', 'mid', 20, 40, 28, 2.5, 0.2),
('battery_engineer', 'shenzhen', 'entry', 12, 20, 15, 2.0, 0.1),
('battery_engineer', 'suzhou', 'mid', 18, 35, 25, 2.5, 0.15),

-- automotive_designer 汽车设计师
('automotive_designer', 'shanghai', 'mid', 18, 35, 25, 2.0, 0.1),
('automotive_designer', 'shanghai', 'senior', 28, 50, 38, 2.5, 0.2),
('automotive_designer', 'beijing', 'mid', 16, 30, 22, 2.0, 0.08),
('automotive_designer', 'guangzhou', 'mid', 15, 28, 20, 2.0, 0.08),

-- architect 建筑设计师
('architect', 'shanghai', 'entry', 8, 15, 10, 1.5, 0.0),
('architect', 'shanghai', 'mid', 15, 30, 22, 2.0, 0.0),
('architect', 'shanghai', 'senior', 25, 50, 35, 2.5, 0.0),
('architect', 'beijing', 'mid', 14, 28, 20, 2.0, 0.0),
('architect', 'shenzhen', 'mid', 12, 25, 18, 2.0, 0.0),

-- interior_designer 室内设计师
('interior_designer', 'shanghai', 'entry', 6, 12, 8, 1.0, 0.0),
('interior_designer', 'shanghai', 'mid', 12, 25, 16, 1.5, 0.0),
('interior_designer', 'beijing', 'entry', 6, 11, 8, 1.0, 0.0),
('interior_designer', 'chengdu', 'mid', 10, 20, 14, 1.5, 0.0),

-- bim_engineer BIM工程师
('bim_engineer', 'shanghai', 'entry', 8, 14, 10, 1.5, 0.0),
('bim_engineer', 'shanghai', 'mid', 14, 25, 18, 2.0, 0.0),
('bim_engineer', 'beijing', 'mid', 13, 22, 17, 2.0, 0.0),
('bim_engineer', 'shenzhen', 'mid', 12, 22, 16, 2.0, 0.0)

ON CONFLICT (job_id, city_id, experience_level) DO UPDATE SET
  min_salary = EXCLUDED.min_salary, max_salary = EXCLUDED.max_salary,
  median_salary = EXCLUDED.median_salary, bonus_months = EXCLUDED.bonus_months,
  stock_likelihood = EXCLUDED.stock_likelihood;


-- ============================================
-- 3. 风险评估数据 (每个岗位 1-2 条)
-- ============================================
INSERT INTO risk_assessment (job_id, risk_type, risk_level, description, mitigation, probability, impact_score) VALUES

-- internet
('data_analyst', 'ai_replacement', '中', 'AI数据分析工具可自动化基础分析，但业务洞察仍需人类', '从执行分析转向定义问题和业务洞察', 0.4, 45),
('data_analyst', 'market_cycle', '低', '数据驱动是大势所趋，分析师需求稳中有升', '持续深耕行业知识，做复合型人才', 0.2, 30),

('frontend_engineer', 'ai_replacement', '中', 'AI代码生成工具可完成基础页面开发', '从写页面升级为架构设计和工程化能力', 0.45, 50),
('frontend_engineer', 'market_cycle', '中', '前端岗位趋于饱和，但资深工程师仍稀缺', '向全栈或特定领域深耕(3D/可视化)', 0.35, 45),

('devops_engineer', 'ai_replacement', '低', '运维自动化是趋势，但复杂系统仍需人工决策', '向SRE和平台工程方向进化', 0.25, 30),
('devops_engineer', 'health', '中', '7x24小时待命可能影响生活节奏', '建立on-call轮值制度，提升自动化水平', 0.5, 40),

('growth_hacker', 'market_cycle', '中', '增长岗位依赖市场预算，预算缩减时首当其冲', '建立数据驱动的硬技能，不依赖单一渠道', 0.4, 55),

('project_manager', 'ai_replacement', '低', 'AI可辅助排期和文档，但人际协调不可替代', '强化沟通领导力和战略思维', 0.2, 25),

-- creative
('brand_designer', 'ai_replacement', '中', 'AI设计工具可生成大量设计方案，降低设计门槛', '强化品牌策略思维，从执行者升级为策略者', 0.5, 55),
('brand_designer', 'market_cycle', '中', '品牌预算受经济周期影响，甲方可能缩减开支', '拓展服务类型，建立长期客户关系', 0.4, 45),

('illustrator', 'ai_replacement', '高', 'AI绘画工具快速迭代，基础插画需求被大量替代', '强化独特个人风格，AI无法复制的情感表达', 0.65, 65),

('copywriter', 'ai_replacement', '中', 'AI写作工具可生成基础文案，但品牌调性仍需人类把控', '从写文字升级为策略思考，做品牌叙事者', 0.45, 50),

('freelance_designer', 'market_cycle', '中', '自由职业收入不稳定，项目制模式有断档风险', '建立稳定客户池，发展被动收入来源', 0.5, 55),
('freelance_designer', 'health', '低', '自由职业缺乏社保保障', '自行购买商业保险，建立财务缓冲', 0.3, 35),

-- finance
('ib_analyst', 'health', '高', '投行高压文化，每周80-100小时工作制严重影响健康', '建立运动习惯，设置工作边界，考虑长期可持续性', 0.7, 70),
('ib_analyst', 'market_cycle', '中', '投行业务高度依赖资本市场周期', '在牛市积累资本和技能，为低谷期做准备', 0.45, 55),

('quant_trader', 'market_cycle', '中', '量化策略可能因市场结构变化而失效', '持续研发新策略，保持策略多样性', 0.4, 60),
('quant_trader', 'health', '中', '高压工作节奏影响身心健康', '规律运动，注意心理健康', 0.45, 45),

('risk_analyst', 'policy', '低', '监管政策变化可能改变风控标准', '紧跟监管动态，参与行业协会', 0.2, 35),

('fintech_pm', 'market_cycle', '中', '金融科技赛道受资本周期影响', '选择有盈利能力的公司，关注合规方向', 0.35, 45),

('wealth_advisor', 'market_cycle', '中', '资管规模受市场行情影响，收入与AUM挂钩', '构建多元化客户组合，降低单一客户依赖', 0.4, 50),

-- education
('teacher', 'policy', '中', '教育政策变化可能影响教学要求和评价体系', '紧跟政策方向，灵活调整教学方法', 0.35, 40),
('teacher', 'health', '中', '长期站立授课和批改作业影响身心健康', '注意嗓音保护，合理安排休息', 0.4, 35),

('curriculum_designer', 'ai_replacement', '低', 'AI可辅助内容生成，但课程体系设计需人类', '拥抱AI工具提升效率，专注高阶设计能力', 0.2, 25),

('corporate_trainer', 'market_cycle', '中', '企业培训预算在经济下行时可能被削减', '发展个人品牌和线上课程，建立多元收入', 0.35, 45),

('edtech_specialist', 'market_cycle', '中', '教育科技投资受资本市场波动影响', '关注有盈利模型的赛道，积累跨行业经验', 0.35, 40),

-- healthcare
('doctor', 'health', '高', '长期高压工作、夜班频繁影响身心健康', '合理安排轮休，重视自我健康管理', 0.65, 60),
('doctor', 'policy', '中', '医疗改革可能影响收入结构和工作模式', '关注政策方向，提前适应DRG/DIP等新模式', 0.35, 40),

('pharma_researcher', 'market_cycle', '中', '新药研发周期长，项目可能因各种原因终止', '参与多个项目分散风险，提升核心技能', 0.4, 50),

('nurse', 'health', '中', '倒班制度影响生物钟，身体劳损常见', '加强锻炼，注意职业防护', 0.5, 40),
('nurse', 'market_cycle', '低', '护理人员长期短缺，需求稳定', '提升专科能力，向高级护理发展', 0.15, 20),

('health_manager', 'market_cycle', '低', '健康管理意识提升，需求稳步增长', '考取专业资质，提升服务深度', 0.2, 25),

-- ecommerce
('crossborder_operator', 'policy', '中', '各国贸易政策和关税政策变化可能影响业务', '关注政策动态，布局多市场分散风险', 0.4, 55),
('crossborder_operator', 'market_cycle', '中', '跨境电商竞争加剧，利润率承压', '深耕供应链，建立品牌壁垒', 0.4, 50),

('supply_chain_manager', 'market_cycle', '中', '供应链受地缘政治和疫情影响较大', '构建韧性供应链，多供应商策略', 0.45, 55),

('brand_strategist', 'market_cycle', '中', '品牌预算受经济周期影响', '从花钱做品牌转向驱动增长的品牌策略', 0.35, 45),

-- media
('director', 'market_cycle', '高', '影视行业周期波动大，项目制收入不稳定', '拓展短剧/广告等轻量项目，储备现金流', 0.6, 60),

('video_editor', 'ai_replacement', '中', 'AI剪辑工具可完成基础剪辑任务', '从技术剪辑升级为创意剪辑，强化叙事能力', 0.4, 40),

('game_designer', 'market_cycle', '中', '游戏行业受版号政策影响，项目可能被叫停', '关注海外市场，积累跨平台设计能力', 0.4, 50),
('game_designer', 'health', '中', '项目冲刺期加班严重', '合理安排时间，注意劳逸结合', 0.45, 40),

-- hospitality
('travel_planner', 'market_cycle', '中', '旅游业受季节和突发事件影响大', '拓展企业客户和定制化高端服务', 0.4, 45),

('cultural_planner', 'policy', '中', '文旅项目依赖政府预算和政策支持', '建立政府关系，关注政策导向', 0.35, 45),

-- legal
('corporate_counsel', 'ai_replacement', '低', 'AI可辅助合同审查，但复杂商业判断不可替代', '聚焦高价值法律策略和商业决策', 0.2, 25),

('compliance_officer', 'policy', '低', '监管日趋严格，合规需求反而增加', '保持专业敏感性，这反而是职业机遇', 0.15, 20),

('ip_lawyer', 'market_cycle', '低', '知识产权保护力度持续加强，需求看涨', '深耕技术领域专利，建立行业口碑', 0.2, 25),

-- food
('restaurant_manager', 'market_cycle', '高', '餐饮行业淘汰率高，新开餐厅一年存活率不足50%', '精细化运营，控制成本，打造差异化', 0.65, 65),
('restaurant_manager', 'health', '中', '餐饮行业作息不规律，体力消耗大', '合理安排排班，注意饮食健康', 0.4, 35),

('food_rnd', 'ai_replacement', '低', '食品研发需要人类味觉和创新，AI辅助有限', '深耕专业，积累配方创新经验', 0.15, 20),

('food_creator', 'market_cycle', '中', '内容平台算法变化影响流量获取', '多平台布局，建立私域流量', 0.4, 45),

-- public
('civil_servant', 'market_cycle', '低', '公务员岗位最稳定，基本不受经济周期影响', '在稳定中寻找成长空间，关注晋升通道', 0.05, 10),

('community_worker', 'health', '低', '社区工作压力相对可控', '注意情绪管理，建立支持网络', 0.25, 25),

-- tea
('tea_brand_manager', 'market_cycle', '中', '茶行业竞争加剧，品牌同质化严重', '找到差异化定位，深耕细分市场', 0.35, 40),

('tea_space_owner', 'market_cycle', '中', '茶空间依赖线下客流，受经济环境影响', '发展线上内容和零售，增加收入来源', 0.4, 45),

-- automotive
('autonomous_drive_eng', 'market_cycle', '低', '智能驾驶赛道长期高景气，人才需求旺盛', '持续学习前沿技术，保持竞争力', 0.15, 25),
('autonomous_drive_eng', 'health', '中', '高强度研发可能影响身心健康', '注意劳逸结合，建立健康习惯', 0.4, 35),

('battery_engineer', 'policy', '低', '新能源政策支持力度大', '紧跟技术路线，关注固态电池等前沿方向', 0.1, 15),

('automotive_designer', 'ai_replacement', '低', 'AI可辅助设计生成，但审美判断需人类', '将AI作为工具，强化创意和审美判断', 0.2, 25),

-- realestate
('architect', 'market_cycle', '高', '房地产行业深度调整，新建项目大幅减少', '转向城市更新和绿色建筑方向', 0.6, 60),
('architect', 'ai_replacement', '低', 'AI可辅助方案生成，但空间设计仍需人类', '拥抱AI工具提升效率，专注设计创新', 0.25, 30),

('interior_designer', 'market_cycle', '中', '新房装修减少，但存量房改造需求增加', '拓展老房改造和商业空间设计', 0.4, 45),

('bim_engineer', 'ai_replacement', '低', 'BIM技术壁垒较高，短期内AI难以替代', '持续学习新技术，向数字孪生方向发展', 0.15, 20);


-- ============================================
-- 4. 市场分析数据 (每个岗位 1-2 条)
-- ============================================
INSERT INTO market_analysis (job_id, analysis_type, content, score, data_date) VALUES

-- internet
('data_analyst', 'demand', '数据分析师需求稳定，企业对数据驱动决策的依赖持续加深', 70, '2026-05-01'),
('data_analyst', 'trend', '从描述性分析向预测性分析转型，AI+分析是未来方向', 72, '2026-05-01'),

('frontend_engineer', 'demand', '前端工程师供需趋于平衡，AI工程化和跨端方向需求增加', 60, '2026-05-01'),
('frontend_engineer', 'trend', 'AI辅助编码将改变前端开发模式，工程师需从写码转向架构', 65, '2026-05-01'),

('devops_engineer', 'demand', 'DevOps工程师需求旺盛，云原生和平台工程是热门方向', 75, '2026-05-01'),
('devops_engineer', 'trend', '平台工程(Platform Engineering)正在取代传统DevOps的概念', 78, '2026-05-01'),

('growth_hacker', 'demand', '增长岗位在互联网成熟期仍有需求，但更看重ROI导向的能力', 60, '2026-05-01'),
('growth_hacker', 'trend', 'AI驱动的自动化增长正在兴起，增长黑客需掌握AI工具', 68, '2026-05-01'),

('project_manager', 'demand', '项目经理需求平稳，敏捷和远程协作管理能力是加分项', 55, '2026-05-01'),

-- creative
('brand_designer', 'demand', '品牌设计需求稳定，但甲方对设计师的策略能力要求提高', 55, '2026-05-01'),
('brand_designer', 'trend', 'AI设计工具让设计效率提升，但品牌策略思维不可替代', 60, '2026-05-01'),

('illustrator', 'demand', '基础插画需求被AI大量替代，但有独特风格的插画师仍稀缺', 40, '2026-05-01'),
('illustrator', 'trend', '个人IP化是插画师的生存之道，有辨识度的风格最值钱', 55, '2026-05-01'),

('copywriter', 'demand', '文案需求依然旺盛，但纯执行型文案最容易被AI替代', 50, '2026-05-01'),
('copywriter', 'trend', '从写文字到做品牌叙事，文案的价值在于策略和洞察', 58, '2026-05-01'),

('freelance_designer', 'demand', '独立设计师市场持续扩大，但竞争也在加剧', 50, '2026-05-01'),
('freelance_designer', 'trend', 'AI工具让独立设计师可以一人成军，但也拉低了市场单价', 55, '2026-05-01'),

-- finance
('ib_analyst', 'demand', '投行分析师岗位竞争白热化，目标院校+实习是入场券', 45, '2026-05-01'),
('ib_analyst', 'trend', '投行2年后是分水岭，要么升VP要么转行，转行比例超60%', 50, '2026-05-01'),

('quant_trader', 'demand', '量化人才需求稳定增长，但门槛极高', 65, '2026-05-01'),
('quant_trader', 'trend', '机器学习+传统量化融合是趋势，纯统计套利空间收窄', 70, '2026-05-01'),

('risk_analyst', 'demand', '风控人才需求稳中有升，尤其银行和互金方向', 65, '2026-05-01'),

('fintech_pm', 'demand', '金融科技产品经理需求旺盛，懂金融又懂产品的人最稀缺', 72, '2026-05-01'),
('fintech_pm', 'trend', 'AI+金融是最大风口，合规科技和嵌入式金融值得关注', 78, '2026-05-01'),

('wealth_advisor', 'demand', '理财顾问需求随居民财富增长而增加，但监管趋严', 60, '2026-05-01'),

-- education
('teacher', 'demand', '教师岗位需求稳定，一线城市竞争激烈但待遇更好', 65, '2026-05-01'),

('curriculum_designer', 'demand', '课程设计师在在线教育和企业培训领域需求增长', 60, '2026-05-01'),
('curriculum_designer', 'trend', 'AI辅助课程设计正在兴起，效率大幅提升', 65, '2026-05-01'),

('corporate_trainer', 'demand', '企业培训师需求稳定，有行业专精的培训师更受欢迎', 55, '2026-05-01'),

('edtech_specialist', 'demand', '教育技术专家在AI+教育赛道需求井喷', 80, '2026-05-01'),
('edtech_specialist', 'trend', 'AI个性化学习是最热方向，懂教育又懂技术的复合人才最稀缺', 85, '2026-05-01'),

-- healthcare
('doctor', 'demand', '医生永远紧缺，尤其基层和全科医生', 85, '2026-05-01'),
('doctor', 'trend', 'AI辅助诊断提升效率，但医生核心决策价值不可替代', 70, '2026-05-01'),

('pharma_researcher', 'demand', '药物研发人才需求持续，创新药赛道热度不减', 70, '2026-05-01'),
('pharma_researcher', 'trend', 'AI加速药物筛选和设计，药企对AI+研发复合人才需求增长', 75, '2026-05-01'),

('nurse', 'demand', '护理人员长期短缺，尤其养老护理方向', 80, '2026-05-01'),

('health_manager', 'demand', '健康管理师需求随健康意识提升而增长', 55, '2026-05-01'),
('health_manager', 'trend', '从个人服务向企业健康管理方向拓展', 58, '2026-05-01'),

-- ecommerce
('crossborder_operator', 'demand', '跨境电商运营需求旺盛，尤其TikTok和Temu方向', 78, '2026-05-01'),
('crossborder_operator', 'trend', '从铺货模式向品牌出海转型，需要更综合的能力', 75, '2026-05-01'),

('supply_chain_manager', 'demand', '供应链经理在电商和制造业领域持续紧缺', 70, '2026-05-01'),

('brand_strategist', 'demand', '品牌策划师需求增长，企业越来越重视品牌价值', 65, '2026-05-01'),
('brand_strategist', 'trend', '从花钱做品牌到用品牌驱动增长，策略师需懂生意', 68, '2026-05-01'),

-- media
('director', 'demand', '导演/编导在短剧方向需求暴增，传统影视方向萎缩', 60, '2026-05-01'),
('director', 'trend', '短剧和微短剧是最大增量市场，AI辅助制作正在普及', 65, '2026-05-01'),

('video_editor', 'demand', '剪辑师需求旺盛，短视频内容生态持续扩张', 70, '2026-05-01'),
('video_editor', 'trend', 'AI剪辑工具提升效率，但创意剪辑仍需人类判断', 62, '2026-05-01'),

('game_designer', 'demand', '游戏策划需求稳中有升，二次元和海外市场方向更热', 65, '2026-05-01'),
('game_designer', 'trend', 'AI NPC和程序化生成正在改变游戏设计方式', 72, '2026-05-01'),

-- hospitality
('travel_planner', 'demand', '高端定制旅行需求回升，优秀旅行策划师稀缺', 55, '2026-05-01'),

('cultural_planner', 'demand', '文旅策划师在乡村振兴和城市更新中需求增长', 58, '2026-05-01'),
('cultural_planner', 'trend', '沉浸式文旅和夜经济是两大热点方向', 62, '2026-05-01'),

-- legal
('corporate_counsel', 'demand', '企业法务需求稳定增长，尤其科技和金融行业', 68, '2026-05-01'),

('compliance_officer', 'demand', '合规官需求爆发式增长，数据合规和跨境合规最抢手', 82, '2026-05-01'),
('compliance_officer', 'trend', '合规正在从成本中心变成企业的核心竞争力', 78, '2026-05-01'),

('ip_lawyer', 'demand', '知识产权律师需求持续增长，科技行业知产纠纷增多', 72, '2026-05-01'),

-- food
('restaurant_manager', 'demand', '餐厅经理需求稳定，但行业淘汰率高', 50, '2026-05-01'),
('restaurant_manager', 'trend', '小而美+内容化是餐饮生存之道', 52, '2026-05-01'),

('food_rnd', 'demand', '食品研发员在健康食品方向需求增长', 55, '2026-05-01'),

('food_creator', 'demand', '美食内容创作者数量暴涨，但变现率低', 45, '2026-05-01'),
('food_creator', 'trend', 'AI内容工具降低门槛，真实感和专业度是差异化关键', 48, '2026-05-01'),

-- public
('civil_servant', 'demand', '公务员报考人数持续创新高，竞争极其激烈', 40, '2026-05-01'),

('community_worker', 'demand', '社区工作者需求稳定，基层治理现代化推动人才需求', 55, '2026-05-01'),

-- tea
('tea_brand_manager', 'demand', '茶品牌运营在国潮趋势下需求增长', 55, '2026-05-01'),
('tea_brand_manager', 'trend', '茶饮品牌年轻化是主旋律，新茶饮赛道仍有空间', 60, '2026-05-01'),

('tea_space_owner', 'demand', '茶空间在小众市场有稳定需求', 45, '2026-05-01'),

-- automotive
('autonomous_drive_eng', 'demand', '智能驾驶工程师极度紧缺，供需比约1:5', 92, '2026-05-01'),
('autonomous_drive_eng', 'trend', '端到端自动驾驶是技术前沿，L4量产落地是行业目标', 90, '2026-05-01'),

('battery_engineer', 'demand', '新能源电池工程师需求旺盛，固态电池方向最热', 78, '2026-05-01'),

('automotive_designer', 'demand', '汽车设计师需求稳定增长，新能源品牌大量涌现', 65, '2026-05-01'),
('automotive_designer', 'trend', '智能座舱设计成为新方向，UX+汽车设计复合能力最值钱', 70, '2026-05-01'),

-- realestate
('architect', 'demand', '建筑设计师在新建项目减少的背景下需求收缩', 40, '2026-05-01'),
('architect', 'trend', '城市更新和绿色建筑是结构性机会', 50, '2026-05-01'),

('interior_designer', 'demand', '室内设计师需求稳定，存量房改造市场持续增长', 60, '2026-05-01'),

('bim_engineer', 'demand', 'BIM工程师需求增长，政策推动BIM在建筑全生命周期应用', 68, '2026-05-01'),
('bim_engineer', 'trend', '从BIM向数字孪生演进，技术门槛持续提升', 72, '2026-05-01');
