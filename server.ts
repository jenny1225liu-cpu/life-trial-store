import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { createClient } from "@supabase/supabase-js";
import { getAIProvider, CareerMappingResult, CareerMappingParams, ReportResult, GenerateReportParams } from "./src/ai-provider";

dotenv.config(); // .env
dotenv.config({ path: ".env.local" }); // .env.local (覆盖 .env)

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

// ============================================
// Supabase Client
// ============================================
const supabaseUrl = process.env.SUPABASE_URL || "";
const supabaseKey = process.env.SUPABASE_ANON_KEY || "";

let supabase: any = null;
if (supabaseUrl && supabaseKey) {
  supabase = createClient(supabaseUrl, supabaseKey);
  console.log("[DB] Supabase client initialized.");
} else {
  console.log("[DB] No SUPABASE_URL/KEY configured. Database features disabled.");
}

// ============================================
// Fallback Response Generator (no AI available)
// ============================================
const generateFallbackResponse = (tid: string, stats: any): CareerMappingResult => {
  const happyNum = Number(stats?.happiness !== undefined ? stats.happiness : (stats?.freedom !== undefined ? (stats.freedom + (stats.connection || 50)) / 2 : 50));
  const healthNum = Number(stats?.health !== undefined ? stats.health : (stats?.peace !== undefined ? stats.peace : 50));
  const stressNum = Number(stats?.stress !== undefined ? stats.stress : (stats?.peace !== undefined ? Math.max(10, 100 - stats.peace) : 50));
  const growthNum = Number(stats?.growth !== undefined ? stats.growth : (stats?.wealth !== undefined ? stats.wealth : 50));

  const wealthNum = growthNum;
  const freedomNum = happyNum;
  const connectionNum = happyNum;
  const peaceNum = healthNum;

  // 每个 trialId 对应的 fallback 数据（与 data.ts 的 trialId 一一对应）
  const fallbacks: Record<string, Partial<CareerMappingResult>> = {
    pm_shanghai: {
      title: freedomNum > wealthNum ? "外滩落日下的带薪留白分析师" : "高频咬合的十六宫格汇报特工",
      resonance: freedomNum > wealthNum
        ? "虽然身处高压运转的产品链条核心，你内心却深藏着黄浦江落日的温柔浪漫。通过带薪摸鱼，你绝不容许自己的心跳节奏被PPT烤干。"
        : "大厂游戏规则的极客玩家！你能瞬间给出最合理的性价比与故障归因策略。",
      cityMatch: { score: 80, comment: "上海高密度的精细效率与你的职业敏锐度完美合流。" },
      mapping: {
        career: freedomNum > wealthNum ? "全栈产品体验顾问 / 自由行旅游规划经理 / 策展人助理" : "跨国大厂高级产品经理 / 商业策略分析师 / 敏捷教练",
        marketVibe: "互联网迈向精细存量经营，跨团队全量沟通与体验自愈能力已成为各大厂产品战略专家安身立命的不二外挂。",
        salaryExpectation: "15k - 35k/月，具有强悍的生活保障",
        actionItem: freedomNum > wealthNum
          ? "下载任意 3 个最新发售的极简App，画出它们最令你舒适的3个微小微交互，贴在房门背后。"
          : "挑选一个你平时高频使用的外卖或打车App，撰写 80 字内的改进小点子投递给前台。",
        careerPaths: [
          { name: "产品策略顾问", fitScore: 92, description: "为不同公司诊断产品问题、输出策略方案，自由度高、收入弹性大", salary: "20k-40k/月（项目制）", icon: "🎯" },
          { name: "用户体验研究员", fitScore: 80, description: "深挖用户需求与行为洞察，让产品真正为人而设计", salary: "15k-28k/月", icon: "🔍" },
          { name: "创业公司合伙人", fitScore: 68, description: "用你的产品嗅觉和资源整合力，从0到1搭建一个新物种", salary: "看项目，上不封顶", icon: "🚀" },
        ],
        industryInsight: { name: "互联网/科技", trend: "从野蛮增长转向精细化运营，产品经理需要更懂商业和用户心理", outlook: "结构性调整中，但好产品经理永远稀缺", hotSkill: "数据驱动决策 + AI产品化" },
      },
    },
    designer_hangzhou: {
      title: freedomNum > 70 ? "西湖边野生像素牧羊人" : "像素艺术与商业变现魔术师",
      resonance: freedomNum > 70
        ? "你的自由指数简直爆表！对你来说，格子间就是风干灵魂的烘干机，大自然露珠与自由漫步才是你的创意亲娘。"
        : "你极擅长用美感笔触兑换现实的筹码，在自己不可退让的设计底线和金主不合理的改动间跳一支优雅的双人舞。",
      cityMatch: { score: 85, comment: "西湖苍翠的烟雨与你的创意画框浑然天成，是天生的创意栖息所。" },
      mapping: {
        career: freedomNum > 70 ? "独立插画师 / 视觉大厂原画师 / 跨界美学主理人" : "新媒体设计总监 / 顶尖品牌美学合伙人 / 创意买手",
        marketVibe: "AI绘画爆发让虚伪套件贬值，但拥有执着个人温度笔触、善于留白的独立手艺IP，具有无价的商业感召力。",
        salaryExpectation: "8k - 22k/月，打造独立IP成功后收益上不封顶",
        actionItem: freedomNum > 70
          ? "拿出口袋里的手机，去路边至少拍摄10张不同草木、生锈井盖或破旧砖缝的细节质感，做成自愈色板。"
          : "找出一款你常去的创意自媒体，设计一处既不伤大雅、又能温柔盈利的暖心治愈角落，写在便签上。",
        careerPaths: [
          { name: "独立插画师/视觉艺术家", fitScore: 90, description: "以个人风格创作变现，自由但需自律经营IP", salary: "8k-30k/月（IP成熟后上不封顶）", icon: "🎨" },
          { name: "品牌视觉总监", fitScore: 75, description: "在大厂或品牌方掌舵视觉调性，有资源但有限制", salary: "20k-40k/月", icon: "👁️" },
          { name: "数字游民创意人", fitScore: 82, description: "远程接单+旅行创作，杭州是最理想的基地", salary: "10k-25k/月（波动性大）", icon: "🌍" },
        ],
        industryInsight: { name: "创意设计/文创", trend: "AI工具普及让执行力贬值，但审美力和个人风格越来越值钱", outlook: "看涨——个人IP时代，有温度的设计者最吃香", hotSkill: "AI协作 + 个人IP运营" },
      },
    },
    ai_beijing: {
      title: peaceNum > connectionNum ? "中关村深夜显卡轰鸣旁的隐学者" : "重度知识开源社群灯塔领航员",
      resonance: peaceNum > connectionNum
        ? "你的思考深度令人惊叹。在代码和数据的深海里，你找到了常人难以抵达的安宁。"
        : "你天生就是连接者。技术不只是你的工具，更是你链接人心的桥梁。",
      cityMatch: { score: 88, comment: "中关村的宏大智能革命与你深邃、孤寂的深奥理智灵魂达成完美共振。" },
      mapping: {
        career: peaceNum > connectionNum ? "AI大模型算法架构师 / 顶级量化策略研究员 / 前沿科学顾问" : "技术布道师 (Advocate) / 科技创客合伙人 / 极客社区主理人",
        marketVibe: "AI极速演进。在这个战局，最无价的是那些懂底层数学原理、对真实的凡尘又饱有深刻悲悯的极客。",
        salaryExpectation: "25k - 60k/月，金字塔塔尖的绝佳技能高溢价",
        actionItem: peaceNum > connectionNum
          ? "闭上眼，回忆你写下的最初一行代码或第一行\"Hello World\"，感受那一颗初心如何决定了今天的星河。"
          : "在 GitHub 上找到一个处于极其早期的开源小仓库，向它提交一份中文指引 README 说明或一处拼写 PR。",
        careerPaths: [
          { name: "AI算法研究员", fitScore: 94, description: "在大模型前沿攻坚，北京是最核心的战场", salary: "30k-60k/月", icon: "🧠" },
          { name: "技术布道师/开发者关系", fitScore: 78, description: "把复杂技术翻译成人类语言，连接开发者生态", salary: "25k-45k/月", icon: "🎙️" },
          { name: "科技创业合伙人", fitScore: 70, description: "用技术洞察力撬动商业机会，高风险高回报", salary: "20k-50k+ /月（含股权）", icon: "💡" },
        ],
        industryInsight: { name: "人工智能/前沿科技", trend: "大模型军备竞赛白热化，从算法到应用都在加速迭代", outlook: "强烈看涨，但竞争极度激烈", hotSkill: "大模型微调 + Agent架构设计" },
      },
    },
    lawyer_beijing: {
      title: peaceNum > wealthNum ? "朝阳写字楼的规则诗人" : "国贸穹顶下的精密手术刀",
      resonance: peaceNum > wealthNum
        ? "在冷冰冰的条款里你找到了温度。你不是在打官司，你是在替弱者守护那道最后的防线。"
        : "你的逻辑精密到令人窒息。每一次谈判都像一局棋，你总能提前算出三步之后的将军。",
      cityMatch: { score: 86, comment: "北京的律所江湖深不可测，这里是法律人的最高竞技场。" },
      mapping: {
        career: peaceNum > wealthNum ? "公益法律援助律师 / 知识产权守护人 / 法治教育推广者" : "红圈所并购合伙人 / 跨境合规架构师 / 商事争议解决专家",
        marketVibe: "法律服务正在经历AI+专业化双重变革，红圈所竞争白热化，但细分领域的专家律师供不应求。",
        salaryExpectation: "授薪律师 15k-35k/月，合伙人年入50w+",
        actionItem: "找一个最近的商业新闻事件，试着从法律角度写3条你观察到的风险点。",
        careerPaths: [
          { name: "红圈所非诉律师", fitScore: 88, description: "在顶级律所做并购/上市项目，高压高薪高成长", salary: "20k-50k/月（含年终奖）", icon: "⚖️" },
          { name: "知识产权律师", fitScore: 76, description: "保护创新者的成果，兼具技术理解和法律智慧", salary: "15k-30k/月", icon: "🔒" },
          { name: "合规/数据隐私专家", fitScore: 82, description: "数字经济时代的新蓝海，懂技术的律师极度稀缺", salary: "25k-45k/月", icon: "🛡️" },
        ],
        industryInsight: { name: "法律/合规", trend: "传统诉讼增长放缓，但合规、数据隐私、跨境争议解决等新赛道爆发", outlook: "结构性分化——细分领域机会巨大", hotSkill: "跨境合规 + 数据隐私法" },
      },
    },
    hotel_mgr_hongkong: {
      title: connectionNum > 60 ? "维港海风中的极致待客艺术家" : "金碧大堂的细节掌控指挥官",
      resonance: connectionNum > 60
        ? "你在每一次鞠躬微笑里注入了真心。对你来说，服务不是流程，是让人感到被珍视的艺术。"
        : "你对细节的掌控力令人叹服。在混乱中你总能优雅地调度一切，让每个人各就各位。",
      cityMatch: { score: 84, comment: "中国香港的奢华酒店业全球领先，这里是最极致的修炼场。" },
      mapping: {
        career: connectionNum > 60 ? "奢华酒店宾客体验总监 / 高端旅行定制师 / 待客美学培训师" : "酒店运营管理总监 / 国际酒店集团区域经理 / 物业资产管理人",
        marketVibe: "高端酒店业在后疫情时代强劲复苏，但人才结构在变——懂数字化运营+传统待客之道的管理者极度稀缺。",
        salaryExpectation: "管培期 12k-18k/月，总监级 30k-60k/月",
        actionItem: "今晚去一家你从没去过的餐厅，只观察不点单，记录3个让你感到惊喜的服务细节。",
        careerPaths: [
          { name: "奢华酒店运营总监", fitScore: 90, description: "在顶级酒店掌舵运营，需要极致的细节和人感", salary: "30k-60k/月", icon: "🏨" },
          { name: "高端旅行定制师", fitScore: 80, description: "为VIP客户设计独一无二的旅行体验", salary: "15k-35k/月+提成", icon: "✈️" },
          { name: "待客体验顾问", fitScore: 72, description: "帮各行各业提升客户体验，从酒店走向更广阔的舞台", salary: "20k-40k/月（咨询制）", icon: "💎" },
        ],
        industryInsight: { name: "高端酒店/文旅", trend: "奢华旅行回暖，但客人更追求在地体验而非标准化服务", outlook: "稳步增长，个性化服务人才紧缺", hotSkill: "数字化运营 + 沉浸式体验设计" },
      },
    },
    flight_attendant_shenzhen: {
      title: happyNum > 55 ? "万米云端的温柔摆渡人" : "窄舱里的高维情绪管理师",
      resonance: happyNum > 55
        ? "你的笑容有治愈力。在狭小颠簸的客舱里，你让陌生人感到安全，这是了不起的天赋。"
        : "你在极端高压下依然优雅。颠簸不是你的敌人，是你展示从容的舞台。",
      cityMatch: { score: 82, comment: "深圳航空枢纽地位稳固，国际航线持续拓展，天空是你的主场。" },
      mapping: {
        career: happyNum > 55 ? "国际航线乘务长 / 航空服务培训师 / 旅行博主" : "航空安全管理专家 / 乘务培训总监 / 跨文化交流顾问",
        marketVibe: "航空业复苏势头强劲，国际航线井喷，但空乘职业天花板明显——转型方向是关键。",
        salaryExpectation: "乘务员 8k-18k/月，乘务长 15k-25k/月，含飞行补贴",
        actionItem: "下次坐飞机时，和乘务员微笑着聊一句'今天辛苦了'，观察他们表情的变化。",
        careerPaths: [
          { name: "国际航线乘务长", fitScore: 88, description: "在万米高空管理团队和客舱，是空乘的职业巅峰", salary: "15k-25k/月", icon: "✈️" },
          { name: "航空服务培训师", fitScore: 76, description: "把一线经验转化为培训体系，从飞到教", salary: "12k-22k/月", icon: "👩‍🏫" },
          { name: "旅行生活方式KOL", fitScore: 82, description: "用环游世界的视野做内容，空乘转型热门方向", salary: "8k-30k+/月（内容变现）", icon: "📱" },
        ],
        industryInsight: { name: "航空/高端服务", trend: "国际航线大爆发，但对空乘的综合素质要求越来越高", outlook: "稳步增长，但需要提前规划转型路径", hotSkill: "跨文化沟通 + 个人IP运营" },
      },
    },
    police_officer_qingdao: {
      title: connectionNum > 55 ? "海风里的温情执法者" : "巡街铁脚板的秩序守护神",
      resonance: connectionNum > 55
        ? "你的执法有温度。在规则和人情之间，你总能找到那条让双方都体面的缝隙。"
        : "你的执行力像青岛的岩石一样坚硬。在混乱面前，你是最让人安心的那堵墙。",
      cityMatch: { score: 88, comment: "青岛的慢节奏和滨海气质，让基层执法多了几分人情味。" },
      mapping: {
        career: connectionNum > 55 ? "社区治理创新专员 / 人民调解专家 / 基层公共安全顾问" : "刑侦技术专家 / 网络安全执法官 / 应急管理指挥员",
        marketVibe: "基层治理正在数字化转型，懂技术、通人情的警务人员越来越稀缺。青岛的生活成本让这份职业更有幸福感。",
        salaryExpectation: "基层 6k-12k/月，含各类津贴和公积金",
        actionItem: "去家附近的派出所门口站5分钟，观察进进出出的人，想想他们此刻最需要什么。",
        careerPaths: [
          { name: "社区警务/基层治理", fitScore: 90, description: "扎根社区守护一方平安，有人情味也有成就感", salary: "6k-12k/月+津贴", icon: "👮" },
          { name: "网络安全执法", fitScore: 74, description: "在数字战场追踪犯罪，需要技术敏感度", salary: "10k-20k/月", icon: "💻" },
          { name: "应急管理/消防救援", fitScore: 68, description: "从警务转型到应急管理，守护更大范围的安全", salary: "8k-15k/月", icon: "🚒" },
        ],
        industryInsight: { name: "公共安全/基层治理", trend: "智慧警务+网格化管理是方向，传统执法在向服务型转变", outlook: "稳定刚需，数字化转型带来新机会", hotSkill: "数字化治理 + 群众工作能力" },
      },
    },
    livestream_guangzhou: {
      title: happyNum > 55 ? "珠江夜色中的流量炼金女王" : "十三行仓库的选品军师",
      resonance: happyNum > 55
        ? "你的声音有魔力。在万人直播间里，你让每个人都觉得你在和他单独对话。"
        : "你对数据和选品的直觉惊人。别人看到的是商品，你看到的是爆款基因。",
      cityMatch: { score: 91, comment: "广州是全国直播电商的腹地，供应链和流量在此完美交汇。" },
      mapping: {
        career: happyNum > 55 ? "头部直播主播 / 个人IP品牌主理人 / 直播操盘手" : "选品供应链经理 / 直播间数据分析师 / 电商运营总监",
        marketVibe: "直播电商进入深水区，纯靠嗓子吼的时代过去了。现在拼的是供应链+内容+数据的复合能力。",
        salaryExpectation: "起步 5k-10k/月，爆单后月入5w+",
        actionItem: "今晚打开任意一个直播间，看3分钟，用一句话写出主播最打动你的那个瞬间。",
        careerPaths: [
          { name: "直播电商操盘手", fitScore: 92, description: "从选品到话术到流量，掌控直播间的全部环节", salary: "10k-50k+/月（含提成）", icon: "🎬" },
          { name: "品牌自播主理人", fitScore: 80, description: "帮品牌搭建自己的直播间，稳定且可持续", salary: "15k-30k/月", icon: "🏷️" },
          { name: "短视频内容总监", fitScore: 74, description: "从直播转型短视频，用更轻的方式做更大的影响力", salary: "12k-25k/月", icon: "📱" },
        ],
        industryInsight: { name: "直播电商/新零售", trend: "从野蛮生长走向精细化运营，品牌自播成为新趋势", outlook: "高速发展期，但马太效应加剧", hotSkill: "选品直觉 + 数据分析 + 内容创作" },
      },
    },
    film_beijing: {
      title: connectionNum > wealthNum ? "首映红毯后的落泪追梦人" : "地库硬盘搬运工的逆袭剧本",
      resonance: connectionNum > wealthNum
        ? "你在光影的世界里找到了真实。别人看到的是电影，你看到的是人生。"
        : "你懂得在梦想和现实之间搭建桥梁。搬硬盘的手，也能握住香槟杯。",
      cityMatch: { score: 83, comment: "北京是华语影视的心脏，但也是最残酷的战场。你得熬得住。" },
      mapping: {
        career: connectionNum > wealthNum ? "电影宣发策划总监 / 影视IP运营人 / 影展策展人" : "影视制片管理 / 影视投资分析 / 娱乐法务顾问",
        marketVibe: "影视行业寒冬后缓慢回暖，短剧和微短剧成为新风口。能同时懂内容和商业的复合型人才最稀缺。",
        salaryExpectation: "助理期 5k-10k/月，资深策划 15k-30k/月",
        actionItem: "今晚看一部你早就想看但一直没看的电影，看完后用3句话写出你最想告诉导演的感受。",
        careerPaths: [
          { name: "影视宣发策划", fitScore: 88, description: "为电影设计从0到爆的传播路径，既需创意又懂市场", salary: "10k-25k/月", icon: "🎬" },
          { name: "短剧/微短剧制片人", fitScore: 82, description: "在影视新赛道做轻量级内容，投资小周转快", salary: "12k-30k+/月（项目制）", icon: "📱" },
          { name: "影视IP运营", fitScore: 70, description: "把好故事变成好生意，从版权到衍生的全链路", salary: "15k-30k/月", icon: "🎭" },
        ],
        industryInsight: { name: "影视/文娱", trend: "传统影视遇冷，短剧和AI制作工具正在重塑行业格局", outlook: "结构性调整，但好内容永远有价值", hotSkill: "短剧制作 + AI辅助创作" },
      },
    },
    homestay_dali: {
      title: freedomNum > 70 ? "洱海落日里的慢时光酿酒人" : "苍山脚下的小院经营算盘手",
      resonance: freedomNum > 70
        ? "你的灵魂在洱海边找到了归处。你不需要打卡机和KPI，夕阳和歌声就是你的考勤。"
        : "你以为你想要自由，但你发现自律才是自由的底座。在大理，经营也是一种修行。",
      cityMatch: { score: 94, comment: "大理是中国最接近乌托邦的地方，但房租和淡季是真挑战。" },
      mapping: {
        career: freedomNum > 70 ? "民宿主理人 / 乡村社区营造师 / 手作体验设计师" : "精品民宿品牌运营 / 乡村文旅策划 / 在地生活方式电商",
        marketVibe: "大理民宿已进入红海，但真正有温度、有故事的精品民宿依然一座难求。未来的机会在'民宿+'模式。",
        salaryExpectation: "淡季可能亏本，旺季月入2w-8w+，年均8k-20k/月",
        actionItem: "今晚坐在窗边，不看手机，只听5分钟窗外的声音，写下你听到的3种不同的声音。",
        careerPaths: [
          { name: "精品民宿主理人", fitScore: 92, description: "在大理经营一个有灵魂的小院，自由但需要经营智慧", salary: "8k-20k/月（年波动大）", icon: "🏡" },
          { name: "乡村社区营造师", fitScore: 80, description: "连接在地文化和外来客，让乡村重新活过来", salary: "8k-15k/月", icon: "🌾" },
          { name: "在地体验设计师", fitScore: 76, description: "设计扎染、陶艺、采茶等体验活动，让旅人带走记忆", salary: "6k-12k/月", icon: "🎨" },
        ],
        industryInsight: { name: "乡村文旅/民宿", trend: "从野蛮生长走向精品化，'民宿+'模式成为突围方向", outlook: "分化严重——有故事有温度的活下来", hotSkill: "内容运营 + 在地文化挖掘" },
      },
    },
    kol_chengdu: {
      title: happyNum > 60 ? "春熙路霓虹下的灵感蒸发器" : "人民公园茶摊上的流量炼丹师",
      resonance: happyNum > 60
        ? "你的快乐有感染力。在信息过载的时代，能让人嘴角上扬的内容比黄金还贵。"
        : "你深谙传播之道，每一条内容都精确卡在了注意力的黄金分割线上。成都的慢节奏恰好给了你发酵创意的空间。",
      cityMatch: { score: 89, comment: "成都的年轻人密度和消费意愿全国领先，在这里做内容，你的受众就在楼下茶馆里。" },
      mapping: {
        career: happyNum > 60 ? "生活方式KOL / 城市体验官 / 品牌合作创意人" : "MCN内容策略师 / 私域运营专家 / 个人IP经纪人",
        marketVibe: "KOL经济进入2.0时代，纯靠颜值和流量的时代过去了。真正有审美、有态度、能带货的创作者才有长期价值。",
        salaryExpectation: "起步期 3k-8k/月，稳定变现后 1w-5w+/月",
        actionItem: "今天写一条关于你最喜欢的成都小吃的推荐文案，不超过100字，让没吃过的人立刻想去。",
        careerPaths: [
          { name: "生活方式KOL", fitScore: 90, description: "用独特的审美和态度圈粉，成都就是最好的素材库", salary: "5k-50k+/月（变现波动大）", icon: "📸" },
          { name: "品牌内容创意人", fitScore: 80, description: "帮品牌讲好故事，从乙方到自由职业都能做", salary: "10k-25k/月", icon: "✍️" },
          { name: "MCN内容策略师", fitScore: 72, description: "从台前到幕后，用经验帮更多创作者成长", salary: "12k-30k/月", icon: "📊" },
        ],
        industryInsight: { name: "内容创业/新媒体", trend: "短视频+直播成为标配，但'好内容'的标准在升级", outlook: "强者愈强，但真诚和独特始终有市场", hotSkill: "短视频创作 + 品牌合作谈判" },
      },
    },
    ecommerce_hangzhou: {
      title: wealthNum > 55 ? "四季青走廊的选品炼金术师" : "滨江仓库的退单生存大师",
      resonance: wealthNum > 55
        ? "你的商业嗅觉灵敏到可怕。别人看到的是衣服，你看到的是爆款基因和利润空间。"
        : "你在退单和差评的废墟里依然站得笔直。电商不是百米跑，是铁人三项。",
      cityMatch: { score: 87, comment: "杭州是电商之都，供应链和人才密度全国最高，你的战场选对了。" },
      mapping: {
        career: wealthNum > 55 ? "跨境电商操盘手 / 供应链整合顾问 / 选品平台合伙人" : "电商店铺运营总监 / 投流优化专家 / 电商代运营创始人",
        marketVibe: "电商竞争白热化，但跨境和品牌化是两大赛道红利。能同时搞定供应链和内容的创业者最稀缺。",
        salaryExpectation: "运营 8k-20k/月，操盘手 15k-40k/月，创业看本事",
        actionItem: "在1688上选3个你觉得有趣的小商品，写出你能想到的3个不同卖法。",
        careerPaths: [
          { name: "电商操盘手/运营总监", fitScore: 90, description: "从选品到投流到售后，全链路掌控一个店铺", salary: "15k-40k/月（含提成）", icon: "📊" },
          { name: "跨境电商创业者", fitScore: 82, description: "利用国内供应链优势做出海，杭州是最好的起点", salary: "看项目，起步5k跑通后上不封顶", icon: "🌏" },
          { name: "品牌化电商", fitScore: 72, description: "从卖货到做品牌，这条路更慢但更值钱", salary: "12k-25k/月（品牌溢价另算）", icon: "🏷️" },
        ],
        industryInsight: { name: "电商/跨境电商", trend: "内卷加剧，但跨境出海和品牌化是两大结构性机会", outlook: "赛道拥挤但机会仍在，核心是差异化", hotSkill: "跨境运营 + 品牌策划 + 数据选品" },
      },
    },
    engineer_shenzhen: {
      title: freedomNum > wealthNum ? "南山科技园的代码诗人" : "前海湾的架构苦行僧",
      resonance: freedomNum > wealthNum
        ? "在冰冷的代码行间，你藏着对优雅架构的执念。你不是码农，你是用逻辑造城堡的匠人。"
        : "你的抗压能力惊人。系统崩了，全组慌了，只有你还在一行行排查。这就是实力。",
      cityMatch: { score: 89, comment: "深圳是中国科技的心脏，南山科技园是码农的麦加。" },
      mapping: {
        career: freedomNum > wealthNum ? "独立技术顾问 / 开源贡献者 / 技术自媒体人" : "资深架构师 / 技术合伙人 / AI工程化专家",
        marketVibe: "研发岗位需求依然旺盛，但AI正在重塑技术栈。只会CRUD的工程师危机感加重，但真正懂底层的永远稀缺。",
        salaryExpectation: "中级 15k-25k/月，资深 25k-50k/月，架构师 40k-80k/月",
        actionItem: "找一个你一直想学但没时间的技术框架，花30分钟只读它的README和设计理念。",
        careerPaths: [
          { name: "资深架构师", fitScore: 92, description: "在大厂做系统架构设计，技术巅峰也是薪资巅峰", salary: "40k-80k/月", icon: "🏗️" },
          { name: "AI工程化专家", fitScore: 85, description: "把AI模型从实验室带到生产环境，最热门的转型方向", salary: "30k-60k/月", icon: "🤖" },
          { name: "独立技术顾问/自由开发者", fitScore: 70, description: "摆脱996，用技术能力换取时间自由", salary: "20k-50k/月（项目制）", icon: "🧑‍💻" },
        ],
        industryInsight: { name: "软件工程/互联网技术", trend: "AI辅助编程普及，工程师需要从'写代码'升级为'设计系统'", outlook: "结构性分化——底层能力决定天花板", hotSkill: "AI工程化 + 系统设计 + 云原生架构" },
      },
    },
    sales_suzhou: {
      title: connectionNum > wealthNum ? "园林茶会的外交官" : "工业园区深夜的签单猎手",
      resonance: connectionNum > wealthNum
        ? "你的亲和力是你的超能力。客户不是为了合同见你，是为了和你喝茶聊天。"
        : "你的狠劲和执行力让人折服。在别人还在犹豫的时候，你已经把合同签回来了。",
      cityMatch: { score: 82, comment: "苏州工业园区是外资和制造业的聚集地，B2B销售的天堂。" },
      mapping: {
        career: connectionNum > wealthNum ? "大客户关系总监 / 商务拓展合伙人 / 行业社群主理人" : "区域销售总监 / 大客户攻坚专家 / 商业谈判顾问",
        marketVibe: "B2B销售正在数字化，但大客户关系永远是核心竞争力。苏州的外资和制造业客户群给了销售人最扎实的练兵场。",
        salaryExpectation: "底薪 8k-15k/月，含提成年入20w-80w+",
        actionItem: "今天给一个你很久没联系的朋友发一条真诚的问候，不谈任何业务。",
        careerPaths: [
          { name: "大客户销售总监", fitScore: 90, description: "搞定大客户的大单，人脉+专业+韧性的综合考验", salary: "底薪15k+提成，年入30w-80w+", icon: "💼" },
          { name: "商务拓展(BD)合伙人", fitScore: 80, description: "为创业公司打开市场，高风险高回报", salary: "底薪10k+股权，弹性极大", icon: "🤝" },
          { name: "行业社群/商会运营", fitScore: 72, description: "把人脉变成平台，从做销售到做生态", salary: "10k-25k/月+会员费", icon: "🌐" },
        ],
        industryInsight: { name: "B2B销售/商务拓展", trend: "数字化工具替代了信息差，但信任和关系无法被替代", outlook: "稳定增长，人脉型销售永远稀缺", hotSkill: "客户关系管理 + 方案式销售" },
      },
    },
    tea_grower_anxi: {
      title: freedomNum > wealthNum ? "梯田云雾里的手艺守望人" : "八百度烘炉旁的品控大师",
      resonance: freedomNum > wealthNum
        ? "你对天地的敬畏让人动容。在你眼里，茶不是商品，是山川和时间写给人间的信。"
        : "你对品质的执念近乎偏执。别人觉得差不多了，你还要再翻一遍炭火。这就是匠人。",
      cityMatch: { score: 92, comment: "安溪的铁观音传承千年，你的手艺在这里有最深的根。" },
      mapping: {
        career: freedomNum > wealthNum ? "非遗手工茶传承人 / 山居茶文化主理人 / 茶道美学创作者" : "茶叶品牌创始人 / 供应链品控总监 / 茶叶电商操盘手",
        marketVibe: "传统茶文化迎来国潮复兴，但年轻人更买'体验'而不是'等级'。能把茶讲出故事的人，比会做茶的人更稀缺。",
        salaryExpectation: "自产自销 5k-15k/月，品牌化成功后 15k-40k+/月",
        actionItem: "泡一杯茶，闭上眼只闻不喝，用3个词写出你闻到的东西。",
        careerPaths: [
          { name: "非遗手工茶传承人", fitScore: 92, description: "守护铁观音古法技艺，文化价值远超商业价值", salary: "8k-20k/月（非遗补贴+自销）", icon: "🍵" },
          { name: "茶文化内容创作者", fitScore: 82, description: "用短视频讲茶的故事，让年轻人重新爱上茶", salary: "5k-25k+/月（内容变现）", icon: "📱" },
          { name: "茶叶品牌创始人", fitScore: 70, description: "从做茶到做品牌，让安溪铁观音走向更远的市场", salary: "看品牌发展，弹性极大", icon: "🏷️" },
        ],
        industryInsight: { name: "茶产业/非遗传承", trend: "国潮+短视频让传统茶文化重新破圈，但标准化和品牌化仍是瓶颈", outlook: "文化价值看涨，但商业变现需要创新", hotSkill: "内容创作 + 品牌运营 + 直播带货" },
      },
    },
  };

  const fallback = fallbacks[tid] || {
    title: "城市自洽探索家",
    resonance: "你做出了极具个性的模拟决策。你在追求物质生活保障的同时，对自我自由和内心的宁静保留了妥帖的边界线，善于在现实与情怀间架起平衡之桥。",
    cityMatch: { score: 80, comment: "在城市大舞台中保持抽离与自守，能让你随时退回自己的温暖小防线。" },
    mapping: {
      career: "生活方式内容策展人 / 创意全栈顾问",
      marketVibe: "大众对机械性单一岗位的依赖性正在下降。具备跨界能力、懂体验且掌握多栖变现触角的自洽斜杠人才，在这座城市里将享有极致的自由。",
      salaryExpectation: "约 12k - 24k/月，虽然收入有波动性，但综合自洽度极高",
      actionItem: "去家楼下的小便利店买一瓶冷泡茶，花10分钟在白纸上勾勒出它的包装，并写下 3 处最让你想吐槽的设计累赘。",
    },
  };

  return {
    title: fallback.title || "城市自洽探索家",
    resonance: fallback.resonance || "",
    cityMatch: fallback.cityMatch || { score: 80, comment: "" },
    mapping: fallback.mapping || { career: "", marketVibe: "", salaryExpectation: "", actionItem: "" },
  };
};

// ============================================
// Fallback Report Generator (no AI available)
// ============================================
const generateFallbackReport = (profile: any, trialResults: any[], favoriteJobs: string[]): ReportResult => {
  const freedomWeight = profile?.dimensionWeights?.freedom ?? 50;
  const connectionWeight = profile?.dimensionWeights?.connection ?? 50;
  const wealthWeight = profile?.dimensionWeights?.wealth ?? 50;
  const peaceWeight = profile?.dimensionWeights?.peace ?? 50;

  // 从试玩结果中取平均维度值
  let freedomScore = freedomWeight, connectionScore = connectionWeight, wealthScore = wealthWeight, peaceScore = peaceWeight;
  if (trialResults.length > 0) {
    const avg = (key: string) => {
      const vals = trialResults.map((t: any) => t.finalStats?.[key] ?? 50);
      return Math.round(vals.reduce((a: number, b: number) => a + b, 0) / vals.length);
    };
    freedomScore = avg("freedom") || avg("happiness") || freedomWeight;
    connectionScore = avg("connection") || connectionWeight;
    wealthScore = avg("wealth") || avg("growth") || wealthWeight;
    peaceScore = avg("peace") || avg("health") || peaceWeight;
  }

  const topDimension = freedomScore >= connectionScore && freedomScore >= wealthScore && freedomScore >= peaceScore
    ? "freedom" : connectionScore >= wealthScore && connectionScore >= peaceScore
    ? "connection" : wealthScore >= peaceScore ? "wealth" : "peace";

  const jobRecommendations: Record<string, ReportResult> = {
    freedom: {
      userSummary: "你是一个极度渴望自由的人。在试玩中，你总是优先选择能给自己留出空间的路径，不愿被规则和框架束缚。你的灵魂需要呼吸感。",
      dimensionAnalysis: {
        freedom: { score: freedomScore, analysis: "自由是你最核心的驱动力，你无法忍受被束缚和限制" },
        connection: { score: connectionScore, analysis: "你重视连接但不依赖，喜欢自由度高的社交方式" },
        wealth: { score: wealthScore, analysis: "财富对你来说是自由的工具，而非终极目标" },
        peace: { score: peaceScore, analysis: "内心平和来自自主权，而非外在的安静" },
      },
      recommendedJobs: [
        { name: "自由职业设计师", matchScore: 92, reason: "完全掌控自己的时间和项目，自由度拉满", salary: "10k-35k" },
        { name: "数字游民内容创作者", matchScore: 85, reason: "边旅行边工作，用创作换取自由生活", salary: "8k-30k" },
        { name: "独立咨询顾问", matchScore: 78, reason: "按项目合作，灵活安排时间与客户", salary: "15k-40k" },
      ],
      actionItems: [
        { text: "下载一个自由职业平台App，浏览30分钟，感受一下有哪些你可以接的项目", timeline: "今天", category: "explore" },
        { text: "学一个可以远程工作的技能（比如Figma基础操作），每天20分钟", timeline: "本周", category: "learn" },
        { text: "尝试在社交媒体发一篇专业领域的内容，测试自由职业的水温", timeline: "本月", category: "practice" },
      ],
      overallAdvice: "你的自由基因非常强烈，不要勉强自己进入高度结构化的工作。先从副业或项目制合作开始，逐步建立自己的自由工作体系。记住：自由不等于散漫，自律才是自由的底座。",
    },
    connection: {
      userSummary: "你天生就是连接者。在试玩中，你总是倾向于选择和人打交道的路径，你从关系中获得能量和意义感。你的温暖是稀缺资源。",
      dimensionAnalysis: {
        freedom: { score: freedomScore, analysis: "你需要一定自由度，但更看重与人共事的空间" },
        connection: { score: connectionScore, analysis: "连接是你的氧气，你在人群中找到归属和价值" },
        wealth: { score: wealthScore, analysis: "财富对你来说是安全感的来源，也是照顾他人的底气" },
        peace: { score: peaceScore, analysis: "你追求的关系中的平和，而非独处的安静" },
      },
      recommendedJobs: [
        { name: "大客户经理", matchScore: 90, reason: "你的共情力和沟通天赋在B2B领域极度吃香", salary: "12k-30k" },
        { name: "社区运营/用户增长", matchScore: 85, reason: "把连接力变成增长力，用温度驱动数据", salary: "10k-25k" },
        { name: "人力资源顾问", matchScore: 78, reason: "理解人、连接人、成就人，这是你的天赋赛道", salary: "12k-28k" },
      ],
      actionItems: [
        { text: "给3个很久没联系的朋友发一条真诚的问候，不聊任何业务", timeline: "今天", category: "explore" },
        { text: "参加一个你感兴趣的线下活动或线上社群，认识3个新朋友", timeline: "本周", category: "learn" },
        { text: "尝试组织一次小型聚会或线上分享会，练习你的连接领导力", timeline: "本月", category: "practice" },
      ],
      overallAdvice: "你的社交天赋是真正的竞争力。不要低估'让人舒服'这个能力——在AI时代，这比任何硬技能都稀缺。把连接力变成职业力，你可以在商业世界中找到属于自己的温暖位置。",
    },
    wealth: {
      userSummary: "你对财富有清醒的认知和务实的追求。在试玩中，你总是在资源分配时做出最优选择，你有极强的商业直觉和风险意识。",
      dimensionAnalysis: {
        freedom: { score: freedomScore, analysis: "自由对你来说是财富的附属品，先有钱再谈自由" },
        connection: { score: connectionScore, analysis: "你理解人脉的价值，但更看重资源的实际回报" },
        wealth: { score: wealthScore, analysis: "财富是你的核心驱动力，你有明确的物质目标和规划" },
        peace: { score: peaceScore, analysis: "平和来自财务安全，存款数字让你安心" },
      },
      recommendedJobs: [
        { name: "金融分析师/投资经理", matchScore: 92, reason: "你的数字敏感度和风险意识是天生的金融基因", salary: "20k-50k" },
        { name: "电商运营总监", matchScore: 85, reason: "商业嗅觉+执行力，在电商赛道把直觉变现", salary: "15k-35k" },
        { name: "创业公司合伙人", matchScore: 80, reason: "你的财富野心和抗压能力适合从0到1的冒险", salary: "看项目，上不封顶" },
      ],
      actionItems: [
        { text: "下载一个理财App，花15分钟了解一个你从没接触过的投资品类", timeline: "今天", category: "explore" },
        { text: "找一个你感兴趣的行业，研究它的商业模式和盈利逻辑", timeline: "本周", category: "learn" },
        { text: "尝试做一个最小化商业验证：卖一个东西，哪怕只赚1块钱", timeline: "本月", category: "practice" },
      ],
      overallAdvice: "你的财富直觉是真正的竞争力。但要注意：钱是工具不是终点，别让数字绑架了生活。在追逐财富的同时，给自己留一些'不值得但很快乐'的预算——那才是活着的意义。",
    },
    peace: {
      userSummary: "你是一个追求内心平和的人。在试玩中，你总是选择让自己更舒适、更安定的路径。你不贪心，但你知道什么能让自己真正幸福。",
      dimensionAnalysis: {
        freedom: { score: freedomScore, analysis: "你需要自由来保持内心的平静，但不是无边界的那种" },
        connection: { score: connectionScore, analysis: "你偏好深度而稳定的关系，而非广泛的社交" },
        wealth: { score: wealthScore, analysis: "财富对你来说是安全垫，够用就好" },
        peace: { score: peaceScore, analysis: "平和是你的生命线，你比任何人都清楚什么让你安心" },
      },
      recommendedJobs: [
        { name: "高校教师/研究员", matchScore: 90, reason: "稳定的节奏、深度思考的空间、被尊重的职业身份", salary: "10k-25k" },
        { name: "心理咨询师", matchScore: 85, reason: "你的平和气质是治愈他人的最好工具", salary: "8k-25k" },
        { name: "公务员/事业单位", matchScore: 80, reason: "稳定、体面、有时间过自己的生活", salary: "8k-20k" },
      ],
      actionItems: [
        { text: "找一个安静的角落，花10分钟什么都不做，只是感受自己的呼吸", timeline: "今天", category: "explore" },
        { text: "读一本关于正念或心理学的书，每天读20页", timeline: "本周", category: "learn" },
        { text: "尝试做一次5分钟的冥想练习，持续一周，观察内心的变化", timeline: "本月", category: "practice" },
      ],
      overallAdvice: "你拥有很多人花一辈子都找不到的能力：知道自己想要什么。不要因为社会说'要奋斗'就否定自己的选择。平和不是躺平，是一种高级的智慧。守住你的节奏，就是最大的成功。",
    },
  };

  return jobRecommendations[topDimension] || jobRecommendations.freedom;
};

// ============================================
// API: Career Mapping (AI Generation)
// ============================================
app.post("/api/map-career", async (req, res) => {
  const { trialId, trialTitle, choices, reflection, finalStats, _forceFallback } = req.body;

  // 如果前端请求强制使用 fallback（AI 超时后重试）
  if (_forceFallback) {
    return res.json(generateFallbackResponse(trialId, finalStats));
  }

  // Build choices summary
  const choicesSummary = choices
    .map((c: any) => `[${c.time} - ${c.scenario || c.sceneTitle}] 选择了: "${c.selectedOption || c.text}"`)
    .join("\n");

  const params: CareerMappingParams = {
    trialId,
    trialTitle,
    choicesSummary,
    reflection: reflection || "未填写",
    finalStats: {
      happiness: finalStats?.happiness || Math.round(((finalStats?.freedom || 50) + (finalStats?.connection || 50)) / 2),
      health: finalStats?.health || finalStats?.peace || 50,
      stress: finalStats?.stress || Math.max(10, 100 - (finalStats?.peace || 50)),
      growth: finalStats?.growth || finalStats?.wealth || 50,
    },
  };

  try {
    const provider = getAIProvider();
    const result = await provider.generateCareerMapping(params);
    return res.json({ ...result, _provider: provider.name });
  } catch (err) {
    console.error("[API] AI generation failed, using fallback:", err);
    return res.json(generateFallbackResponse(trialId, finalStats));
  }
});

// ============================================
// API: Save Trial Result (Supabase)
// ============================================
app.post("/api/save-result", async (req, res) => {
  if (!supabase) {
    return res.status(503).json({ error: "Database not configured" });
  }

  try {
    const { result, choices } = req.body;

    // Insert main result
    const { data: insertedResult, error: resultError } = await supabase
      .from("trial_results")
      .insert({
        id: result.id,
        trial_id: result.trialId,
        trial_title: result.trialTitle,
        city: result.city,
        career_title: result.careerTitle,
        resonance: result.resonance,
        city_match_score: result.cityMatchScore,
        city_match_comment: result.cityMatchComment,
        mapped_career: result.mappedCareer,
        market_vibe: result.marketVibe,
        salary_expectation: result.salaryExpectation,
        action_item: result.actionItem,
        happiness: result.stats?.happiness,
        health: result.stats?.health,
        stress: result.stats?.stress,
        growth: result.stats?.growth,
        wealth: result.stats?.wealth,
        freedom: result.stats?.freedom,
        connection: result.stats?.connection,
        peace: result.stats?.peace,
        ai_provider: result.aiProvider || "unknown",
      })
      .select()
      .single();

    if (resultError) {
      console.error("[DB] Error saving result:", resultError);
      return res.status(500).json({ error: "Failed to save result" });
    }

    // Insert choices if provided
    if (choices && choices.length > 0) {
      const choicesData = choices.map((c: any, idx: number) => ({
        result_id: result.id,
        choice_order: idx,
        time_label: c.time,
        scene_title: c.sceneTitle,
        selected_option: c.selectedOption,
        narration_result: c.narrationResult || null,
        effect_happiness: c.effects?.happiness || 0,
        effect_health: c.effects?.health || 0,
        effect_stress: c.effects?.stress || 0,
        effect_growth: c.effects?.growth || 0,
        effect_wealth: c.effects?.wealth || 0,
        effect_freedom: c.effects?.freedom || 0,
        effect_connection: c.effects?.connection || 0,
        effect_peace: c.effects?.peace || 0,
      }));

      const { error: choicesError } = await supabase
        .from("trial_choices")
        .insert(choicesData);

      if (choicesError) {
        console.error("[DB] Error saving choices:", choicesError);
        // Don't fail the whole request - main result is saved
      }
    }

    // Refresh leaderboard in background (non-critical)
    supabase.rpc("refresh_leaderboard").then((r: any) => {
      console.log("[DB] Leaderboard refreshed.");
    }).catch((e: any) => {
      // Ignore - non-critical
    });

    return res.json({ success: true, data: insertedResult || null });
  } catch (err) {
    console.error("[API] Error in save-result:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// ============================================
// API: Get Results History
// ============================================
app.get("/api/results", async (req, res) => {
  if (!supabase) {
    return res.status(503).json({ error: "Database not configured" });
  }

  try {
    const limit = Math.min(parseInt(req.query.limit as string) || 50, 100);
    const offset = parseInt(req.query.offset as string) || 0;

    const { data, error } = await supabase
      .from("trial_results")
      .select("id, created_at, trial_id, trial_title, city, career_title, city_match_score, happiness, health, stress, growth")
      .eq("is_deleted", false)
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      console.error("[DB] Error fetching results:", error);
      return res.status(500).json({ error: "Failed to fetch results" });
    }

    return res.json({ data, count: data?.length || 0 });
  } catch (err) {
    console.error("[API] Error in get-results:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// ============================================
// API: Get Single Result Detail
// ============================================
app.get("/api/results/:id", async (req, res) => {
  if (!supabase) {
    return res.status(503).json({ error: "Database not configured" });
  }

  try {
    const { id } = req.params;

    const { data: result, error: resultError } = await supabase
      .from("trial_results")
      .select("*")
      .eq("id", id)
      .eq("is_deleted", false)
      .single();

    if (resultError || !result) {
      return res.status(404).json({ error: "Result not found" });
    }

    // Also get choices
    const { data: choices } = await supabase
      .from("trial_choices")
      .select("*")
      .eq("result_id", id)
      .order("choice_order", { ascending: true });

    return res.json({ data: { ...(result as any), choices: choices || [] } });
  } catch (err) {
    console.error("[API] Error in get-result-detail:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// ============================================
// API: Delete Result (soft delete)
// ============================================
app.delete("/api/results/:id", async (req, res) => {
  if (!supabase) {
    return res.status(503).json({ error: "Database not configured" });
  }

  try {
    const { id } = req.params;

    const { error } = await supabase
      .from("trial_results")
      .update({ is_deleted: true } as any)
      .eq("id", id);

    if (error) {
      console.error("[DB] Error deleting result:", error);
      return res.status(500).json({ error: "Failed to delete result" });
    }

    return res.json({ success: true });
  } catch (err) {
    console.error("[API] Error in delete-result:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// ============================================
// API: Leaderboard
// ============================================
app.get("/api/leaderboard", async (req, res) => {
  if (!supabase) {
    return res.status(503).json({ error: "Database not configured" });
  }

  try {
    const limit = Math.min(parseInt(req.query.limit as string) || 20, 50);

    const { data, error } = await supabase
      .from("leaderboard")
      .select("*")
      .limit(limit);

    if (error) {
      console.error("[DB] Error fetching leaderboard:", error);
      return res.status(500).json({ error: "Failed to fetch leaderboard" });
    }

    return res.json({ data });
  } catch (err) {
    console.error("[API] Error in leaderboard:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// ============================================
// API: Trial Stats
// ============================================
app.get("/api/stats", async (req, res) => {
  if (!supabase) {
    return res.status(503).json({ error: "Database not configured" });
  }

  try {
    const { data, error } = await supabase
      .from("trial_stats")
      .select("*")
      .order("play_count", { ascending: false });

    if (error) {
      console.error("[DB] Error fetching stats:", error);
      return res.status(500).json({ error: "Failed to fetch stats" });
    }

    return res.json({ data });
  } catch (err) {
    console.error("[API] Error in stats:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// ============================================
// API: Trials (职业副本 CRUD - 支持实时更新)
// ============================================

// 获取所有上线的副本
app.get("/api/trials", async (_req, res) => {
  if (!supabase) {
    return res.status(503).json({ error: "Database not configured" });
  }

  try {
    const { data, error } = await supabase
      .from("trials")
      .select("*")
      .eq("is_active", true)
      .eq("is_deleted", false)
      .order("sort_order", { ascending: true });

    if (error) {
      console.error("[DB] Error fetching trials:", error);
      return res.status(500).json({ error: "Failed to fetch trials" });
    }

    return res.json({ data });
  } catch (err) {
    console.error("[API] Error in get-trials:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// 获取单个副本详情
app.get("/api/trials/:id", async (req, res) => {
  if (!supabase) {
    return res.status(503).json({ error: "Database not configured" });
  }

  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from("trials")
      .select("*")
      .eq("id", id)
      .eq("is_deleted", false)
      .single();

    if (error || !data) {
      return res.status(404).json({ error: "Trial not found" });
    }

    return res.json({ data });
  } catch (err) {
    console.error("[API] Error in get-trial:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// 新增/更新副本（需要 service_role key 或后台操作）
app.put("/api/trials/:id", async (req, res) => {
  if (!supabase) {
    return res.status(503).json({ error: "Database not configured" });
  }

  try {
    const { id } = req.params;
    const body = req.body;

    const updateData: any = {};
    if (body.title !== undefined) updateData.title = body.title;
    if (body.subtitle !== undefined) updateData.subtitle = body.subtitle;
    if (body.career !== undefined) updateData.career = body.career;
    if (body.city !== undefined) updateData.city = body.city;
    if (body.lifestyle !== undefined) updateData.lifestyle = body.lifestyle;
    if (body.vibe !== undefined) updateData.vibe = body.vibe;
    if (body.duration !== undefined) updateData.duration = body.duration;
    if (body.coverImage !== undefined) updateData.cover_image = body.coverImage;
    if (body.difficulty !== undefined) updateData.difficulty = body.difficulty;
    if (body.freedom !== undefined) updateData.freedom = body.freedom;
    if (body.connection !== undefined) updateData.connection = body.connection;
    if (body.wealth !== undefined) updateData.wealth = body.wealth;
    if (body.peace !== undefined) updateData.peace = body.peace;
    if (body.scenarios !== undefined) updateData.scenarios = body.scenarios;
    if (body.sortOrder !== undefined) updateData.sort_order = body.sortOrder;
    if (body.isActive !== undefined) updateData.is_active = body.isActive;

    const { data, error } = await supabase
      .from("trials")
      .upsert({ id, ...updateData })
      .select()
      .single();

    if (error) {
      console.error("[DB] Error upserting trial:", error);
      return res.status(500).json({ error: "Failed to upsert trial" });
    }

    return res.json({ success: true, data });
  } catch (err) {
    console.error("[API] Error in upsert-trial:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// 下线副本（软删除）
app.delete("/api/trials/:id", async (req, res) => {
  if (!supabase) {
    return res.status(503).json({ error: "Database not configured" });
  }

  try {
    const { id } = req.params;

    const { error } = await supabase
      .from("trials")
      .update({ is_deleted: true } as any)
      .eq("id", id);

    if (error) {
      console.error("[DB] Error deleting trial:", error);
      return res.status(500).json({ error: "Failed to delete trial" });
    }

    return res.json({ success: true });
  } catch (err) {
    console.error("[API] Error in delete-trial:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// ============================================
// API: Generate Report (AI Generation)
// ============================================
app.post("/api/generate-report", async (req, res) => {
  const { profile, trialResults, favoriteJobs, _forceFallback } = req.body;

  // 如果前端请求强制使用 fallback（AI 超时后重试）
  if (_forceFallback) {
    return res.json(generateFallbackReport(profile, trialResults || [], favoriteJobs || []));
  }

  const params: GenerateReportParams = {
    profile: profile || {},
    trialResults: trialResults || [],
    favoriteJobs: favoriteJobs || [],
  };

  try {
    const provider = getAIProvider();
    const result = await provider.generateReport(params);
    return res.json({ ...result, _provider: provider.name });
  } catch (err) {
    console.error("[API] Report AI generation failed, using fallback:", err);
    return res.json(generateFallbackReport(profile, trialResults || [], favoriteJobs || []));
  }
});

// ============================================
// API: Health Check
// ============================================
app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    services: {
      database: supabase ? "connected" : "not configured",
      ai: getAIProvider().name,
    },
  });
});

// ============================================
// Static / Vite serving
// ============================================
async function start() {
  if (process.env.NODE_ENV !== "production") {
    // Development Mode
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
    console.log("[Dev] Vite middleware attached.");
  } else {
    // Production Mode
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
    console.log(`[Prod] Serving static files from ${distPath}.`);
  }

  app.listen(Number(PORT), "0.0.0.0", () => {
    console.log(`[Life Trial] Server running at http://0.0.0.0:${PORT}`);
    console.log(`[AI] Provider: ${getAIProvider().name}`);
    console.log(`[DB] Supabase: ${supabase ? "connected" : "not configured"}`);
  });
}

start();
