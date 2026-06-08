import { CustomTrial } from "./types";

export const CUSTOM_TRIALS: CustomTrial[] = [
  {
    id: "pm_shanghai",
    title: "高压与齿轮",
    subtitle: "产品经理的一天",
    career: "产品经理 (PM)",
    city: "上海 (超一线城市)",
    lifestyle: "社畜生活 · 螺丝钉的高频运转",
    vibe: "高压、咖啡续命、精算、陆家嘴落日、外滩夜跑",
    duration: "3分钟极速副本",
    coverImage: "linear-gradient(135deg, #1e3a8a 0%, #3b82f6 50%, #60a5fa 100%)",
    difficulty: 4,
    freedom: 30,
    connection: 60,
    wealth: 85,
    peace: 25,
    scenarios: [
      {
        time: "09:30",
        period: "morning",
        sceneTitle: "晨间敏捷晨会",
        description: "Dev 研发老大在群组里公开@你：“新需求底层重构至少两个月，排期根本是不可能的任务，除非你们削减一半需求。”所有的目光都盯着你。",
        illustration: "👨‍💻",
        options: [
          {
            text: "先画个“下季度资源申请”大饼",
            subtext: "安抚老大情绪：我们本期先发简化版，下季度一定帮你审2个HC！",
            effects: { wealth: 5, freedom: -5, connection: 5, peace: -5 },
            narration: "你巧妙地把需求套上了“MVP版本”的马甲，风波暂时平息，但技术债下个月还是要还。"
          },
          {
            text: "当面搬出大老板的招牌施压",
            subtext: "强硬表态：这是CEO本周特批的红线项目，必须按时死线交付！",
            effects: { wealth: 10, freedom: -10, connection: -15, peace: -10 },
            narration: "会议室气温骤降。研发老大冷笑一声，项目确实能按时上线了，但你下周再提修改，研发群里只有冷漠的已读不回。"
          }
        ]
      },
      {
        time: "12:15",
        period: "noon",
        sceneTitle: "社交派系午餐",
        description: "隔壁组邀你参与人均 88 元的安福路沙拉局，席间他们要疯狂讨论下季度高层变动、组织优化的小道消息。",
        illustration: "🥗",
        options: [
          {
            text: "欣然加入，一边吃沙拉一边积极交换筹码",
            subtext: "融入大厂社交流量池，这可是探听消息的绝佳机会！",
            effects: { connection: 20, wealth: -10, peace: -5 },
            narration: "你们达成了牢固的攻守同盟。虽然吃着索然无味碎草，但情报能做你的大厂防弹衣。"
          },
          {
            text: "独自去全家买冷面，在梧桐树下散步放空",
            subtext: "拒绝听八卦，只想给生锈的脑子留一刻钟安静空档。",
            effects: { freedom: 15, wealth: 5, connection: -10, peace: 15 },
            narration: "阳光洒在梧桐叶上，格外温柔。虽然错过了传言，但你感觉灵魂不至于像一纸PPT那么干瘪。"
          }
        ]
      },
      {
        time: "15:30",
        period: "afternoon",
        sceneTitle: "秒杀系统线上爆雷",
        description: "刚发布的秒杀系统服务器大面积阻断报错，大老板群里疯狂震怒，要你给出应急预案和复盘报告，手机震得发烫。",
        illustration: "🚨",
        options: [
          {
            text: "主动扛雷，连夜赶工写核心故障复盘PPT",
            subtext: "展现强悍抗压与责任感：通宵也会给出全链路归因方案！",
            effects: { wealth: 15, freedom: -15, connection: 5, peace: -20 },
            narration: "你写出了完美的十六宫格复盘PPT。大老板公开给你点赞，但你感觉左腹部隐隐作痛。"
          },
          {
            text: "熟练打太极：甩出“第三方接口故障”证据",
            subtext: "保全自身绩效：用详实截图包证明是供应商不守约导致。",
            effects: { freedom: 10, connection: -15, peace: 15 },
            narration: "防守大师！老板怒火全转到了外部团队身上。你安然保全了考勤，但研发兄弟对你默默关上了心扉。"
          }
        ]
      }
    ]
  },
  {
    id: "designer_hangzhou",
    title: "像素与山野",
    subtitle: "独立创意设计师的一天",
    career: "独立设计师 (Designer)",
    city: "杭州 (一线城市)",
    lifestyle: "小资生活 · 优雅自律的数字游民",
    vibe: "落日山水、草木灵感、无尽改稿、时尚电商、数字游民",
    duration: "3分钟自洽副本",
    coverImage: "linear-gradient(135deg, #10b981 0%, #059669 50%, #047857 100%)",
    difficulty: 3,
    freedom: 80,
    connection: 40,
    wealth: 55,
    peace: 65,
    scenarios: [
      {
        time: "10:00",
        period: "morning",
        sceneTitle: "金主爸爸的刁钻修稿建议",
        description: "刚泡好龙井茶，品牌丢来一份12页的修改意见：“底色采用极简高级灰的同时，加入中国大红，做出斑斓且不庸俗的喜庆感。”下午3点前必看。",
        illustration: "🎨",
        options: [
          {
            text: "无奈微笑妥协改稿",
            subtext: "温饱第一：下月还要给猫咪买罐头，向金主低头也是生活美学。",
            effects: { wealth: 15, freedom: -10, peace: -5 },
            narration: "你搭配出了一套耀眼的“喜庆冷淡红”。老板大夸你懂行，但你保存文件时感觉眼角流下一滴热泪。"
          },
          {
            text: "坚持原案并理直气壮科普美学",
            subtext: "专业守门人：纯色和红绿相衬不可同调，用色卡和大师画作说服他。",
            effects: { freedom: 15, connection: -5, peace: 10 },
            narration: "在一连串高超的美学说辞攻势下，老板终于认命表示按你的原始版本，但表示这次尾款支付会拖延半月。"
          }
        ]
      },
      {
        time: "13:30",
        period: "noon",
        sceneTitle: "自来水流量与真实线条",
        description: "午后，你想更新小红书主页。昨晚手绘的作品只有少得可怜的15个赞，而一个用AI几秒拼出的“零基础插画日入万元人设图”却有上万个收藏。",
        illustration: "📷",
        options: [
          {
            text: "蹭热点，做一期AI设计合集",
            subtext: "流量就是正义：在这个赛道上，先拿到曝光和合作变现再说！",
            effects: { connection: 15, wealth: 10, freedom: -5, peace: -10 },
            narration: "推贴瞬间爆火，私信被砸满。你不得不花一下午回复“点赞进群”，已经无暇拿数位板画点真正的心爱之物。"
          },
          {
            text: "无视流量，坚持发布手绘白噪音视频",
            subtext: "不为数字活着：相信手工的温度，终究能连接到最懂它的同频看客。",
            effects: { freedom: 25, connection: 5, peace: 25 },
            narration: "视频波澜不惊。但夜半两点，一间高端咖啡馆主理人发来私信，赞赏你笔触的松弛感，邀你做其秋季联名，你心安理得关了灯。"
          }
        ]
      },
      {
        time: "16:00",
        period: "afternoon",
        sceneTitle: "满觉陇雨夜采风逃亡",
        description: "茶山下起了惬意的小雨，你刚好遇到了创意瓶颈。同行微信问你：“要不要去满觉陇路边的小木屋喝冷萃茶、听雨发呆？”",
        illustration: "🍵",
        options: [
          {
            text: "拔掉数位板，去山林里采风！",
            subtext: "大自然才是美学的亲娘：既然画不出，不如此刻去山腰吸口新鲜潮气。",
            effects: { freedom: 20, peace: 20, wealth: -5 },
            narration: "你在泥坑里踩湿了布鞋。但听着茶舍阿伯说的民间怪谈，你内心突然涌起无限画面：落款带土的大作诞生了。"
          },
          {
            text: "掐大腿逼自己静坐改完稿子",
            subtext: "自律狂魔：松懈是拖延的开始，大好茶山在改完稿后更香。",
            effects: { wealth: 10, freedom: -10, peace: -15 },
            narration: "你打着哈欠连续拼了三套。金主如约结清了账，但你感觉自己的背椎硬得像块生铁。"
          }
        ]
      }
    ]
  },
  {
    id: "ai_beijing",
    title: "高维空间",
    subtitle: "人工智能研究员的一天",
    career: "人工智能研究员 (AI Research)",
    city: "北京 (超一线城市)",
    lifestyle: "社畜生活 · 算力与公式的苦操",
    vibe: "显卡轰鸣、内存泄漏、中关村、数学、高知圈子、学术死线",
    duration: "3分钟极客副本",
    coverImage: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #8b5cf6 100%)",
    difficulty: 5,
    freedom: 35,
    connection: 50,
    wealth: 90,
    peace: 30,
    scenarios: [
      {
        time: "09:30",
        period: "morning",
        sceneTitle: "服务器节点意外瘫痪",
        description: "服务器亮红报警，你的 16 张 H100 显存池突遇严重内存泄漏瘫痪。组长狂艾特：“每秒都在燃烧美元算力！限你20分钟紧急修复！”",
        illustration: "💻",
        options: [
          {
            text: "全速排障，一行行翻阅底层堆栈",
            subtext: "极客风骨：不投机不后退，用最硬的堆栈追踪死磕Bug。",
            effects: { freedom: -5, peace: -15, wealth: 15 },
            narration: "你用通红的双眼排查出一处高维张量乘法的致命错位。服务器绿灯亮起，算力刹停！你在重装上阵里找到了封神感。"
          },
          {
            text: "高深学说掩盖，写成“高维奇异状态汇报”",
            subtext: "技术写手：告诉高层——这是搜索空间遇到了奇异数学奇点，需要学术观察。",
            effects: { freedom: 15, connection: -5, peace: 15 },
            narration: "一份极具词藻美的新论述发在汇报上，老板看完高呼牛逼，甚至直接写进了见VC的演示，你完美自保成功。"
          }
        ]
      },
      {
        time: "13:15",
        period: "noon",
        sceneTitle: "山西刀削面馆的真理博弈",
        description: "中关村刀削面馆，技术同伴一边啃大蒜一边大吵刚才新推的《通过拓扑实现强意识》开山之作是否纯属学术PPT大吹水。",
        illustration: "🍜",
        options: [
          {
            text: "敲着筷子加入辩论，酱油碟演示公式",
            subtext: "真理最重：学术不容掺假，拿出数学枪刺戳穿虚妄牛气！",
            effects: { connection: 15, peace: -5 },
            narration: "你在桌边一顿比划。对面知名博士对你肃然起敬，悄悄推给你一个私密闭门学术会的邀请，你觉得头脑刀锋无比雪亮。"
          },
          {
            text: "默默吃完面，作为题材发给科普自媒体",
            subtext: "变现才是王道：百万美金极客的餐桌神仙战，十万加爆款故事不就来了吗？",
            effects: { wealth: 25, freedom: -5, connection: 5 },
            narration: "账号瞬间涌入几千冷粉。你完美达成流量任务，但也渐渐明白自己正在离寂寞的学术前沿越来越遥远。"
          }
        ]
      },
      {
        time: "16:00",
        period: "afternoon",
        sceneTitle: "逻辑机器的共创测试",
        description: "训练了多天的“情感共鸣语义”大模型完工，你在命令行里缓缓敲入你昨晚写下的、最真实孤独感伤笔记，想测试它是否能读懂人心。",
        illustration: "🤖",
        options: [
          {
            text: "观察机器流下的第一行“温情响应”",
            subtext: "让机器给出最深邃、富有悲悯色彩的回复，听取心跳。",
            effects: { peace: 25, connection: 15, wealth: -10 },
            narration: "屏幕上静默了三秒。机箱风扇长鸣，大模型吐出一行字：“如果你疲惫，可以向0和1交出你的无序，今夜我陪你失眠。”"
          },
          {
            text: "一键转到跑分表格，量化BLEU率",
            subtext: "理性第一：共情全是数据噪声，标准榜单分数才是唯一准绳！",
            effects: { wealth: 20, connection: -10, peace: -10 },
            narration: "得益于在通用对话库里的超高性能，跑分超越了行业巨头3个千分位。你顺利敲定了这周的巨钱绩效，但机器只是代码齿轮。"
          }
        ]
      }
    ]
  },
  {
    id: "lawyer_beijing",
    title: "法典与长枪",
    subtitle: "红圈律所律师的一天",
    career: "律师 (Lawyer)",
    city: "北京 (超一线城市)",
    lifestyle: "小资生活 · 词句盾牌背后的攻防战",
    vibe: "红圈淘汰、朝阳国贸、深夜翻译、精细排查、法理博弈、不眠灯火",
    duration: "3分钟冰冷竞技",
    coverImage: "linear-gradient(135deg, #0f172a 0%, #334155 50%, #475569 100%)",
    difficulty: 4,
    freedom: 35,
    connection: 55,
    wealth: 85,
    peace: 35,
    scenarios: [
      {
        time: "09:00",
        period: "morning",
        sceneTitle: "国贸大厦里的并购签字排期",
        description: "刚坐下，督导合伙人就把一本两百页的英文跨国并购备忘录甩在桌上：“今天下午两点要在听证会签字，你排查完所有反垄断隐性雷区。”",
        illustration: "⚖️",
        options: [
          {
            text: "潜心对法律红线细加修补",
            subtext: "专业为王：在每个逗号和隐蔽除外责任里揪出合伙商可能的霸王协议。",
            effects: { wealth: 15, peace: -20, freedom: -10 },
            narration: "你在四个小时里，硬是凭借经验揪出了对方故意隐藏的一处非对称免责豁免条款。签字安全保住，合伙人朝你眯眼点头。"
          },
          {
            text: "借用前人完美框架套用模板",
            subtext: "效率杠杆：自己抓大方向指引，用成熟框架快速打完收工，避免无休无止加班。",
            effects: { freedom: 15, connection: -15, peace: 15 },
            narration: "你的排产极其丝滑，按期交卷。你抽空下楼喝了精致的拿铁，但内心深处还是有隐隐的对未知风险的悬心。"
          }
        ]
      },
      {
        time: "13:15",
        period: "noon",
        sceneTitle: "客户隐秘的‘灰色通道’暗示",
        description: "中午合伙人宴会上，天价身价的涉案商贾私下拍拍你，暗示如果能在凭证中抹去几个关于可疑资金结汇的签字，他愿意给你不菲的顾问提成。",
        illustration: "🥂",
        options: [
          {
            text: "严词拒绝，绝不践踏执照尊严",
            subtext: "捍卫底线：法治之光不可买断，任何暗面红利都不值得拿自由和清白来对赌。",
            effects: { peace: 30, wealth: -20, freedom: 10 },
            narration: "对方收起了不恭的眼色，表示对你气节十分赞许。你和横财擦肩，但他随后把公司所有的核心诉讼纠纷都放心托付给你。"
          },
          {
            text: "应用复杂的海外架构巧妙解套",
            subtext: "技术致胜：这是法律的‘精密重组艺术’，只要架构无瑕，也是手段高超。",
            effects: { wealth: 35, peace: -25, connection: 10 },
            narration: "庞大的对账流程设计成功。客户笑逐颜开，你顺利拿到了高额绩效分成，只是深夜里难免有那么一点心跳不安。"
          }
        ]
      },
      {
        time: "16:30",
        period: "afternoon",
        sceneTitle: "面对实习生眼泪的边缘选择",
        description: "新来的实习生在提交协议前多输了一个零，带着面红耳赤的眼泪哀求你：“千万别上报，如果记过，我拿不到北大法学学位的直升推免了...”",
        illustration: "😢",
        options: [
          {
            text: "帮她瞒天过海，自己在工位偷偷修正",
            subtext: "留一点温情：在冰冷的写字楼里，多一分宽容往往能改写一个年轻人的轨迹。",
            effects: { connection: 20, peace: 15, wealth: -5 },
            narration: "你默默帮她二次核查并完成了修复。实习生感激不尽，你也在硬硬的写字楼里感知到了有温度的职场连接。"
          },
          {
            text: "按合规流程上报主管，更换助理",
            subtext: "规则之上：今日小姑息就是明天崩坝的蚁穴，律政容不得半点非原则宽限。",
            effects: { wealth: 15, connection: -20, peace: 10 },
            narration: "你利落地按程序发了通报，实习生提包落寞离去。你站在了绝对不败的安全制度网里，但也发现自己的心又冷了几分。"
          }
        ]
      }
    ]
  },
  {
    id: "hotel_mgr_hongkong",
    title: "金粉与细节",
    subtitle: "奢华酒店管培生的一天",
    career: "酒店管理 (Hotel Management)",
    city: "香港 (超一线城市)",
    lifestyle: "奢侈生活 · 海景微光中的极致待客",
    vibe: "维港海景、奢华宴会、无死角细节、突发投诉、精致自律、双语切换",
    duration: "3分钟流金副本",
    coverImage: "linear-gradient(135deg, #b45309 0%, #78350f 50%, #451a03 100%)",
    difficulty: 4,
    freedom: 35,
    connection: 80,
    wealth: 80,
    peace: 40,
    scenarios: [
      {
        time: "08:30",
        period: "morning",
        sceneTitle: "海景套房细节大核对",
        description: "接待好莱坞大亨前，你核验顶层套房。抹过壁炉顶端，发现一层薄薄尘埃。影星15分钟后到达，保洁主管还在地下货仓调配清洁补给。",
        illustration: "🏨",
        options: [
          {
            text: "备好擦布与鲜花，10分钟极限亲自补位",
            subtext: "细节即生命：真正优秀的管理应当躬身入局维护品牌尊荣。",
            effects: { wealth: 5, freedom: -5, connection: 10, peace: 10 },
            narration: "你及时完成了除尘。大亨一开房门无比满意，甚至直接在前台特意表示了对细致服务的由衷谢意。"
          },
          {
            text: "对讲机命令主管立刻带人狂奔就位",
            subtext: "层级分明：各守其职，保障业务流科学考核，管理者不搞越级勤杂。",
            effects: { freedom: 15, connection: -15, peace: 5 },
            narration: "保洁小队冷着脸在第12分钟完成补救。虽说业务上未出错，但客舱氛围一时之间显得很是紧绷冰冷。"
          }
        ]
      },
      {
        time: "12:30",
        period: "noon",
        sceneTitle: "顶级投行大佬的熟度投诉",
        description: "午宴厅，一个身家千亿的投行富豪突然大拍桌子，指责清蒸大蟹的熟度有些过火，大吼要求大厨亲自到餐桌赔罪，并要全单全免。",
        illustration: "🦀",
        options: [
          {
            text: "躬身安抚对方情绪，并赠送珍藏年份香槟",
            subtext: "情绪按摩师：高端商务人士玩的是面子而非单纯金钱，顺气第一位。",
            effects: { connection: 20, wealth: -10, peace: 15 },
            narration: "你的得体挽留和高级年份香槟让富人顺了气，不仅不再闹事，甚至主动顺口把下周的名流晚宴也定在了该处。"
          },
          {
            text: "携主厨携温控仪据理力争，拒绝退单并给予折让",
            subtext: "捍卫主厨尊严：高级餐饮的核心是专业而非讹诈，按退换红线公办公评。",
            effects: { wealth: 15, connection: -15, peace: 10 },
            narration: "通过科学的温控数显硬生生把争论平息下去。但投行大佬黑着脸结账离开，并将该店默默拉入公司的政商务宴黑名单。"
          }
        ]
      },
      {
        time: "16:00",
        period: "afternoon",
        sceneTitle: "遭遇暴雨停船大堂爆满冲突",
        description: "突发暴雨加雷击让维港轮渡彻底全面停航，几十个高客滞留大堂，愤怒情绪高涨，把前台围得水泄不通，前台库存早已客满。",
        illustration: "⚡",
        options: [
          {
            text: "张罗暖胃姜茶，将休息区改造成温馨茶话会",
            subtext: "危机转机：发挥极致的同理安抚，送暖、舒缓精神并积极调理。",
            effects: { connection: 25, peace: 25, wealth: -10 },
            narration: "热茶和轻柔音乐平复了大伙的焦虑。不少旅客甚至觉得这成了一场意外的城市停电漫旅，拉住你合照大发小红书。"
          },
          {
            text: "出示契约免税声明，高效指点合作周边旅馆",
            subtext: "契约精神：自然灾害属免责，绝不打折让利，快速导流指引其他酒店分留。",
            effects: { wealth: 15, connection: -10, peace: 15 },
            narration: "通过流程的高效操作把大堂危机迅速清空。虽完成了规范任务，但滞留乘客走时脸上还余了一抹不快和冰冷。"
          }
        ]
      }
    ]
  },
  {
    id: "flight_attendant_shenzhen",
    title: "云之平衡",
    subtitle: "高空乘务员的一天",
    career: "空乘 (Flight Attendant)",
    city: "深圳 (超一线城市)",
    lifestyle: "小资生活 · 优雅漂移的云端旅人",
    vibe: "夕阳航线、精致制服、狭窄客舱、高压强风、万米高空、多时区倒时差",
    duration: "3分钟优雅副本",
    coverImage: "linear-gradient(135deg, #0369a1 0%, #0d9488 50%, #111827 100%)",
    difficulty: 3,
    freedom: 45,
    connection: 75,
    wealth: 70,
    peace: 55,
    scenarios: [
      {
        time: "06:00",
        period: "morning",
        sceneTitle: "飞前高压准备晨会",
        description: "乘务长寒着脸突击抽查特配舱安防红线程序，因为连轴飞行，你脑子有几丝犯困混淆，乘务长当面有些微恼。",
        illustration: "✈️",
        options: [
          {
            text: "优雅大笑坦承犯困，随后利落复查",
            subtext: "高情商坦率：落落大方自嘲，并用优雅的仪表和完美微笑带过窘况。",
            effects: { connection: 20, freedom: -5, peace: 15 },
            narration: "乘务长被你明亮的笑容和温文尔雅的解释给软了态度，敲了敲平板叮嘱你快点拿浓缩咖啡提神，晨会轻松过关。"
          },
          {
            text: "硬背规范，不带一丝温调死守条规",
            subtext: "专业堡垒：只要背诵逐字逐句无瑕，冷脸就伤害不到我分毫。",
            effects: { wealth: 15, connection: -10, peace: 10 },
            narration: "你的背诵犹如机器人般完美合规。虽晨会得过，但组内相处的气压不可避免地冷淡至极，缺少人情温度。"
          }
        ]
      },
      {
        time: "13:15",
        period: "noon",
        sceneTitle: "雷区重合客舱内怒吼投诉",
        description: "航程突遇重度晴空颠簸，你按规关停热饭餐派发。头等舱一位大佬在退回座椅时，狂燥地嫌空乘耽误由于其商务餐叙，将多余饮料泼在公道上。",
        illustration: "⛈️",
        options: [
          {
            text: "递上热毛巾柔言细语抚慰，温柔科普安防细则",
            subtext: "高级同理心：万米高空本就易有焦虑，以退为进，用无可指摘的细腻平息幽闭狂躁。",
            effects: { connection: 25, peace: 20, wealth: -5 },
            narration: "细软的抚慰和得体的温水服侍让他慢慢感到羞惭，收敛坐下。你成功将惊浪化解在温顺得体里。"
          },
          {
            text: "通知安全护卫出示司法函告警告，对非法破坏安保拍照录像",
            subtext: "法理不容任性：万米高空对空乘的滋扰威胁航安，必须刚正执法纠治。",
            effects: { freedom: 15, connection: -15, peace: 15 },
            narration: "客机保安到位，现场顿时死静。男乘客敢怒不敢言，你虽成功守牢了空乘组的不可轻侮尊严，但也引来其他高客一些紧闭心神。"
          }
        ]
      },
      {
        time: "17:30",
        period: "afternoon",
        sceneTitle: "红日降落后的夕阳假期",
        description: "飞机经历了漫长滑行终于在异国降落，全身双膝肿痛关节干裂。今夜拥有一天完全无差错的异域逗留假，你会：",
        illustration: "🎡",
        options: [
          {
            text: "和姐妹们去泰晤士河畔酒吧换装，喝一杯本地精酿",
            subtext: "在远方的风里绽放：褪下束缚一整天的优雅制服，吹吹风闲话，做回异国女郎。",
            effects: { connection: 25, freedom: 15, wealth: -15 },
            narration: "夜色伦敦，大本钟前落日昏黄。你大笑着拍照发圈，留下了关于这个世界最优雅、松弛、又浪漫的生活滤镜。"
          },
          {
            text: "拉死不透光的遮光帘，配上死香在大床上一觉大睡",
            subtext: "断电自救：拒绝一切异域打卡，我只想用睡眠挽回严重紊乱的内分泌。",
            effects: { freedom: 20, peace: 35, wealth: 5 },
            narration: "沉沉的一觉黑梦极为滋补。醒来后你在松软白枕里伸个懒腰，感觉被高空干瘪榨干的灵魂仿佛奇迹般回归了饱满。"
          }
        ]
      }
    ]
  },
  {
    id: "police_officer_qingdao",
    title: "守护日常",
    subtitle: "滨海人民警察的一天",
    career: "警察 (Police Officer)",
    city: "青岛 (二线城市)",
    lifestyle: "平淡生活 · 平安滨海的市井守护",
    vibe: "肩灯闪烁、社区调解、海风警铃、群众温情、严谨执法、平凡琐细",
    duration: "3分钟踏实副本",
    coverImage: "linear-gradient(135deg, #1e3a8a 0%, #1e40af 50%, #111827 100%)",
    difficulty: 3,
    freedom: 30,
    connection: 80,
    wealth: 55,
    peace: 65,
    scenarios: [
      {
        time: "08:30",
        period: "morning",
        sceneTitle: "渔港鬼秤罗生门",
        description: "接警有人在大排档因海味短斤称两争执。两个外地大学生指责商家扣两，摊贩老板抄起大铲咆哮这是恶意差评，围观群众开始疯狂抖音拍像拍击。",
        illustration: "👮",
        options: [
          {
            text: "自备标准称现场测试，两相递烟软调解",
            subtext: "市井柔性：拉过老板耳语：“咱青岛百年金字招牌，别为几块蛤蜊丢青岛面，给大学生多抓两个螺，咱这事翻篇。”",
            effects: { connection: 25, peace: 25, wealth: -5 },
            narration: "测试确实少了。老板听劝悻悻抹去零头，又塞了一袋文蛤致歉。大学生笑着删了差评抖音。你感受见到了真实的市井回暖。"
          },
          {
            text: "执法记录仪开启查封渔档，把当事双方拉回等候登记笔录",
            subtext: "法理不打折：公共治安下无和稀泥。扣秤属经济欺诈，带回所里立案调查、公评公证。",
            effects: { wealth: 15, connection: -15, peace: 10 },
            narration: "高标执宪，规范封档。两边老老实实配合笔录。虽然大伙直夸流程有规范高明，但花了一上午做三千字对账，写得腰关节酸麻。"
          }
        ]
      },
      {
        time: "12:30",
        period: "noon",
        sceneTitle: "八旬大娘的淹水难关",
        description: "刚准备吃温热的鲅鱼水饺，居委会领进面带焦急的王大娘：“警察同志，俺上天花板管爆了，但北京租客回不来。家里已经接了宿脸盆了...”",
        illustration: "👵",
        options: [
          {
            text: "挽起裤脚扛盆走入大娘家，上门撬锁找工程排堵",
            subtext: "人民至上：解决群众日常大难题才是制服的核心意义。搭手、闭水、大扫除。",
            effects: { connection: 25, peace: 20, freedom: -10 },
            narration: "忙活了三个钟头终于断水换新，顺带替大娘把堆到过道的旧纸盒子全卖了。大娘硬塞给你一个刚削的大红苹果，吃下心里格外甜糯。"
          },
          {
            text: "告知登记这属民事财产权冲突，依法帮起具证明去调委或者去诉执",
            subtext: "职守护航：警察要专于刑安防备，民事财税归由居委或司法流程，精益治警。",
            effects: { freedom: 15, connection: -15, peace: 15 },
            narration: "你温言劝解提供了完备的公法回执单，驱车赶往城东大巡逻。虽处理得完全规范没有纠纷，但王大娘落寞在水洼的脸色让你心情有些沉寂。"
          }
        ]
      },
      {
        time: "16:00",
        period: "afternoon",
        sceneTitle: "防波堤惊涛打卡大劫",
        description: "台风余风。海浪卷至5米高拍打。三个青年网红博主为了录制“深蓝震撼大片”，翻过警戒线在湿漉大防波堤边缘危险走台。浪花就要淹在脚心。",
        illustration: "🌊",
        options: [
          {
            text: "开启强巡笛拉紧高音大喇叭高声吼退，硬撑直到安全架离",
            subtext: "搏击一线：生命大于规则，就算自己全身被海水淋得湿透感冒，也要站在人命前站一线。",
            effects: { connection: 20, peace: 30, freedom: -5 },
            narration: "巨浪压下前三秒把吓瘫的姑娘扯进了安全墩。面对你严厉的训诫，小姑娘们哭着给你递纸巾连连鞠躬，你又守护了一个平凡的日落。"
          },
          {
            text: "在防线入口架离高压电网并出示警告隔离告示，致电回其网约单位交托教育",
            subtext: "责任分担：不应当拿执勤人员的命去为那些漠视安全红线的巨婴买单，警钟设防。",
            effects: { wealth: 15, connection: -20, peace: 15 },
            narration: "完美做完了警段安全隔离。虽说理性上做得完美完备安全放任，但少了一丝市井守护中对愚钝之心的关照体温。"
          }
        ]
      }
    ]
  },
  {
    id: "livestream_guangzhou",
    title: "嘶吼与热望",
    subtitle: "大促直播主播的一天",
    career: "直播主播 (Anchor)",
    city: "广州 (超一线城市)",
    lifestyle: "社畜生活 · 流量暴风里的尖叫竞技",
    vibe: "大号探照、上万呐喊、秒杀倒数、库存爆雷、拼命吆喝、深夜卸妆",
    duration: "3分钟狂飙副本",
    coverImage: "linear-gradient(135deg, #d97706 0%, #ea580c 50%, #991b1b 100%)",
    difficulty: 4,
    freedom: 30,
    connection: 65,
    wealth: 85,
    peace: 20,
    scenarios: [
      {
        time: "15:00",
        period: "morning",
        sceneTitle: "开播前金主突然砍预算大抗辩",
        description: "刚起床到后台过大字报：今晚是国潮香水大促，离500万生死单不到三小时。大厂家突然反悔想核减核心赠品的配送，否则就撕约下播。",
        illustration: "🎤",
        options: [
          {
            text: "怒敲台子对质：“没有好赠品老铁买个屁！我自己贴工资提成买送！”",
            subtext: "粉丝大于天：守信和老铁们的拥护是真正的立足金饭碗，大搞江湖快感抢粉！",
            effects: { connection: 25, wealth: -15, peace: 10 },
            narration: "你自掏提成保下了赠品，大老铁们感动大哭。当夜场观十万创新高，虽说带得个人利润大折算，但你赢下了极稳固的人缘神盾。"
          },
          {
            text: "妥协跟进修改高大上说词，全力煽动限时购买快感",
            subtext: "顺资本流：配合大厂高频话术包装，在大喉咙和限量饥渴叫嚣下哄抬情绪爆单。",
            effects: { wealth: 25, freedom: -10, peace: -10 },
            narration: "你的专业销售说词令人叹为观止。成功完成带货回款大达标。你收获了高昂抽佣，但卸完华丽大妆看着镜子，总深感被风机抽干的虚冷。"
          }
        ]
      },
      {
        time: "20:00",
        period: "noon",
        sceneTitle: "千万价格错标大爆危机",
        description: "在数万催促弹幕喧闹中，助理惊骇发现199元的美白套盒由于后台错标，标成了19.9原！不到五秒钟，大数额五千单已被抢光！",
        illustration: "⚡",
        options: [
          {
            text: "大喝一声：“抢下了就是好朋友，主播负责全赔！发货发全！赞给我刷破亿！”",
            subtext: "神级危机转机：将千万血亏一手改成爆红正义口碑大噱头，让直播一炮走红！",
            effects: { connection: 30, peace: 15, wealth: -25 },
            narration: "各大社交圈狂写“豪气主播买亏”。礼物狂刷，大主播格局树立！不过也确实清空了你快攒了整年的血金准备。"
          },
          {
            text: "秒速闭架下机，发布“系统撞库遭攻击，致电致歉红金退款挽回”声明",
            subtext: "理法止损：大失误属民法可抗，不能盲目承担不理智亏失。用完备条款降损退回。",
            effects: { wealth: 20, connection: -20, peace: 15 },
            narration: "商品及时撤架止红损失。但退单处大批粉丝叫骂退群，虽然银钱安全保住，但潮水狂骂让你感觉有些窒息。"
          }
        ]
      },
      {
        time: "01:30",
        period: "afternoon",
        sceneTitle: "江边长夜卸妆失重",
        description: "惨白的大灯悉数关闭，上万繁杂货盒静默在冷冷舱底。成交数字冻结在惨烈的720万，你喉骨剧痛眼神干爆。你会怎么过：",
        illustration: "💤",
        options: [
          {
            text: "硬着嗓子开几分钟无美颜淡滤播，和几百守候死忠粉丝说心里话",
            subtext: "卸面具拥温情：聊聊辛劳，聊聊在三十多度大广州搏打的寂寞，真情过夜。",
            effects: { connection: 25, peace: 15, freedom: -10 },
            narration: "大伙刷大爱和晚安在屏幕上，让你瞬间感到你在这个巨大的欲望之网中，有一条安全的体温挂怀在抱护着你的脆弱。"
          },
          {
            text: "拉严口罩，驾着电托车去吹十几分钟寂静的江边晚风",
            subtext: "抽身放空：隔绝尘喧与叫嚣，听听潮涨，把塞饱的口红促销泡沫全扔到江风外。",
            effects: { freedom: 25, peace: 30, wealth: 5 },
            narration: "江波绿融，梧桐在冷冷的半夜散出淡淡土气。你用力咳嗽了几下，将胃里灌了一宿的管理黑话和焦躁促销一并还给了风。"
          }
        ]
      }
    ]
  },
  {
    id: "film_beijing",
    title: "光影造梦",
    subtitle: "电影制片助理的一天",
    career: "电影宣发 (Film Industry)",
    city: "北京 (超一线城市)",
    lifestyle: "小资生活 · 荧屏格子间的造梦苦行",
    vibe: "无尽改稿、路演排期、大咖档期、深夜咖啡、璀璨落暮",
    duration: "3分钟艺术副本",
    coverImage: "linear-gradient(135deg, #1e2937 0%, #374151 50%, #4b5563 100%)",
    difficulty: 4,
    freedom: 35,
    connection: 60,
    wealth: 50,
    peace: 45,
    scenarios: [
      {
        time: "10:00",
        period: "morning",
        sceneTitle: "流量主演放鸽子大危机",
        description: "朝阳名导大本：今夜首映红地毯，坐拥巨粉的主号男主角突以“团队化妆设计不衬气质”罢工拒出北京场，而几百家重磅娱记已经登记进席。",
        illustration: "🎬",
        options: [
          {
            text: "私聊片商，半求半逼晓以大排期义利大拉和情面",
            subtext: "交际博弈：软硬兼施拍胸口，动用未来的宣传宣推做诱饵让其戴棒球帽素颜登台！",
            effects: { connection: 20, wealth: -5, peace: 10 },
            narration: "成功妥协现身！闪光大作狂闪！大公关危机化去，累瘫了你在昏黄通道后面大大顺了一口大惊气。"
          },
          {
            text: "出示法律合同通知违约并照行代文公函，宣信主演老伤复发致歉",
            subtext: "契约神圣：绝不向坏艺风屈膝，用危机文案和冷冷法案极速保全电影本身商业线。",
            effects: { wealth: 15, connection: -15, peace: 15 },
            narration: "行文规范发布。虽保住了制作法理本身完备硬底，但明星工作室把你私信黑名单拉入，人际圈顿时有些僵结冷清。"
          }
        ]
      },
      {
        time: "13:15",
        period: "noon",
        sceneTitle: "遭遇水军恶意退票控评风暴",
        description: "中午啃干瘪盒饭，豆瓣微博突然有毒大喷大刷“剧情一坨，剪辑稀烂”，惊闻可能遭遇别的主控买号恶意打击，大排片朝夕大腰斩。",
        illustration: "📉",
        options: [
          {
            text: "促使导演半夜发赤诚初心千字笔墨大打赤心真诚牌",
            subtext: "真红不靠买：真心换人心。倾其大心血历程，用赤道美去呼唤爱片之人心灵大护法。",
            effects: { connection: 25, peace: 20, wealth: -15 },
            narration: "自来水一涌而上自救！大字信收获无数真诚泪赞，票房意外大盘逆势大翻越，完成了赤心向上的传奇美作。"
          },
          {
            text: "速动两万公关款，请人反向扑杀做知性控评",
            subtext: "资本肉搏：在商言商，用商业对抗商业！以千万高知词眼拼干遮盖偏门黑贴保住回点。",
            effects: { wealth: 15, connection: -10, peace: 10 },
            narration: "大文攻守战。排片和流水顺利护盘成功。但这层漂亮的评分数据下面，有多少真实属于大众的赞叹，谁也心里犯迷。"
          }
        ]
      },
      {
        time: "17:00",
        period: "afternoon",
        sceneTitle: "红毯流金与拷贝机房的失重",
        description: "首映大圆满。金光长裙大主角在台子和百亿大佬香槟开怀，而你吃得嘴巴里冰冷面包，还要背三十斤的数字硬盘去地库重装备份，心情失重：",
        illustration: "🥂",
        options: [
          {
            text: "换上礼服提杯跨上台，和一众主创重重递换名片",
            subtext: "不畏攀炎：闪闪星途也是名路，极尽所能展示自我，搭建向上大桥阶层。",
            effects: { connection: 25, wealth: 5, peace: -15 },
            narration: "你在微醺中加爆了数位核心制作高管的联系，大家在微信圈里交缠着光鲜亮光，感觉终于搭好了向上路标。"
          },
          {
            text: "单手拎包走出大楼，去亮马河畔买份热饺子看着水花散心",
            subtext: "尘归尘：华服造梦在身后，亮马河梧桐叶和普通老人的谈笑是带温实感自愈方。",
            effects: { freedom: 25, peace: 35 },
            narration: "亮马河边晚风吹树发响，小水灯光粼粼。吃一口韭菜暖饺，那些百亿和香槟泡沫在大脑里彻底散干净，心里一片极柔的轻明。"
          }
        ]
      }
    ]
  },
  {
    id: "homestay_dali",
    title: "苍山小栖",
    subtitle: "民宿主理人的一天",
    career: "民宿主理人 (Homestay)",
    city: "云南大理 (乡镇)",
    lifestyle: "平淡生活 · 守护慢时光的草木手艺人",
    vibe: "苍山雪、洱海风、多肉庭院、野生咖啡、民谣歌谣、日子很长",
    duration: "3分钟闲散副本",
    coverImage: "linear-gradient(135deg, #60a5fa 0%, #34d399 50%, #1e3a8a 100%)",
    difficulty: 2,
    freedom: 85,
    connection: 80,
    wealth: 45,
    peace: 75,
    scenarios: [
      {
        time: "09:00",
        period: "morning",
        sceneTitle: "热心肠换宿请求",
        description: "暖阳照进洱海，两个在大城市遭遇毕业失业、精疲力尽的大学生拘促站在门首：“老板，我们存款见底了，能在你院子教金毛狗画画教猫跳舞换宿一周不？”",
        illustration: "🏡",
        options: [
          {
            text: "“快请进！”泡上古树普洱，让他们烧柴除尘打理院落",
            subtext: "山野同忧：流浪在人间的灵魂总该落个温窝。钱不重要，大理不缺这几盘干饵丝。",
            effects: { connection: 25, peace: 25, wealth: -10 },
            narration: "小院里很快洒满欢声、除尘声和狗叫。你和两个被裁无路的孩子成了最温暖的交心知已。心里满满是体温的明亮。"
          },
          {
            text: "客气婉拒换工，但赠送避风自救大攻略指南",
            subtext: "在商言商：小舍自撑也是勉为其难资金紧巴巴，按规矩良性运营方得大久长久。",
            effects: { freedom: 20, wealth: 10, peace: 15 },
            narration: "大伙温顺谢过收下大理秘籍离去。账面保全完好，只是大娘给送的老茶叶里，稍微沾了一捧对浮世的微叹。"
          }
        ]
      },
      {
        time: "12:30",
        period: "noon",
        sceneTitle: "博主的小叶子大投诉",
        description: "中午，一位正摆着万分滤镜对咖啡拍美照的美妆网红博主尖吼大吵：说满树松香风吹进了一叶松针掉入她的燕麦拉花，弄脏了她的滤镜，要求免全房费退房。",
        illustration: "🐛",
        options: [
          {
            text: "陪上极其恬退笑意，雕一只干松木摆托杯赠予，带她看秋千松鼠",
            subtext: "山林智慧：大理的落叶才是天地风华，用大自然松弛的美把都市病给融平淡掉。",
            effects: { connection: 25, peace: 20 },
            narration: "她被秋千小松鼠的嚼核桃和你的温暖松弛打动。面色红红感到不好意思，销退并疯狂在自己的平台自来水推荐大温情宿小店。"
          },
          {
            text: "咖啡费全免，告知“旷野自然松叶本在野，概不因落叶退全房费”之明示",
            subtext: "契约有边：大山深处野地自居，松脂松叶是生态并非污秽。决不对不讲理买单。",
            effects: { wealth: 15, connection: -15, peace: 15 },
            narration: "她气鼓鼓退房离店。保全了可算计的小账大安全，但那抹不怀好意的负分退写也让你的小铺主页多了层寒意。"
          }
        ]
      },
      {
        time: "16:00",
        period: "afternoon",
        sceneTitle: "洱海落日火塘夜歌",
        description: "夕阳熔成流金，下洱海惊美无瑕。隔壁邻大叔在大院摆好了暖煨豆腐和老茶，邀你这就闭门一齐听民吉他唱歌，今晚恰好没有任何散客叩门门：",
        illustration: "🔥",
        options: [
          {
            text: "落巨锁！关柜台！提上箱啤冲向隔壁大唱歌",
            subtext: "虚虚度日光万万岁：洱海落日的十里银火比世间任何PPT更神圣，去踏浪吧老友！",
            effects: { freedom: 25, peace: 35, wealth: -5 },
            narration: "在一众流浪民艺乐手的沧茫大琴与歌中，你握着啤瓶流出两滴眼泪。这一夜，那些高维大厂、巨钱争执，统统化死在大里星河外。"
          },
          {
            text: "在台案敲笔急书发布种草爆贴宣发民宿",
            subtext: "创业自律：不能丢了宣发排期。蹭着洱海晚霞大热点抓紧修画，撰文推广引爆引流。",
            effects: { wealth: 20, freedom: -10, peace: -10 },
            narration: "长文红火上榜，收揽大一波爱宿大赞。你保质保量完成经营，但眼睑盯着电脑干辣发黏，总想不通这和在格子间加班深更差异去往何处。"
          }
        ]
      }
    ]
  },
  {
    id: "kol_chengdu",
    title: "镜头与风情",
    subtitle: "探店网红的一天",
    career: "网红 (KOL / Influencer)",
    city: "成都 (一线城市)",
    lifestyle: "小资生活 · 游走于风情街角的镜头猎人",
    vibe: "太古里打卡、粉丝催更、美妆美学、街角精酿、探店美学、滤镜人生",
    duration: "3分钟潮流副本",
    coverImage: "linear-gradient(135deg, #ec4899 0%, #db2777 50%, #9d174d 100%)",
    difficulty: 3,
    freedom: 70,
    connection: 65,
    wealth: 60,
    peace: 50,
    scenarios: [
      {
        time: "10:30",
        period: "morning",
        sceneTitle: "高奢下午茶PR审核大危机",
        description: "你打扮了两个小时来到太古里高奢茶馆拍推广美图。品牌PR看完初稿冷着脸说：“你这组相片太空灵了，品牌的大Logo根本不抢眼，退回去重修，一点半前上发！”",
        illustration: "🍰",
        options: [
          {
            text: "咬着牙妥协把Logo抠图挪高挪大，做大红高饱和设计",
            subtext: "甲方是衣食父母：为了每月可观的商推结款，损失点个人美学风格也是大自然的规律。",
            effects: { wealth: 15, freedom: -10, peace: -10 },
            narration: "相片修好了，甲方主管狂喜打款。但你自己看那张充塞着大商标的“暴发户”设计，感到审美审美阵痛。"
          },
          {
            text: "坚持空灵留白风格，用高深的画理艺术和色彩搭配说服PR",
            subtext: "美学捍卫者：真正的高奢卖的是空气和松弛感，Logo太满只会显俗、失掉中肯定位。",
            effects: { freedom: 15, connection: -5, peace: 15 },
            narration: "在你的美学轰炸下，PR表示信服并直接发了主帖，大赞你高级。虽然原定尾款因审核多卡了你一周。"
          }
        ]
      },
      {
        time: "13:30",
        period: "noon",
        sceneTitle: "流量诱饵与真实的本地烂肉面",
        description: "本想吃碗老火锅，一间新开张的精致有机轻食沙拉店发来快信：只要你在小红书随手带一条定位推贴，就可免去你388元的定制单吃，甚至另塞小红包：",
        illustration: "🥣",
        options: [
          {
            text: "化着笑意去沙拉店拍照，和老板合影表示好味",
            subtext: "互利合作：蹭顿大名声餐饭兼有红包，自媒体人的流量不正是这样累成大现金的么？",
            effects: { wealth: 10, connection: 15, peace: -5 },
            narration: "推贴瞬间收获了许多同城粉点赞。吃了一盘草和一碟番茄酸汁，虽然胃袋有点冰凉失重，但卡包感觉格外结实。"
          },
          {
            text: "自己掏钱买单老旧街角那碗烂肉面，踏实撸几串串",
            subtext: "不向流量交出味蕾：真正的成都滋味不需要向任何人打卡，只想吃对胃最踏实的烂肉面。",
            effects: { freedom: 20, peace: 20, wealth: -5 },
            narration: "被厚红油和温厚牛肉辣了一嘴油。你在狭窄路口听着老成都叔叔聊龙门阵，感觉灵魂在这个虚无的流量洪流里，长出了一寸温暖厚重的泥温根基。"
          }
        ]
      },
      {
        time: "16:30",
        period: "afternoon",
        sceneTitle: "太古里阶梯大合照罗生门",
        description: "探店同行的一起发布了下午的合照。你震惊发现她们只精致地修拔了自己的双下巴和黑眼圈，而把毫无准备有些歪脸的你，生生放在了原版暴露的角落里：",
        illustration: "🤳",
        options: [
          {
            text: "将自己随手拍摄的最原汁未修、高对比相片发到主推进行二次“自毁黑”",
            subtext: "真诚博弈：用大大咧咧的素颜大幽默圈粉，反打一个最富接地气的清流搞笑标签！",
            effects: { freedom: 20, connection: -10, peace: 15 },
            narration: "老铁们看到你毫无包袱、大大咧咧的素颜嘲，对你好感度疯狂拉拉。你活泼率真的反讽让别的同行相形之下有几分娇作。"
          },
          {
            text: "私信说笑请同行重发，同时礼貌用美拍软件帮全员精修一个好背景",
            subtext: "人情世故：塑料友情也是情，情面大过一切。帮大伙都精修一遍展现情商妥帖。",
            effects: { connection: 20, peace: -10 },
            narration: "大家嘻嘻哈哈互相置顶，一片繁花似锦的成都好风风。只是感觉为了维护这个镜头下的完美，你心眼有些紧紧酸辣。"
          }
        ]
      }
    ]
  },
  {
    id: "ecommerce_hangzhou",
    title: "齿轮与流量",
    subtitle: "电商创业者的一天",
    career: "电商 (E-commerce Business)",
    city: "杭州 (一线城市)",
    lifestyle: "社畜生活 · 四季青拿货与打样竞速",
    vibe: "滨江研发、供应链、四季青拿货、退货率博弈、投流竞价、不眠封箱",
    duration: "3分钟大卖副本",
    coverImage: "linear-gradient(135deg, #f59e0b 0%, #d97706 50%, #7c2d12 100%)",
    difficulty: 4,
    freedom: 35,
    connection: 55,
    wealth: 80,
    peace: 30,
    scenarios: [
      {
        time: "09:30",
        period: "morning",
        sceneTitle: "供应链工厂突然掉链缺料风暴",
        description: "滨江产业园：你今夜的主打预售爆款大衣在抖音上突然爆单，供应链大厂老总却突然发信息说遭遇进口面料缺损大断货，要延迟半个月出货！用户大催促排队退钱。",
        illustration: "📦",
        options: [
          {
            text: "一咬牙，出巨资大额全额包返，全员派发十张无门门槛返现代金大红包",
            subtext: "信誉第一：亏钱保人品，亏完这遭，也必须维护好淘宝/抖音小店的百年权重！",
            effects: { connection: 25, wealth: -20, peace: 15 },
            narration: "全店高赞你豪侠作风！退货率暴降，买家甚至疯狂转介绍，大保住了你大铺信用，在滨江站稳脚跟。"
          },
          {
            text: "死死督逼老总加班用拼色内衬代顶，或者让客服组话术阻断退红",
            subtext: "精于成本：用专业安抚话术去哄拖慢拖用户出货，把大流出货卡在规范极点省银两。",
            effects: { wealth: 20, freedom: -15, peace: -15 },
            narration: "通过拉锯硬拖把这波退单浪潮暂时挡了下去。顺利赶在最后死线出货完毕。不过店铺评分指数从好红灯滑向了小黄灯。"
          }
        ]
      },
      {
        time: "13:00",
        period: "noon",
        sceneTitle: "流量投流池子高额叫标抉择",
        description: "午后复盘，流量费用极速暴涨，下周是电商大狂欢，要不要把手头仅余的5万元运营流动资金，梭哈投入短视频高频竞价投流池里？",
        illustration: "💴",
        options: [
          {
            text: "全盘梭哈！买下大投流！把商品直接怼在滨江高能热推页首首",
            subtext: "流量就是生命：在这个快销局，没有竞标热度，你哪怕衣服再好也直接饿瘪！",
            effects: { wealth: 20, freedom: -10, peace: -15 },
            narration: "服务器流量曲线刺眼狂飙，商品瞬间爆单上千！你兴奋得肾上腺暴红。只是如果下月大户退款多一点，你资金链将面临崩溃风险。"
          },
          {
            text: "把5万元大留守，精心对大衣包装进行降耗环保材质二次提质优化",
            subtext: "产品即根基：在投流买水没有穷尽的战网里，把包裹面料包装搞暖心方是长治之策。",
            effects: { connection: 20, peace: 20, wealth: -10 },
            narration: "爆单没有来，但收到包装的买家纷纷因你温暖的手风设计惊叹，给出了自来水狂贴长推荐。你避开了烧流量的深渊梦，心底舒泰不少。"
          }
        ]
      },
      {
        time: "16:00",
        period: "afternoon",
        sceneTitle: "遭遇大竞品无德恶意差评攻击",
        description: "隔壁滨江园区的一个同品竞品为了抢占坑位，买了一批号在你的小页狂刷“有浓烈甲醛、做工像破布，穿了皮肤起炎字”的恶毒长黑帖：",
        illustration: "🗯️",
        options: [
          {
            text: "一不做二不休，直接贴上自己的SGS绝对无毒甲醛证书并发布硬核反击视频",
            subtext: "极力死磕：清白容不得半分墨，不删帖、不逃避，用最硬的数据把无德竞争者送上热收。",
            effects: { freedom: 20, peace: 15, connection: 10, wealth: -5 },
            narration: "你的专业和刚硬圈粉无数！消费者大赞店主硬骨，店庆爆单！那家竞品在心虚里默默撤销了所有抹黑黑通告。"
          },
          {
            text: "息事宁人，大私下交两千块钱“删除保护酬金”息事息灾",
            subtext: "效率至上：大生意人没有功夫和流氓扯头发，两千块保住不退款即是最大胜利。",
            effects: { wealth: 15, connection: -15, peace: 10 },
            narration: "帖子没了。你安安静静保全了当天的发货排班。只是被抢钱的羞闷感在嗓子里噎得很是难受，想不通这算什么自由致富。"
          }
        ]
      }
    ]
  },
  {
    id: "engineer_shenzhen",
    title: "代码与突围",
    subtitle: "研发工程师的一天",
    career: "工程师 (Engineer)",
    city: "深圳 (超一线城市)",
    lifestyle: "社畜生活 · 极客代码与红牛相伴的突突围",
    vibe: "腾讯大厦、前海湾、高频重构、架构争论、突发告警、红牛续命",
    duration: "3分钟极客副本",
    coverImage: "linear-gradient(135deg, #0284c7 0%, #0369a1 50%, #075985 100%)",
    difficulty: 4,
    freedom: 35,
    connection: 55,
    wealth: 85,
    peace: 30,
    scenarios: [
      {
        time: "09:45",
        period: "morning",
        sceneTitle: "重构与脏代码交锋",
        description: "刚到南山科技园。业务老大在群组里公开说明，因为下周有天价高奢商战，排单红线紧逼，要你直接在旧数据库上塞个大补丁，彻底不予大体检重构了。",
        illustration: "👩‍💻",
        options: [
          {
            text: "老老实实听话加补丁框架，让脏脏代码越塞越大",
            subtext: "工具人哲学：架构烂不烂关我打工人何事，只要死线赶得上，不扣季度绩效就是胜利。",
            effects: { wealth: 10, freedom: -10, peace: -15 },
            narration: "写完了精美快速不重构。安全卡死死线。只是你自己看着那坨像蜘蛛网一样的补丁，深知下半季度维护一定是深渊炼狱。"
          },
          {
            text: "当面出具数据泄露红线，并坚持写一份完美的重构对比PPT争取排班",
            subtext: "极客精神：作为软件工程师，眼皮底下不允许屎山代码无限蔓延！",
            effects: { freedom: 15, connection: -10, peace: 15 },
            narration: "老大被你专业的系统反驳给震撼到了，同意多给你四天做架构升级。你心满意足地喝了一大口冰红牛。"
          }
        ]
      },
      {
        time: "12:30",
        period: "noon",
        sceneTitle: "中餐啃面还是在工位底下“深度暴睡”",
        description: "午后，隔壁研发组长拉你去吃人均120的金融城烤肉，席间大伙拼命想八卦和打听你的核心专利算法究竟如何申请的个人分成专利。",
        illustration: "🥩",
        options: [
          {
            text: "笑脸参与烤肉会，推杯换盏积极圈入大厂人脉网",
            subtext: "人脉打拼：大公司不仅是干活，打探专利走向和高管八卦是对自己的长线防守！",
            effects: { connection: 15, wealth: -10, peace: -5 },
            narration: "你们相互交换了许多关键内幕小消息。虽然吃了一嘴油很累，但是你在这个深渊里拿到了张小关系网盾牌。"
          },
          {
            text: "客气婉拒去休息，把行军大躺椅拖出，塞上耳套在黑暗里物理断电五十分钟",
            subtext: "生理电网自救：人际纠纷全去见鬼，我的脑神经在上午的张量乘法中已经烧穿了，唯有睡眠无死角自救！",
            effects: { freedom: 15, peace: 25, connection: -10 },
            narration: "重重的死睡眠让你大脑彻底清洗了缓存，起来再干活感觉眼前清亮无比。在没有八卦的世界里，你才是代码的救世王。"
          }
        ]
      },
      {
        time: "15:45",
        period: "afternoon",
        sceneTitle: "线上爆系统大死锁告警",
        description: "突发业务爆单导致线上核心账户账目被高频死锁死扣！大组群里微信震动疯掉，老大勒令你和两个兄弟十五分钟找出溢出代码，否则后果自负！",
        illustration: "🚨",
        options: [
          {
            text: "独自关闭微信大阻断，凭个人高深的内核分析，在命令行把漏洞揪住上推",
            subtext: "战神突击：最精尖的研发永远在寂寞前单兵解决爆点。把功劳独吞，震爆部门！",
            effects: { wealth: 20, freedom: -5, peace: -15 },
            narration: "你通红的双眼硬生生从几万条栈里抓准了问题。老板狂发红包大赞！你的个人专利分成地位坐得铁铁般稳，只是脑溢感极强。"
          },
          {
            text: "叫齐大伙，用白板排产协作、分工排查问题，并把解决框架分享给全团队",
            subtext: "大合作魂：大事故不抢功、讲合力。带出团队大合群，是真正合格的研发合伙人身骨。",
            effects: { connection: 20, peace: 15, wealth: -10 },
            narration: "通过无瑕合作五分钟就将死锁解除。虽说功劳被大家分留了，但是大伙看你这个中流砥柱的目光充满了崇山般的信服。"
          }
        ]
      }
    ]
  },
  {
    id: "sales_suzhou",
    title: "酒樽与筹码",
    subtitle: "大客户销售的一天",
    career: "销售 (Sales Specialist)",
    city: "苏州 (二线城市)",
    lifestyle: "小资生活 · 工业园区酒会与签单拉锯",
    vibe: "工业园区、酒会博弈、高额提成、合同签单、高频率出差",
    duration: "3分钟竞技副本",
    coverImage: "linear-gradient(135deg, #10b981 0%, #0d9488 50%, #0f172a 100%)",
    difficulty: 4,
    freedom: 40,
    connection: 75,
    wealth: 80,
    peace: 35,
    scenarios: [
      {
        time: "10:00",
        period: "morning",
        sceneTitle: "竞品大放水底价恶意抢单",
        description: "刚在工业园区停好车。老合伙人大客户突然给你微信通知：一家德国大竞品突然报出了跌15%的跳水血亏底价，要把你手头这笔核心的大单硬生硬抢过去！",
        illustration: "💼",
        options: [
          {
            text: "跟进大申红！向总部申领超级折扣底价比拼大厮杀",
            subtext: "战狼拼杀：在这盘红海里没有妥协！砸碎一切高额利润，必须先将大单抢下再说！",
            effects: { wealth: 10, freedom: -10, peace: -15 },
            narration: "总署批了价。单子守住了，老总大赞你刚烈护盘。不过为了这个无额利润，你下一季度提成基本上全部灰飞烟灭白干。"
          },
          {
            text: "拒不拼价，直接拉团队登大客户工厂，奉上最新的高效售后服务免人工和专利优化保包",
            subtext: "品质胜降：一味拼低价只会让客户产生廉价疑虑，用无瑕的服务和品牌体面胜出。",
            effects: { connection: 20, peace: 15, wealth: -5 },
            narration: "通过精深得体的演示，客户终于对你的体面与周密叹服，维持原单价格签。你把外商那套恶意放水，硬生生砸死在体面外。"
          }
        ]
      },
      {
        time: "12:30",
        period: "noon",
        sceneTitle: "重胃病遭遇大金主陪醉杯盏",
        description: "中午园区商务，金主大手拍你肩膀，豪点了几瓶天价白酒：“小苏啊，想吃这一期一千万的设备单，大伙就得痛痛快快干它几碗！感情都在这酒里呀！”而你昨晚由于赶飞机胃部还在剧烈微痛：",
        illustration: "🍶",
        options: [
          {
            text: "两眼一闭大端起，干它三碗大白酒！",
            subtext: "销售天理：拼了这老胃，舍命陪君子！只要杯子一响，黄金万万两！",
            effects: { wealth: 20, connection: 15, peace: -20 },
            narration: "你喝得不省人事被扛大门，一千万合同下午两点利落签字！只是当晚你在苏大二附院急诊输液的时候，抱着冷冷铁架有些惨淡。"
          },
          {
            text: "面露真挚歉意，大方说明胃炎刚出院，自掏提成多赠送大客户两组高定高定特务特配",
            subtext: "情商制胜：用专业的真诚和另外实质的安全优惠来替代拼身体，用周密化去酒局俗气。",
            effects: { peace: 15, freedom: 10, connection: 10, wealth: -10 },
            narration: "董事长先是一愣，随即大赞你有骨气、做事极有分寸有规，不搞坏酒风。单子顺利签下。你在暖暖的苏帮茶里，深感自己依然是高超自洽者。"
          }
        ]
      },
      {
        time: "16:15",
        period: "afternoon",
        sceneTitle: "客户合同由于法务卡死死锁",
        description: "快下午要正式盖章听证，大客户公司的极度死板法务以“物流运送延迟两小时没有明文赔罪”为借口，卡死死扣流程，拒不签字返还。",
        illustration: "🖋️",
        options: [
          {
            text: "自己掏钱直接租一辆高定同城超级直配摩托，当场在合同里死签延迟自掏两倍赔付",
            subtext: "效率战神：没有任何一处小绊马锁能够绊倒高级销售的步伐。快速大梭哈！",
            effects: { wealth: 10, connection: 15, freedom: -10 },
            narration: "高货顺利安全抵达。大客户公司上下无不被你这等不要命的“特工效率”震服。大合同完美签。只是看那笔垫资单，提成大抠大块。"
          },
          {
            text: "叫出自己的法治长手直接坐在法务办公室在原则范围做合理的退返和折价妥协",
            subtext: "制度制衡：法律纠纷用法理说词破，在冷冷底价前不纵容其卡关，以公司大制度震慑。",
            effects: { freedom: 15, peace: 15, connection: -15 },
            narration: "由于你们法理高深强势，大客户法务迫于总务压力老实签了字。虽然关系不免有点尴尬，但你安安全全为全公司挣回了最干净的硬提成。"
          }
        ]
      }
    ]
  },
  {
    id: "tea_grower_anxi",
    title: "茶香与微澜",
    subtitle: "铁观音茶农的一天",
    career: "民宿主理人 (E-commerce / Modern Craftsman)",
    city: "福建安溪 (乡镇)",
    lifestyle: "平淡生活 · 梯田青翠中的手艺人家",
    vibe: "梯田青翠、手工摇青、木炭烘焙、日子很慢、山中品茶",
    duration: "3分钟自洽副本",
    coverImage: "linear-gradient(135deg, #0d9488 0%, #14b8a6 50%, #1e3a8a 100%)",
    difficulty: 2,
    freedom: 80,
    connection: 75,
    wealth: 50,
    peace: 75,
    scenarios: [
      {
        time: "08:30",
        period: "morning",
        sceneTitle: "春茶暴雨采摘劫",
        description: "清早的大梯田上。春茶铁观音正是最好闻、最贵重的采摘死线，但远方有一抹暴雨雷电乌云飘来，大有在半小时内彻底冲刷掉叶芽之势。",
        illustration: "🍵",
        options: [
          {
            text: "带齐大伙，连滚带爬漫山冒着细雨极限抢采鲜芽",
            subtext: "劳力打拼：抢下这遭春茶，今年新装民宿的砖金就有大着落，和老天爷竞速！",
            effects: { wealth: 15, freedom: -10, connection: 10 },
            narration: "你在泥塘里滚了满身土抢了十来篓。满面热柴。晒干了做烘焙，茶叶虽然有些沾水，但这笔生活资本算是稳扎稳打抢了回来。"
          },
          {
            text: "不予冒犯大自然，客客气气在山腰小廊煮剩茶看雨落",
            subtext: "天命由天：雨水冲灌本是茶叶的劫，老天爷不想给的便不去抢，留步清香。",
            effects: { freedom: 20, peace: 25, wealth: -10 },
            narration: "雨下得天塌地陷。你泡了壶隔年铁观音给农友分着喝。虽然减产了三十筐，但这一场漫漫听雨天，让你脑海里多了层山林无底的温宁。"
          }
        ]
      },
      {
        time: "13:00",
        period: "noon",
        sceneTitle: "外来天价收购商大合同刺探",
        description: "中午，一位来自高端礼品链的总揽商狂甩合同，要把你这满院的非遗手艺铁观音茶以批发底半价一口买断。要你立即盖章，以后你的茶只能套他的品牌名字上发。",
        illustration: "🏷️",
        options: [
          {
            text: "快速签字，乐得一年流水无忧、不搞自产自销大宣发",
            subtext: "金线落袋：自留品牌宣发、淘宝客服简直累瘪人。拿上一笔钱，逍遥茶山！",
            effects: { wealth: 15, freedom: 5, peace: -10 },
            narration: "顺利卖了三十大箧，卡卡进账！你终于不用面对那些纠结的自媒体差评和订单。只是在晚上看着大卡包，觉得手上没有一两香气真正留存，像是个无牌打工客。"
          },
          {
            text: "客气送出门，坚持自家独立小山村手艺名字和抖音小页自销自度",
            subtext: "手艺脊骨：非遗传承不需要假借高奢套壳！相信一针一叶的铁骨温度，终能连接知已。",
            effects: { freedom: 20, connection: 15, peace: 20, wealth: -10 },
            narration: "退货了天价大批发。你继续在火膛下用松炭烘茶制叶。当宿，一位高端博彩高总在网上看了你手工摇青的沙沙白噪音，特意致信重金买下一整年的“极品私家珍铁”。你心平气和洗了温热的手。"
          }
        ]
      },
      {
        time: "16:30",
        period: "afternoon",
        sceneTitle: "小山村传统手摇青工作坊",
        description: "下午有十几个村里的小孩子提着书包在篱笆门首看你，眼里满是热望：“匠人大叔，你能教教我们如何手工搓茶和摇青吗？”这事情既无半分工资还极为繁长折腾：",
        illustration: "🍂",
        options: [
          {
            text: "卸下书包！一秒在大水缸和竹筐边高高兴兴玩开，教孩子们翻新叶",
            subtext: "传承大爱：人情在此，山重香火。教孩子知茶爱土，比在账面上多加一个零有底气得多。",
            effects: { connection: 25, peace: 25, wealth: -5 },
            narration: "院里洒满了稚子笑声和叶子的沙沙抖动，清风掠过梯田。你在满院的嬉闹里，觉得在这个巨大的、疯狂转的高温大城池外面，找到了最干净、最稳妥的非遗体温传承。"
          },
          {
            text: "给孩子们抓一袋本地甜糕，发个小科普小微录音叫其回家跟着自拍",
            subtext: "精益自守：手工茶叶烘焙正是最重压的高温大关节点。保持工科学效率，客客气气分留。",
            effects: { wealth: 10, freedom: 10, connection: -15 },
            narration: "孩子们拿着糕点喜庆笑着回家。你继续对着八百度大烘炉排汗。安全无任何意外，制出高标十斤王，只是看着孩子走后的空院子，心里略觉得稍微多了层苍尘之感。"
          }
        ]
      }
    ]
  }
];
