import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();
app.use(express.json());

const PORT = 3000;

// Initialize Gemini safely
let ai: GoogleGenAI | null = null;
const apiKey = process.env.GEMINI_API_KEY;

if (apiKey && apiKey !== "MY_GEMINI_API_KEY" && apiKey !== "") {
  try {
    ai = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
    console.log("Successfully initialized Gemini API client.");
  } catch (err) {
    console.error("Failed to initialize Gemini Client:", err);
  }
} else {
  console.log("No valid GEMINI_API_KEY provided. Server-side custom routing will fallback to deterministic smart responses.");
}

// REST API for Career Mapping
app.post("/api/map-career", async (req, res) => {
  const { trialId, trialTitle, choices, reflection, finalStats } = req.body;

  // Set up logical fallbacks in case Gemini is unavailable or errors
  const generateFallbackResponse = (tid: string, stats: any) => {
    // Enable seamless compatibility between original and new metrics:
    const happyNum = Number(stats?.happiness !== undefined ? stats.happiness : (stats?.freedom !== undefined ? (stats.freedom + (stats.connection || 50)) / 2 : 50));
    const healthNum = Number(stats?.health !== undefined ? stats.health : (stats?.peace !== undefined ? stats.peace : 50));
    const stressNum = Number(stats?.stress !== undefined ? stats.stress : (stats?.peace !== undefined ? Math.max(10, 100 - stats.peace) : 50));
    const growthNum = Number(stats?.growth !== undefined ? stats.growth : (stats?.wealth !== undefined ? stats.wealth : 50));

    // Map these variables as fallback parameters logically below
    const wealthNum = growthNum;
    const freedomNum = happyNum;
    const connectionNum = happyNum;
    const peaceNum = healthNum;

    let title = "城市自洽探索家";
    let resonance = "你做出了极具个性的模拟决策。你在追求物质生活保障的同时，对自我自由和内心的宁静保留了妥帖的边界线，善于在现实与情怀间架起平衡之桥。";
    let career = "生活方式内容策展人 / 创意全栈顾问";
    let marketVibe = "大众对机械性单一岗位的依赖性正在下降。具备跨界能力、懂体验且掌握多栖变现触角的自洽斜杠人才，在这座城市里将享有极致的自由。";
    let salaryExpectation = "约 12k - 24k/月，虽然收入有波动性，但综合自洽度极高";
    let actionItem = "去家楼下的小便利店买一瓶冷泡茶，花10分钟在白纸上勾勒出它的包装，并写下 3 处最让你想吐槽的设计累赘。";
    let cityScore = 80;
    let cityComment = "在城市大舞台中保持抽离与自守，能让你随时退回自己的温暖小防线。";

    if (tid === "pm_shanghai") {
      cityScore = 80;
      cityComment = "上海高密度的精细效率与你的职业敏锐度完美合流。";
      salaryExpectation = "15k - 35k/月，具有强悍的生活保障";
      marketVibe = "互联网迈向精细存量经营，跨团队全量沟通与体验自愈能力已成为各大厂产品战略专家安身立命的不二外挂。";
      if (freedomNum > wealthNum) {
        title = "外滩落日下的带薪留白分析师";
        resonance = "虽然身处高压运转的产品链条核心，你内心却深藏着黄浦江落日的温柔浪漫。通过带薪摸鱼，你绝不容许自己的心跳节奏被PPT烤干。";
        career = "全栈产品体验顾问 / 自由行旅游规划经理 / 策展人助理";
        actionItem = "下载任意 3 个最新发售的极简App，画出它们最令你舒适的3个微小微交互，贴在房门背后。";
      } else {
        title = "高频咬合的十六宫格汇报特工";
        resonance = "大厂游戏规则的极客玩家！你能瞬间给出最合理的性价比与故障归因策略。大厂有你的盾牌，亦有你的黄金舞台。";
        career = "跨国大厂高级产品经理 / 商业策略分析师 / 敏捷教练";
        actionItem = "挑选一个你平时高频使用的外卖或打车App，撰写 80 字内的改进小点子投递给前台。";
      }
    } else if (tid === "designer_hangzhou") {
      cityScore = 85;
      cityComment = "西湖苍翠的烟雨与你的创意画框浑然天成，是天生的创意栖息所。";
      salaryExpectation = "8k - 22k/月，打造独立IP成功后收益上不封顶";
      marketVibe = "AI绘画爆发让虚伪套件贬值，但拥有执着个人温度笔触、善于留白的独立手艺IP，具有无价的商业感召力。";
      if (freedomNum > 70) {
        title = "西湖边野生像素牧羊人";
        resonance = "你的自由指数简直爆表！对你来说，格子间就是风干灵魂的烘干机，大自然露珠与自由漫步才是你的创意亲娘。";
        career = "独立插画师 / 视觉大厂原画师 / 跨界美学主理人";
        actionItem = "拿出口袋里的手机，去路边至少拍摄10张不同草木、生锈井盖或破旧砖缝的细节质感，做成自愈色板。";
      } else {
        title = "像素艺术与商业变现魔术师";
        resonance = "你极擅长用美感笔触兑换现实的筹码，在自己不可退让的设计底线和金主不合理的改动间跳一支优雅的双人舞。";
        career = "新媒体设计总监 / 顶尖品牌美学合伙人 / 创意买手";
        actionItem = "找出一款你常去的创意自媒体，设计一处既不伤大雅、又能温柔盈利的暖心治愈角落，写在便签上。";
      }
    } else if (tid === "ai_beijing") {
      cityScore = 88;
      cityComment = "中关村的宏大智能革命与你深邃、孤寂的深奥理智灵魂达成完美共振。";
      salaryExpectation = "25k - 60k/月，金字塔塔尖的绝佳技能高溢价";
      marketVibe = "AI极速演进。在这个战局，最无价的是那些懂底层数学原理、对真实的凡尘又饱有深刻叹气 and 悲悯的极客。";
      if (peaceNum > connectionNum) {
        title = "中关村深夜显卡轰鸣旁的隐学者";
        resonance = "在这场拼命刷点炫技的科技大浪中，你依然执着于对本源公式、无序堆栈和纯粹逻辑算法的冷静抚摸。";
        career = "AI大模型算法架构师 / 顶级量化策略研究员 / 前沿科学顾问";
        actionItem = "闭上气，回忆你写下的最初一行代码或第一行“Hello World”，感受那一颗初心如何决定了今天的星河。";
      } else {
        title = "重度知识开源社群灯塔领航员";
        resonance = "你渴望人机高维共融的可能。你总是在代码的冰山底层细嗅极客之间的温情和可贵链接，极富布道师魅力。";
        career = "技术布道师 (Advocate) / 科技创客合伙人 / 极客社区主理人";
        actionItem = "在 GitHub 上找到一个处于极其早期的开源小仓库，向它提交一份中文指引 README 说明或一处拼写 PR。";
      }
    } else if (tid === "lawyer_beijing") {
      cityScore = 83;
      cityComment = "北京朝阳区红圈所的高燃竞技，正在淬炼你词句无瑕、逻辑扎实的法理刺刀。";
      salaryExpectation = "20k - 50k/月，伴有极佳的大所合伙人前景";
      marketVibe = "出海风暴和商事重组合规日严。懂流利双语、对免责红线有着极端感知的律师，是企业扫雷的真正无价重臣。";
      if (peaceNum > 60) {
        title = "国贸大厦里的体温法典保护官";
        resonance = "在寸土寸金、人心高寒的写字楼里，你依然愿意对实习生 and 弱者交付你干净、诚恳的暖意。你不是在大厂理线，你是在守护人的呼吸。";
        career = "商事重组法务 / 自媒体法律博主 / 青年成长调解导师";
        actionItem = "翻出一份你以前签过的和租协议，花 10 分钟排查里面是否有对你不对等、不合理的单向责权条款。";
      } else {
        title = "法理长枪与离岸架构完美策划者";
        resonance = "你对规则边缘了如指掌。你是个高妙而无情的棋手，能在最紧急的听证签字与资金解汇红线里，精准布下不败大局。";
        career = "红圈并购高级律师 / 离岸风险对冲合伙人 / 家族财富保障主管";
        actionItem = "搜寻一个经典的反垄断扫雷大案例，深入阅读其 100 字内官方结论，感受法理文字极致的严密与对称美。";
      }
    } else if (tid === "hotel_mgr_hongkong") {
      cityScore = 86;
      cityComment = "流金四溢的维港璀璨，契合了你对高奢服务与极细细节的精致把度。";
      salaryExpectation = "15k - 35k/月，流金岁月的奢华待遇";
      marketVibe = "现代高奢旅店转型为“情绪奢华”和“身心抚慰”。深通情商拉锯、遇惊不动的前台领班是高端度假的高燃盾牌。";
      title = "维港璀璨前的情绪美学大按摩师";
      resonance = "你是天生的奢华交谊舞者。所有的无理投诉或突来暴雨灾难，都在你躬送的暖心姜茶和红酒里，融化为了品牌最贵重的活名信。";
      career = "五星套房大主管 / 高端艺术展礼宾司 / 奢品尊享服务顾问";
      actionItem = "尝试在明日与便利店员、电梯卫士交错的 3 秒内，交付一次极其松弛、温和、富有体温的微笑与目光致谢。";
    } else if (tid === "flight_attendant_shenzhen") {
      cityScore = 84;
      cityComment = "深圳极速且轻盈的漂移，完美划出了你飞行在云端与暮色风里的美丽时区线。";
      salaryExpectation = "10k - 22k/月，具有云端高飞加成";
      marketVibe = "国际航线复苏。懂高空幽闭心理疏解、面对高压强风而笑靥如花的敏感乘务管家深受喜爱。";
      title = "万米气流中和解凡尘燥鸣的云端旅人";
      resonance = "你具有极其轻盈的身段。在万米雷雨与头等舱乘客的咆哮中，你用温热的毛巾悄抚凡尘焦躁。你把无限的坚韧，收置在无瑕的优雅制服背后。";
      career = "国际航班乘务主管 / 跨国商务沟通官 / 高端大健康情绪向导";
      actionItem = "回家拉紧窗帘，闭上眼，感受身体背脊在无微信震动下的深长呼吸，用一次酣睡物理回归温暖重力大地。";
    } else if (tid === "police_officer_qingdao") {
      cityScore = 88;
      cityComment = "青岛咸潮的海风，与你踏实守护社区老街、热汗执盾的纯真底色极度合拍。";
      salaryExpectation = "6k - 12k/月，无后顾之忧的稳定守护";
      marketVibe = "基层治安向“合力共情、突发情绪热点干停、柔性社会关系缝补”升级，满身烟火气的帅气民警极受欢迎。";
      title = "红瓦绿树间的凡俗市井执盾人";
      resonance = "码头鬼秤纠纷、老人的漏水天花板、防波堤暴风巨浪，是你带枪盾牌背后的最大执力关怀。你用踏实的双手，缝补了这片海边社区的冰冷。";
      career = "社区营造专家 / 地方公共保障经理 / 非营利应急组长";
      actionItem = "去家附近最老旧的生活菜市，静静记录叔叔阿姨买菜吐槽、市井闲扯中的 3 句最好玩、最治愈的地方顺口溜。";
    } else if (tid === "livestream_guangzhou") {
      cityScore = 85;
      cityComment = "广州越秀老街的深夜精酿霓虹，与不眠带货大促，完美托牢你这颗狂飙明星。";
      salaryExpectation = "15k - 45k/月 + 高额交易佣金分成";
      marketVibe = "直播泡沫刺孔。大喊虚高时代终结，懂得把粉丝老铁视为重金依靠、甚至情愿自掏赔付、富有街头豪侠气的主播正成为真正的王者。";
      title = "珠江晚风前的热血爆单大侠客";
      resonance = "在错标天价和礼包拉锯的风暴前，你的一拍大腿“我赔！”彰显了最顶级的公关直觉与江湖侠气。虽然吼至声音微沙，但你饱有最炽热的体温。";
      career = "高人气直播间首席主播 / 直播公关战略专家 / 个人IP短视频制作总监";
      actionItem = "卸完妆之后，不带任何手机和促销任务，去晚风渐起的江滩漫步，听一听不用大打折、纯粹金闪闪的水浪声。";
    } else if (tid === "film_beijing") {
      cityScore = 85;
      cityComment = "朝阳名利场的首映香槟红毯，最能淬炼你极其敏锐、带有闪光灯感的光影脑叶。";
      salaryExpectation = "8k - 18k/月 + 票房高燃首映津贴";
      marketVibe = "院线电影大浪淘洗。宣发不再依赖机械式控评和注水，主创一封自来水初心信和真挚真心的对话，更能让迷途观众捍卫票房。";
      title = "璀璨闪光灯盲区里的亮马河畔看客";
      resonance = "你深爱大银幕的绮华梦幻，但在一顿闪光拍摄和投资人香槟会后，你更喜欢背起包，去亮马河买盒热饺子。你有一双明察泡沫、脚踩大地的慧眼。";
      career = "新锐大制片商务专家 / 创意视觉策展总监 / 独立影视编剧顾问";
      actionItem = "手机搜索一张你以前看了两遍、虽然豆瓣评分不高但对你有重要人生慰藉的冷门电影海报，截屏设置为主背景，守住初心。";
    } else if (tid === "homestay_dali") {
      cityScore = 90;
      cityComment = "大理日月的苍雪洱海，温柔收置了你渴求深大留白、荡漾灵魂的浪漫白云。";
      salaryExpectation = "5k - 15k/月，账面微薄，但生命体验极其奢侈";
      marketVibe = "大理民宿告别恶性竞争，全方位向“非物质文化体验、身心抚愈换工、大自然观察”演进。不靠金元，全凭主理人的一颗本心。";
      title = "苍山火塘围炉旁的最闲散歌者";
      resonance = "你接纳无筹北漂、用松鼠木香熨平城市博主的躁郁，在洱海篝火旁与隔壁老叔提啤高唱。你已然拆毁了重檐牢宇，获得了世间最珍贵的平静之光。";
      career = "身心疗愈营主理人 / 地方民艺合伙人 / 漫生活旅居作家";
      actionItem = "翻出收藏夹里落灰已久的木吉他或速写板，花10分钟胡涂乱画、任性弹拨，完成一次内心最大、无拘的诗意倾泻。";
    } else if (tid === "hr_shenzhen") {
      cityScore = 80;
      cityComment = "搞钱效率至上、淘汰极度迅速的深漂科技园，虽然步履急匆，但你的温暖人文能量照亮了微光的归途。";
      title = "搞钱热浪下悄悄递上热茶的人性温暖守护者";
      resonance = "在空间密集的搞钱科技园里，你依然像一位坚定的行路人那样极力捍卫着对普通打工人至为珍贵的同理热诚和人性尊严。";
      career = "资深雇主品牌推广专家 / 企业组织健康战略顾问 / 心理治愈沟通顾问";
      salaryExpectation = "10k-25k/月，具有很强的职业咬合性";
      marketVibe = "企业越来越重视员工的心理健康、离职安置的人文关怀，以及雇主品牌建设。懂温度的HR是顶级的润滑剂。";
      actionItem = "准备一小盒甜糖，明天在办公室，给两个平时压力极大的研发或运营同学分发，看他们嚼糖时瞬间舒展的脸。";
    } else if (tid === "accountant_guangzhou") {
      cityScore = 82;
      cityComment = "广州珠江新城的密集商业底角，完美承载并契合了你对于客观逻辑、客观世界和借贷平衡的精细坚守哲学。";
      title = "算尽人间借贷差额的完美平衡者";
      resonance = "你对于数字、凭证和合规有着近乎艺术般的职业严谨度与因纳风度。在大账盘的资本拉扯中，你站在了无懈可击、捍卫原则的合规最前沿上。";
      career = "商业系统合规分析师 / 高级财税风险咨询官 / 独立家族信托审计师";
      salaryExpectation = "12k-28k/月，越老越吃香的黄金防御岗";
      marketVibe = "随着财务审计要求日趋规范与严苛，高级风控与合法合规审计师逐渐替代传统记账会计，成为资本市场的看门人。";
      actionItem = "翻开你过去一周的账单，用 Excel 理出三个最不起眼的小消费，思考它们给你带来的瞬时情绪价值。";
    } else if (tid === "ecommerce_hangzhou") {
      cityScore = 85;
      cityComment = "杭州滨江电商城永不息灭的流量狂热，是释放你商业嗅觉、高频行动力和狂飙肾上腺素的绝佳黄金主场。";
      title = "电商大促时代的爆单狂飙主操盘";
      resonance = "你天生属于流量与资本战局的信息捕手，具有在一万分贝的杂糅争论和直播吆喝声中，瞬间保持绝强、冰冷和极其敏锐商业决断的领袖资本。";
      career = "高能直播电商操盘官 / 数字引流增长总监 / 柔性供应链资深合伙人";
      salaryExpectation = "15k-40k/月 + 销售分成，高能高产";
      marketVibe = "直播电商已跨过盲目扩张期，精细化选品、供应链重塑和突发公关的敏捷操盘能力，才是这个风口的核心驱动。";
      actionItem = "研究你常买的某个博主带货窗口，写下3个它是如何通过洗脑的限时/情绪字眼吸引你下单的文案套路。";
    } else if (tid === "doctor_shanghai") {
      cityScore = 80;
      cityComment = "上海高水平、极精密的现代医学会诊要求，高度检验和淬炼了你极其高绝、精深、绝无误差的科学职业素养。";
      title = "三甲医院里捧起生命微光的小医者";
      resonance = "你在生老病死的无常边缘坚守。看遍肉体脆弱的废墟，你的灵魂中却奇迹般地生发并死撑着一捧极其高贵、不辞万难的医者人文热忱。";
      career = "硬核医学科普自媒体制作 / 临床临床研究前沿顾问 / 社区大健康管理架构人";
      salaryExpectation = "15k-30k/月，长研发周期的高阶技能";
      marketVibe = "医疗资源结构化转型与大众对健康科普的强烈渴求，催生了‘前沿叙事医学、线上分级科普、家庭健康管理’等新航线。";
      actionItem = "给自己准备一个发热眼罩，强迫自己在今晚睡前进行 15 分钟没有任何电子设备的深呼吸冥想，爱护好自己。";
    } else if (tid === "ib_shanghai") {
      cityScore = 84;
      cityComment = "上海陆家嘴高耸、金光四溢的顶级金融齿轮中心，完美匹配了你对于二十亿估值和高奢行业效率的极致追求。";
      title = "陆家嘴K线图之巅的估值摆渡家";
      resonance = "你精研财富的造神机制与人性筹码。不论是在亮洁的香槟台前，还是在沾油的制造车间传送带两旁，你总是能闪电般揪出商业的真正命脉。";
      career = "独角兽并购评估高级顾问 / 科技早期投资战略推手 / 家族信托全球财富调配官";
      salaryExpectation = "25k-60k/月 + 巨额项目提成分成";
      marketVibe = "投行从粗放股权融资转变为并购与破产重组、国企改革、以及出海战略。极度精细的数据尽调与强大的底层逻辑是立足之本。";
      actionItem = "挑选一家你熟知的实体零售企业（如瑞幸），想一想它是用什么样的商业模式 and 开店速度支持其资本叙事的。";
    } else if (tid === "teacher_chengdu") {
      cityScore = 88;
      cityComment = "成都公立学校富有生活烟火与街角单纯欢呼大笑的氛围，完美滋养并照亮了你作为心灵花匠的那一捧柔软、明亮本根。";
      title = "青春喧嚣里极力守护微光的心灵花匠";
      resonance = "你在面临应试排期、家校博弈和极为繁杂琐细的高压下，依然在黑板粉灰里死死捍卫着身为教育者最干净的灵魂连接，极其高贵温存。";
      career = "青年心理障碍干预顾问 / 独立教育研学创意主策划 / 非营利少年成长社团主主理人";
      salaryExpectation = "6k-15k/月，编制稳定而富有社会赞誉度";
      marketVibe = "中学教育正在从单纯的‘分数机器’向‘全人格守护、德育人文沟通、心理疏导’转轨，懂温度与心理学的中小学班主任身价飙升。";
      actionItem = "翻开你学生时代的合影，盯着里面最调皮的那张脸，在心里对那个曾经同样迷茫、固执的年轻自己道声感谢。";
    } else if (tid === "civil_servant_nanjing") {
      cityScore = 85;
      cityComment = "金陵古都南京梧桐重檐下的温顺、踏实日常烟火，完美保护了你追求安稳生活、安顿身心和造福普通老百姓的温热初心。";
      title = "缝补人间褶皱的金陵街道守护神";
      resonance = "你对待群众、百姓、陈年纠纷和市井柴米油烟，极尽地气与暖心热忱。你用双脚走胡同，在机关章印下，默默缝补好了一整座城市的冷漠。";
      career = "地方城市微改造创意策划 / 社区现代韧性治理专家 / 地方非遗传承保护主管";
      salaryExpectation = "5k-12k/月，标准的五险一金编制安稳";
      marketVibe = "基层治理正从生硬管理向‘老社区软改造、人道调解、主观共建、服务型政府’转型，具有强大沟通能力和同理心的街道干事极受欢迎。";
      actionItem = "去家楼下最陈旧、最接地气的茶摊或胡同口坐15分钟，记录下来老人聊天中最好玩、最地道的3个金句。";
    } else if (tid === "kol_chengdu") {
      cityScore = 93;
      cityComment = "蓉城大源的潮流地标与太古里的松弛空气，让你的创意灵感与草根生命力恣意迸发！";
      title = "天府晚风里慢吞吞写诗的火锅密探";
      resonance = "你深谙流量的游戏法则，但内心深处，你热烈向往的是安逸真挚的烟火日常。你拒绝被算法彻底工具化，喜欢带着读者去发掘人情美。";
      career = "本地生活美学策展人 / 创意短视频编导 / 自由撰稿人";
      salaryExpectation = "10k-35k/月，拥有极强的内容爆发力";
      marketVibe = "探店博主已跨过简单灌水红利期，深度的生活美学洞察、真实的故事质感才是穿透红海的核心力量。";
      actionItem = "今晚去你家楼下经营了五年以上的老面馆吃碗面，观察老板的切料动作，在便签上写下三行‘街头观察绝色小诗’。";
    } else if (tid === "engineer_shenzhen") {
      cityScore = 90;
      cityComment = "搞钱至上的深圳科技园，是你的超级能量场。用代码重塑世界的极客梦想将在这里全力安家。";
      title = "科技园深夜重构世界的数字炼金术士";
      resonance = "在无数次产品迭代与高强度对抗中，你极力捍卫着对普通人有温度的技术温情。看破堆栈，你的灵魂中依然驻守着不妥协的极客梦想。";
      career = "资深架构研发专家 / 开源主理合伙人 / 硬件初创公司大合伙人";
      salaryExpectation = "18k-45k/月，高精尖技术的高峰溢价";
      marketVibe = "通用低端代码正在被AI大范围提效合并，而富有底层逻辑深度、懂多元架构与微服务协同的高潜力全栈工程师将更加走俏。";
      actionItem = "打开 GitHub，找到一个你熟知但近期没看的小库，花5分钟读它的 README，构思一个对其友善度提升的小建议。";
    } else if (tid === "sales_suzhou") {
      cityScore = 86;
      cityComment = "在温柔江南园林与金鸡湖现代工业科技的精妙平衡体温中，淬炼着你绝妙通达的商业剑术。";
      title = "江南烟雨里低声拆解千万元订单的白衣大侠";
      resonance = "你极擅人情练达，能在纷杂盘曲的商业拉扯与信任赤字中，织出一张妥协并共赢的好网。你的眼睛总能在交错笑语里发现最关键的齿轮契机。";
      career = "大客户战略合作合伙人 / 科技投融资咨询顾问 / 商业并购调解大使";
      salaryExpectation = "15k-50k/月（极多伴有巨额项目提点及股权分配）";
      marketVibe = "靠送礼和拼酒的传统销售已经远去，具有精深的客制化咨询、合规框架推导与双向利他共情能力的顾问型销售，才是未来的合伙人。";
      actionItem = "找一个你平时高频相处的合作伙伴或同事，尝试在下一次对话的3分钟里不切入任何具体工作，探听并赞美一件他真正发自内心感到得意的手作为事。";
    } else if (tid === "tea_grower_anxi") {
      cityScore = 95;
      cityComment = "安溪铁观音茶山晨间浓厚清香的山岚，完美收纳抚平了你所有疲于写字楼报表高压的浮躁心魂。";
      title = "茶垄烟岚里最能分辨阳光温度的时间手艺人";
      resonance = "你曾在大都会里踩着八公分高跟、看着Excel眼花缭乱。现在，你把双手放回了最真实的大地。你学会了倾听茶叶在火炭上轻响的古老歌谣。";
      career = "漫生活茶旅主营人 / 茶学自媒体主笔 / 传统非遗文化青年出海管家";
      salaryExpectation = "8k-25k/月，属于长期主义的生活方式深蓄后劲";
      marketVibe = "流水线廉价茶内卷难做，但融入自然美学体验、茶艺旅居、慢节奏身心退守的‘山野奢隐’高端慢生活定制迎来高速腾飞。";
      actionItem = "给自己泡一杯普通热茶，闭上双眼，用10秒钟仔细感受温热茶水滑过喉咙、温暖胸腔的舒缓温度，完成一次身心留白。";
    }

    return {
      title,
      resonance,
      cityMatch: {
        score: cityScore,
        comment: cityComment
      },
      mapping: {
        career,
        marketVibe,
        salaryExpectation,
        actionItem,
      }
    };
  };

  if (!ai) {
    // Return early if no key is configured
    return res.json(generateFallbackResponse(trialId, finalStats));
  }

  try {
    const choicesSummary = choices.map((c: any) => `[${c.time} - ${c.scenario || c.sceneTitle}] 选择了: "${c.selectedOption || c.text}"`).join("\n");
    const prompt = `
你是一名顶级的人生职业咨询师与成长治愈系导师。用户在我们的沉浸式人生模拟游戏《人生试玩店》（Life Trial）中试玩了人生副本。

【副本基本信息】
- 副本名称：${trialTitle}
- 城市与职业：${trialId}
- 用户主观偏好反射："${reflection || '未填写'}"
- 体验中的决策流：
${choicesSummary}
- 体验结算数值：
  1. 快乐/幸福度 (Happiness): ${finalStats?.happiness || Math.round(((finalStats?.freedom || 50) + (finalStats?.connection || 50)) / 2)}/100
  2. 身体跟心理健康 (Health): ${finalStats?.health || finalStats?.peace || 50}/100
  3. 精神压力负荷 (Stress): ${finalStats?.stress || Math.max(10, 100 - (finalStats?.peace || 50))}/100
  4. 职业成长及积累 (Career Growth): ${finalStats?.growth || finalStats?.wealth || 50}/100

根据以上数据，生成一份极具情感温度、治愈而实用的《人生映射结案报告》。
你必须遵循【人生试玩店】的年轻化、轻游戏、Netflix/Duolingo/Forest式温暖风格。切记绝无官腔、大厂黑话或冷冰冰的教条！字词要像和老朋友聊天，充满生活细节与奇妙想象。

返回一个精确的 JSON 格式响应（不要带任何 Markdown \`\`\`json 标记，直接返回 JSON 串即可）。
JSON 结构如下：
{
  "title": "符合用户试玩路线特质的极其好玩的‘人生试玩称号’（字数在15字以内，需体现职业与特制印记，例如：‘西湖边野生像素牧羊人’、‘下午茶续命的方案精算师’）",
  "resonance": "【灵魂共鸣分析】150字以内的段落，用温暖、治愈、极其敏锐的言语描写出选择背后的偏好本质。别聊MBTI，而是讲他们对世界的热忱、对自我的保护，以及他们在这个职业中闪光或挣扎的真正症结（比如他们其实不讨厌大厂，她讨厌的是漫无目的的早会；比如他们想要咖啡，更想要咖啡背后的亲密闲聊）",
  "cityMatch": {
    "score": 85,
    "comment": "100字以内的极简评点：他们的生活哲学在这个试玩城市（如上海、北京、杭州、成都）是否契合？给出有温度的建议"
  },
  "mapping": {
    "career": "映射出的 2-3 个好玩的现实对应职业（用‘ / ’分隔）",
    "marketVibe": "100字以内。真实社会的行业氛围和当前变化趋势的柔性点拨。要讲实话，但要以鼓励、富有前瞻的方式表达",
    "salaryExpectation": "大致的真实待遇预期（如：‘实习期 150-250/天，成熟期 15-28k/月’，‘浮动性收入，上不封顶但需要时间灌溉’）",
    "actionItem": "120字以内。一个用户今天就可以在日常中去做的、极具体验感的可行小行动（不要给重度任务如写简历、刷题。给游戏化行为，例如：去家楼下的小便利店买瓶冷泡茶，花15分钟画出它的包装并写出3个用户吐槽点；或者去逛逛独立书店找一本封面最丑的读物并试着理解它）"
  }
}
`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const text = response.text;
    if (text) {
      try {
        const cleanedText = text.trim();
        const parsed = JSON.parse(cleanedText);
        return res.json(parsed);
      } catch (parseErr) {
        console.error("Failed to parse Gemini JSON output, string was:", text, parseErr);
        return res.json(generateFallbackResponse(trialId, finalStats));
      }
    } else {
      return res.json(generateFallbackResponse(trialId, finalStats));
    }
  } catch (err) {
    console.error("Error asking Gemini for career mapping:", err);
    return res.json(generateFallbackResponse(trialId, finalStats));
  }
});

// Configure Vite middleware in development or static fallback in production
async function start() {
  if (process.env.NODE_ENV !== "production") {
    // Development Mode
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
    console.log("Vite middleware attached in Development Mode.");
  } else {
    // Production Mode
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
    console.log(`Serving static dist files from ${distPath} in Production Mode.`);
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Life Trial Application] server running at http://0.0.0.0:${PORT}`);
  });
}

start();
