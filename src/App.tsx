import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import {
  Sparkles, Trophy, Archive, ArrowLeft, RefreshCw, Compass, Heart, 
  Briefcase, Zap, MapPin, Smile, Award, CheckCircle2, ChevronRight, 
  Send, Camera, Smartphone, Wifi, Battery, Share2, Star, Target, 
  Lock, AlertCircle, Bookmark, PlusCircle, PenTool, Flame, ArrowRight,
  Home, TrendingUp, BarChart3, Lightbulb
} from "lucide-react";
import { CUSTOM_TRIALS } from "./data";
import { CustomTrial, ChoiceRecord, SavedResult } from "./types";
import { saveResultToServer, fetchResultsFromServer, deleteResultFromServer, fetchTrialsFromServer, loadFromLocalStorage, saveToLocalStorage, clearLocalStorage } from "./api-client";
import { subscribeTrials, subscribeResults } from "./supabase";

const EVENING_OPTIONS = [
  {
    id: "gym",
    icon: "🏋️",
    text: "下班健身锻炼",
    subtext: "在健身房里挥洒汗水，通过力量与有氧运动排解白天的压力，重拾身体活力。",
    effects: { happiness: 10, health: 15, stress: -15, growth: 5 },
    narration: "哑铃撞击与心跳呼吸达成奇妙的共鸣。汗水流过红润的皮肤，脑内啡疯狂分泌，让你感到久违的掌控底气。"
  },
  {
    id: "gaming",
    icon: "🎮",
    text: "爽快打会儿游戏",
    subtext: "握紧手柄，一秒沉浸在开放世界或者网络竞技中，抛开所有繁复的职场纷扰。",
    effects: { happiness: 20, health: -5, stress: -20, growth: 0 },
    narration: "光影闪烁，戴上降噪耳机，你瞬间在数字世界中攻城掠地。至于明早的设计稿，就让它先停在虚空吧！"
  },
  {
    id: "tv",
    icon: "🎬",
    text: "缩在沙发上追剧",
    subtext: "点一碗热排骨汤，找一部心仪已久的电视剧、爆笑综艺连续播放，彻底断电不社交。",
    effects: { happiness: 15, health: -2, stress: -15, growth: -2 },
    narration: "微弱的屏幕彩光映在你的脸上，面汤的热气腾起，幽默的对白驱散了写字楼里穿戴了一整天的紧绷外壳。"
  },
  {
    id: "colleagues",
    icon: "🍻",
    text: "与同事下班聚餐",
    subtext: "在附近热气腾起的深夜小馆里，和熟知的小工友吃烧烤喝酒，吐槽各种奇葩需求。",
    effects: { happiness: 15, health: -10, stress: -12, growth: 12 },
    narration: "碰杯的清脆声中，满脑子的需求迭代化为了酒桌上的笑谈，人脉与默契在炭火香气里悄悄织牢。"
  },
  {
    id: "study",
    icon: "📚",
    text: "学习/考证自我充电",
    subtext: "关掉任何娱乐软件，翻开原版专业图书，为明天的技能跃阶跳槽准备关键证书。",
    effects: { happiness: -5, health: -5, stress: 15, growth: 25 },
    narration: "台灯洒下安静的白光，划线做笔记的沙沙声中，你感到一种由知识带来的自我成长的踏实安定。"
  },
  {
    id: "rest",
    icon: "🏠",
    text: "宅家安安静静休息",
    subtext: "不社交、不看任何工作微信，泡个热水澡早早钻进暖洋洋的被子里香甜大睡。",
    effects: { happiness: 12, health: 20, stress: -20, growth: 0 },
    narration: "被窝充盈着舒服淡雅的阳光气。静静听着自己悠长的呼吸，没有工作消息吵耳，灵魂在温存中满电复活。"
  },
  {
    id: "creative",
    icon: "🎨",
    text: "业余爱好手工艺术创作",
    subtext: "在画板上胡涂乱画、弹几首吉他曲，或写两句诗，在创造的留白里寻回自我主调。",
    effects: { happiness: 18, health: 5, stress: -15, growth: 10 },
    narration: "指尖弹拨出的欢笑音符，或画纸上晕染跳动的油墨，拼凑出了白天被机械化重复工作剥除的真实自我。"
  },
  {
    id: "cycling",
    icon: "🚴",
    text: "骑单车漫游穿梭夜晚",
    subtext: "踩上单车，沿着空寂平整的夜风自行车道一路疾驰，感受速度同夜色的温柔碰撞。",
    effects: { happiness: 15, health: 15, stress: -15, growth: 2 },
    narration: "夜风疯狂灌进单薄的衣袖，霓虹化为身旁一尾梦幻的彩光带，双腿高频摆动卸掉了压在胸口的所有负重。"
  },
  {
    id: "walk",
    icon: "📷",
    text: "城市漫步探店去发呆",
    subtext: "用脚步在陈旧的弄堂闲逛，随性路过刚出炉的面包房，挑选一个让人心情变好的小点心。",
    effects: { happiness: 15, health: 8, stress: -12, growth: 5 },
    narration: "空气里飘满刚烘焙出的碱水香。看着街心玩球的小狗与聊天的主妇，你在漫无目的中感到被生活重新抱入怀中。"
  },
  {
    id: "drama",
    icon: "🎭",
    text: "先锋实验话剧/看艺术展",
    subtext: "去艺术黑匣子剧场或者艺术画廊里静坐一小时，看一出能够共情痛切内省的作品。",
    effects: { happiness: 16, health: 2, stress: -10, growth: 8 },
    narration: "黑暗静默的座位上，演员纯粹深挚的表白震颤鼓膜。白日职场无法排空的各种隐忍，都在这一刻得到了艺术性的释怀。"
  },
  {
    id: "date",
    icon: "❤️",
    text: "浪漫约会亲密陪伴",
    subtext: "和心仪的那个TA挑选一处柔和的面包餐厅，手拉着手漫步畅想未来，在怀抱中自愈。",
    effects: { happiness: 25, health: 5, stress: -18, growth: 0 },
    narration: "烛光轻轻摇曳。对面亮晶晶的注视和伸过来默默轻捏你手心的手，让你确切感到，被爱才是驱散焦虑的最佳解药。"
  }
];

const WEEKEND_OPTIONS = [
  {
    id: "short_travel",
    icon: "✈️",
    text: "短途周边逃离旅行",
    subtext: "买一张邻市的高铁票，奔向山里搭帐篷、或者海滩边听浪散心，给日常来一次格式化。",
    effects: { happiness: 25, health: 10, stress: -20, growth: 0 },
    narration: "跨出出站口的一瞬，大自然潮湿蓬勃的草木泥香扑面袭来，感觉钉钉界面和各种周报都被无限拉远了。"
  },
  {
    id: "weekend_gaming",
    icon: "🎮",
    text: "痛快打游戏一整天",
    subtext: "拉严百叶窗，备足气泡水。不论是3A大作还是组队开黑，全沉浸式大杀四方！",
    effects: { happiness: 22, health: -8, stress: -25, growth: -2 },
    narration: "沉浸在宏大的史诗配乐和精确的手柄马达回馈中，在这里，你有无可置疑的掌控力，再无繁琐的任务逼宫。"
  },
  {
    id: "sport_training",
    icon: "🏃",
    text: "约人运动训练/登山",
    subtext: "约工友来盘羽毛球肉搏争锋，或者进行一次5h+的攀升野外拉练，激活运动活力。",
    effects: { happiness: 18, health: 22, stress: -15, growth: 5 },
    narration: "大泡的汗水从脸颊滴落。虽然双脚有些微酸，但山顶吹来的清凉岚风像一捧圣水，把心头的阴沉完全洗濯一净。"
  },
  {
    id: "friend_party",
    icon: "🍺",
    text: "死党痛快聚会开趴",
    subtext: "和相交多年的死党死撑在一起吃火锅、或者唱K、玩桌游，展现卸下伪装最真实的自己。",
    effects: { happiness: 25, health: -10, stress: -20, growth: 5 },
    narration: "大家端着啤酒杯毫无忌惮地调侃年少糗事。在这里，没人管你能不能给老板顶线交付，你只是可以任意撒娇的自己。"
  },
  {
    id: "weekend_stay",
    icon: "🏠",
    text: "宅家舒服放空充电",
    subtext: "睡到大自然醒，沏一壶咖啡、给小猫修下指甲，在松软柔和的日光里，发呆一整天。",
    effects: { happiness: 15, health: 15, stress: -20, growth: 0 },
    narration: "闭死门。微风拂过阳太把晾晒后的松软香气吹入厅室。生活仿佛调成了0.5倍速，温柔，绵长，安静无比。"
  },
  {
    id: "weekend_study",
    icon: "📖",
    text: "闭关突击学习考证",
    subtext: "背着全套教材去安静写意的自修室，啃一整天行业前沿底层课目，充实内心确定性。",
    effects: { happiness: -8, health: -8, stress: 20, growth: 30 },
    narration: "笔尖做题的急沙声不曾休止。虽然解题烧脑后微感眩晕，但看着长长一排自习清单被打上Check，你心底的职业底座空前牢靠。"
  }
];

export default function App() {
  // Mobile UI States
  const [currentScreen, setCurrentScreen] = useState<"lobby" | "detail" | "story" | "evening" | "weekend" | "loading" | "settlement" | "archive">("lobby");
  
  // Custom Confirmation Modal State
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    description: string;
    onConfirm: () => void;
  } | null>(null);

  const showConfirm = (title: string, description: string, onConfirm: () => void) => {
    setConfirmModal({
      isOpen: true,
      title,
      description,
      onConfirm: () => {
        onConfirm();
        setConfirmModal(null);
      }
    });
  };

  // Helper to change screen and keep URL Hash router in sync
  const navigateTo = (screen: "lobby" | "detail" | "story" | "evening" | "weekend" | "loading" | "settlement" | "archive") => {
    window.location.hash = screen;
    setCurrentScreen(screen);
  };

  // Trial Processing States
  const [selectedTrialId, setSelectedTrialId] = useState<string>("pm_shanghai");
  const [currentScenarioIndex, setCurrentScenarioIndex] = useState<number>(0);
  const [trialChoices, setTrialChoices] = useState<ChoiceRecord[]>([]);
  const [reflectionText, setReflectionText] = useState<string>("");
  const [nickname, setNickname] = useState<string>("");
  const [chosenEveningId, setChosenEveningId] = useState<string | null>(null);
  const [chosenWeekendId, setChosenWeekendId] = useState<string | null>(null);

  // Tone Filtering State
  const [selectedTone, setSelectedTone] = useState<string>("all");

  const getTrialTone = (trialId: string): string => {
    const geekIds = ["ai_beijing", "engineer_shenzhen"];
    const slowIds = ["designer_hangzhou", "flight_attendant_shenzhen", "homestay_dali", "kol_chengdu", "tea_grower_anxi"];
    if (geekIds.includes(trialId)) return "geek";
    if (slowIds.includes(trialId)) return "slow";
    return "corp"; // Default to corporate / 大厂齿轮
  };
  
  // Dynamic Trials List (from Supabase or fallback to local)
  const [trials, setTrials] = useState<CustomTrial[]>(CUSTOM_TRIALS);

  // Attributes State (Ranges 0 - 100)
  const [attrs, setAttrs] = useState({
    happiness: 50,
    health: 50,
    stress: 30,
    growth: 50
  });

  // Highlight points for animation feedback (+10 Wealth, etc.)
  const [notification, setNotification] = useState<string | null>(null);

  // Archive & Historical States loaded from localStorage
  const [savedRecords, setSavedRecords] = useState<SavedResult[]>([]);
  
  // Settlement Screen API response
  const [settlementData, setSettlementData] = useState<any>(null);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Selected Trial for Detail screen
  const activeTrial = trials.find(t => t.id === selectedTrialId) || trials[0];

  // Dynamic iPhone status bar clock updates
  const [currentTimeStr, setCurrentTimeStr] = useState("11:10");

  useEffect(() => {
    // 优先从后端 API 加载存档，失败则 fallback 到 localStorage
    (async () => {
      try {
        const serverResults = await fetchResultsFromServer();
        if (serverResults && serverResults.length > 0) {
          setSavedRecords(serverResults);
          // 同步到 localStorage 作为缓存
          saveToLocalStorage(serverResults);
        } else {
          // API 无数据或失败，从 localStorage 读取
          const localRecords = loadFromLocalStorage();
          if (localRecords.length > 0) {
            setSavedRecords(localRecords);
          }
        }
      } catch (e) {
        // 网络异常时回退到 localStorage
        console.warn("[App] Failed to load from server, using localStorage:", e);
        const localRecords = loadFromLocalStorage();
        if (localRecords.length > 0) {
          setSavedRecords(localRecords);
        }
      }
    })();

    // 同时从 Supabase 拉取最新副本列表
    fetchTrialsFromServer().then((serverTrials) => {
      if (serverTrials && serverTrials.length > 0) {
        console.log(`[App] Loaded ${serverTrials.length} trials from server.`);
        setTrials(serverTrials);
      } else {
        console.log("[App] Using local CUSTOM_TRIALS as fallback.");
      }
    }).catch((e) => {
      console.warn("[App] Failed to fetch trials from server:", e);
    });

    // Dynamic timer updates
    const timer = setInterval(() => {
      const d = new Date();
      const hrs = d.getHours().toString().padStart(2, "0");
      const mins = d.getMinutes().toString().padStart(2, "0");
      setCurrentTimeStr(`${hrs}:${mins}`);
    }, 15000);

    // Hash listener router logic
    const handleHashChange = () => {
      const hash = window.location.hash.replace("#", "");
      const validScreens = ["lobby", "detail", "story", "evening", "weekend", "loading", "settlement", "archive"];
      if (validScreens.includes(hash)) {
        setCurrentScreen(hash as any);
      } else {
        setCurrentScreen("lobby");
      }
    };

    window.addEventListener("hashchange", handleHashChange);

    // Initial sync
    const initialHash = window.location.hash.replace("#", "");
    const validScreens = ["lobby", "detail", "story", "evening", "weekend", "loading", "settlement", "archive"];
    if (validScreens.includes(initialHash)) {
      setCurrentScreen(initialHash as any);
    } else {
      window.history.replaceState(null, "", "#lobby");
      setCurrentScreen("lobby");
    }

    // Supabase Realtime 订阅：副本数据变化时自动刷新
    const trialsChannel = subscribeTrials(() => {
      console.log("[App] Trials updated via Realtime, refreshing...");
      fetchTrialsFromServer().then((serverTrials) => {
        if (serverTrials && serverTrials.length > 0) {
          setTrials(serverTrials);
        }
      });
    });

    // Supabase Realtime 订阅：新试玩记录时刷新存档
    const resultsChannel = subscribeResults((payload) => {
      if (payload.eventType === 'INSERT') {
        console.log("[App] New result from Realtime, refreshing archive...");
        fetchResultsFromServer().then((serverResults) => {
          if (serverResults && serverResults.length > 0) {
            setSavedRecords(serverResults);
            saveToLocalStorage(serverResults);
          }
        });
      }
    });

    return () => {
      clearInterval(timer);
      window.removeEventListener("hashchange", handleHashChange);
      trialsChannel.unsubscribe();
      resultsChannel.unsubscribe();
    };
  }, []);

  // Save specific record to index list
  const handleSaveResultToArchive = () => {
    const fallbackTitle = 
      activeTrial.id === "pm_shanghai" ? "咖啡续命的带薪摸鱼分析员" :
      activeTrial.id === "designer_hangzhou" ? "西湖边边的灵感逃逸插画师" :
      activeTrial.id === "ai_beijing" ? "中关村深夜的学术算力苦行僧" :
      "玉林小巷微醺哲学创意咖啡家";

    const fallbackResonance = `你在体验中做出了兼顾属性与个人自由的选择。你的心跳频率显示，你并不单单追求纯粹的物质汇报，你的灵魂底色里潜藏着一拨追求自我意志的浪漫主义色彩。你渴望真实的生活回甘，抗拒任何冷冰冰的教条指挥。`;

    const fallbackCareer = 
      activeTrial.id === "pm_shanghai" ? "全栈项目协调家 / 产品策划合伙人" :
      activeTrial.id === "designer_hangzhou" ? "自媒体视觉美学博主 / 新媒体创意美术" :
      activeTrial.id === "ai_beijing" ? "技术布道师 (Advocate) / 科技创客主理人" :
      "精品社区主理人 / 策展合伙人 / 创意手艺家";

    const fallbackActionItem = 
      activeTrial.id === "pm_shanghai" ? "用便利贴规划你一天时间表的三个黄金节点，强迫自己在15分钟摸鱼时间关闭所有电子通知。训练注意力的边界防御感。" :
      activeTrial.id === "designer_hangzhou" ? "去家门外，至少拍摄三种完全不同叶片或陈旧砖缝的肌理作为PS参考，命名为‘遗落在人间的像素色板阶’。" :
      activeTrial.id === "ai_beijing" ? "翻看一个你熟知的高维常数或自然定义（比如黄金比例或圆周率），思考它如何在大模型生成框架里保持本源的美。" :
      "去观察家附近的咖啡店，仔细坐在角落听一个小时的阿姨唠嗑或者是上班族的争论，并列出三个他们最常提及的无聊字眼。";

    const newRecord: SavedResult = {
      id: "archive_" + Date.now(),
      date: new Date().toLocaleDateString("zh-CN", { month: "short", day: "numeric" }),
      trialId: activeTrial.id,
      trialTitle: activeTrial.title + " · " + activeTrial.subtitle,
      city: activeTrial.city,
      careerTitle: settlementData?.title || fallbackTitle,
      resonance: settlementData?.resonance || fallbackResonance,
      cityMatchScore: settlementData?.cityMatch?.score || 85,
      cityMatchComment: settlementData?.cityMatch?.comment || "",
      mappedCareer: settlementData?.mapping?.career || fallbackCareer,
      marketVibe: settlementData?.mapping?.marketVibe || "",
      salaryExpectation: settlementData?.mapping?.salaryExpectation || "约 月薪 15k - 22k",
      actionItem: settlementData?.mapping?.actionItem || fallbackActionItem,
      choices: trialChoices,
      stats: {
        happiness: attrs.happiness,
        health: attrs.health,
        stress: attrs.stress,
        growth: attrs.growth,
        wealth: attrs.growth,
        freedom: attrs.happiness,
        connection: attrs.happiness,
        peace: attrs.health
      }
    };

    const updated = [newRecord, ...savedRecords];
    setSavedRecords(updated);

    // 同时保存到 localStorage（离线 fallback）和后端 Supabase
    saveToLocalStorage(updated);
    saveResultToServer(newRecord, trialChoices, settlementData?._provider).then((res) => {
      if (res.success) {
        console.log("[App] Result saved to server successfully.");
      } else {
        console.warn("[App] Server save failed, data kept in localStorage:", res.error);
      }
    });
    
    // Popup validation
    triggerToast("📂 已收录至「个人人生档案馆」");
    navigateTo("archive");
  };

  const triggerToast = (text: string) => {
    setNotification(text);
    setTimeout(() => {
      setNotification(null);
    }, 3500);
  };

  // Selection Handler inside Scenario
  const handleChooseOption = (opt: any) => {
    // Dynamic mapping from old effects to new ones:
    const finalHappyDiff = opt.effects.happiness !== undefined ? opt.effects.happiness : ((opt.effects.freedom || 0) + Math.round((opt.effects.connection || 0) * 0.4));
    const finalHealthDiff = opt.effects.health !== undefined ? opt.effects.health : ((opt.effects.peace || 0) + Math.round((opt.effects.freedom || 0) * 0.2));
    const finalStressDiff = opt.effects.stress !== undefined ? opt.effects.stress : (Math.round((opt.effects.wealth || 0) * 0.3) - (opt.effects.peace || 0) - Math.round((opt.effects.freedom || 0) * 0.2));
    const finalGrowthDiff = opt.effects.growth !== undefined ? opt.effects.growth : (opt.effects.wealth || 0);

    const nextHappiness = Math.max(0, Math.min(100, attrs.happiness + finalHappyDiff));
    const nextHealth = Math.max(4, Math.min(100, attrs.health + finalHealthDiff));
    const nextStress = Math.max(0, Math.min(100, attrs.stress + finalStressDiff));
    const nextGrowth = Math.max(0, Math.min(100, attrs.growth + finalGrowthDiff));

    setAttrs({
      happiness: nextHappiness,
      health: nextHealth,
      stress: nextStress,
      growth: nextGrowth
    });

    const isLastScenario = currentScenarioIndex >= activeTrial.scenarios.length - 1;

    // Build the selection log
    const indexStr = activeTrial.scenarios[currentScenarioIndex].time;
    const sceneLabel = activeTrial.scenarios[currentScenarioIndex].sceneTitle;
    const itemRecord: ChoiceRecord = {
      time: indexStr,
      sceneTitle: sceneLabel,
      selectedOption: opt.text,
      narrationResult: opt.narration,
      effects: opt.effects
    };

    setTrialChoices(prev => [...prev, itemRecord]);

    // Show floating value effect
    const effectsList: string[] = [];
    
    if (finalHappyDiff !== 0) effectsList.push(`${finalHappyDiff > 0 ? "😊 快乐 +" : "😊 快乐 "}${finalHappyDiff}`);
    if (finalHealthDiff !== 0) effectsList.push(`${finalHealthDiff > 0 ? "❤️ 健康 +" : "❤️ 健康 "}${finalHealthDiff}`);
    if (finalStressDiff !== 0) effectsList.push(`${finalStressDiff > 0 ? "⚡ 压力 +" : "⚡ 压力 "}${finalStressDiff}`);
    if (finalGrowthDiff !== 0) effectsList.push(`${finalGrowthDiff > 0 ? "📈 成长 +" : "📈 成长 "}${finalGrowthDiff}`);
    
    triggerToast(effectsList.length > 0 ? effectsList.join(" | ") : "🧩 做出了不改变属性的决定");

    // Process narrative pause screen, then increment
    if (isLastScenario) {
      // Direct flow to final reflective thought
      setTimeout(() => {
        navigateTo("evening");
      }, 1000);
    } else {
      setTimeout(() => {
        setCurrentScenarioIndex(prev => prev + 1);
      }, 1000);
    }
  };

  // Start Campaign
  const handleLaunchTrial = (id: string) => {
    setSelectedTrialId(id);
    setCurrentScenarioIndex(0);
    setTrialChoices([]);
    setReflectionText("");
    setNickname("");
    setChosenEveningId(null);
    setChosenWeekendId(null);
    // Standard baseline scores for different starting trials
    const matched = trials.find(t => t.id === id);
    if (matched) {
      setAttrs({
        happiness: Math.round((matched.freedom + matched.connection) / 2),
        health: matched.peace,
        stress: Math.max(10, 100 - matched.peace),
        growth: matched.wealth
      });
    }
    navigateTo("story");
  };

  // Submit choices & query back to Flask node endpoint
  const handleCommitSettlement = async (choicesToCommit = trialChoices) => {
    navigateTo("loading");
    setErrorMessage(null);
    setIsGenerating(true);

    try {
      const response = await fetch("/api/map-career", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          trialId: activeTrial.id,
          trialTitle: `${activeTrial.title} × ${activeTrial.subtitle}`,
          choices: choicesToCommit,
          reflection: reflectionText,
          finalStats: {
            happiness: attrs.happiness,
            health: attrs.health,
            stress: attrs.stress,
            growth: attrs.growth,
            wealth: attrs.growth,
            freedom: attrs.happiness,
            connection: attrs.happiness,
            peace: attrs.health
          }
        })
      });

      if (!response.ok) {
        throw new Error("HTTP error " + response.status);
      }

      const rawData = await response.json();
      setSettlementData(rawData);
      navigateTo("settlement");
    } catch (err: any) {
      console.warn("APIs Error, using local responsive mapper", err);
      setErrorMessage("服务器网络偏弱，为您调配了本地快速人生成本精算师报告！");
      // AI 超时/失败时，重新请求后端 fallback（不走 AI）
      try {
        const fallbackResponse = await fetch("/api/map-career", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            trialId: activeTrial.id,
            trialTitle: `${activeTrial.title} × ${activeTrial.subtitle}`,
            choices: choicesToCommit,
            reflection: reflectionText,
            finalStats: {
              happiness: attrs.happiness,
              health: attrs.health,
              stress: attrs.stress,
              growth: attrs.growth,
              wealth: attrs.growth,
              freedom: attrs.happiness,
              connection: attrs.happiness,
              peace: attrs.health
            },
            _forceFallback: true  // 告诉后端直接返回 fallback
          })
        });
        if (fallbackResponse.ok) {
          const fallbackData = await fallbackResponse.json();
          setSettlementData(fallbackData);
        } else {
          setSettlementData(null);
        }
      } catch {
        setSettlementData(null);
      }
      navigateTo("settlement");
    } finally {
      setIsGenerating(false);
    }
  };

  // Detailed modal or page view of single archival item
  const [selectedArchiveDetail, setSelectedArchiveDetail] = useState<SavedResult | null>(null);

  // Clear archive data
  const handleWipeArchive = () => {
    showConfirm(
      "清空历史档案",
      "确定要清空你的人生试玩记录档案馆吗？此操作不可撤销，已保存的人生卷轴会全部遗失。",
      async () => {
        // 尝试从后端逐个软删除
        for (const record of savedRecords) {
          await deleteResultFromServer(record.id);
        }
        setSavedRecords([]);
        clearLocalStorage();
        triggerToast("🧹 档案馆已清理干净");
      }
    );
  };

  return (
    <div id="applet_main_container" className="min-h-screen bg-stone-100 dark:bg-zinc-950 font-sans flex flex-col items-center justify-center py-6 px-4 select-none">
      
      {/* Visual background decorations - keeping outer area exceptionally clean */}
      <div className="absolute top-10 left-10 hidden lg:block max-w-sm pointer-events-none">
        <h1 className="text-3xl font-bold text-zinc-900 tracking-tight flex items-center gap-2">
          人生试玩店 <span className="text-xs bg-amber-500 text-white rounded-full px-2 py-0.5">Life Trial v1.0</span>
        </h1>
        <p className="text-sm text-zinc-500 mt-2">“先过一天，再做选择。” 基于电影海报式探索、Duolingo游戏级微反馈的应届大学生职业人生沙盒体验系统。</p>
        <div className="mt-6 flex flex-col gap-2">
          <div className="flex gap-2 items-center text-xs text-zinc-400 bg-white shadow-xs p-3 rounded-xl border border-stone-200">
            <Smartphone className="w-4 h-4 text-amber-500" />
            <span>右侧支持点击，全流程可交互演示</span>
          </div>
          <div className="flex gap-2 items-center text-xs text-zinc-400 bg-white shadow-xs p-3 rounded-xl border border-stone-200">
            <Sparkles className="w-4 h-4 text-indigo-500" />
            <span>智能职业映射由 AI 大模型实时驱动</span>
          </div>
        </div>
      </div>

      {/* Floating toast notification */}
      <AnimatePresence>
        {notification && (
          <motion.div 
            initial={{ opacity: 0, y: -40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed top-6 z-50 bg-zinc-900/95 text-white text-xs px-4 py-3 rounded-full flex items-center gap-2 shadow-xl backdrop-blur-md border border-white/10"
            id="toast_alert_banner"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>{notification}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* High-Fidelity Mobile shell container (iPhone size format) */}
      <div 
        id="iphone_frame_outer" 
        className="relative w-full max-w-[400px] h-[830px] rounded-[52px] border-[11px] border-zinc-900 bg-zinc-950 shadow-2xl flex flex-col overflow-hidden ring-[6px] ring-stone-200/50"
      >
        
        {/* Notch - Dynamic Island screen cap */}
        <div className="absolute top-2 left-1/2 -translate-x-1/2 w-[110px] h-[28px] bg-black rounded-full z-40 flex items-center justify-center gap-1 px-3">
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse"></span>
          <span className="text-[9px] text-zinc-500 font-mono scale-90">LifeTrial AI</span>
        </div>

        {/* Status Bar */}
        <div className="w-full h-11 bg-stone-50 dark:bg-zinc-900 flex justify-between items-center px-6 z-30 shrink-0 select-none text-zinc-800 dark:text-zinc-100 text-xs font-semibold">
          <span id="statusbar_time" className="text-[12px]">{currentTimeStr}</span>
          <div className="flex items-center gap-1.5">
            <Wifi className="w-3.5 h-3.5" />
            <span className="text-[10.5px] scale-95 font-sans tracking-tighter">5G</span>
            <Battery className="w-4 h-4 text-emerald-500" />
          </div>
        </div>

        {/* Internal Screen Body */}
        <div className="flex-1 w-full bg-stone-50 text-zinc-950 overflow-y-auto flex flex-col relative" id="iphone_screen_viewport">
          
          <AnimatePresence mode="wait">
            
            {/* LOBBY / HOME (Lobby Screen - Netflix Vibe) */}
            {currentScreen === "lobby" && (
              <motion.div
                key="lobby_screen"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                id="screen_lobby"
                className="flex-1 flex flex-col"
              >
                {/* Header */}
                <div className="px-5 pt-6 pb-2 shrink-0 flex justify-between items-center bg-stone-50/80 backdrop-blur-md sticky top-0 z-20">
                  <div>
                    <h2 className="text-xl font-extrabold tracking-tight text-neutral-900" id="lobby_title">人生试玩店</h2>
                    <p className="text-[11px] text-zinc-500 font-medium">先过一天，再做选择 ⚡</p>
                  </div>
                  
                  {/* Archives bottom entry icon with dynamic indicators */}
                  <button 
                    onClick={() => navigateTo("archive")} 
                    className="p-2 bg-stone-100 hover:bg-stone-200 transition active:scale-95 rounded-full border border-stone-200 relative flex items-center justify-center"
                    id="lobby_btn_archives"
                    title="个人人生档案馆"
                  >
                    <Archive className="w-4 h-4 text-zinc-700" />
                    {savedRecords.length > 0 && (
                      <span className="absolute -top-1 -right-1 w-4 h-4 text-[9px] bg-amber-500 text-white rounded-full flex items-center justify-center font-bold">
                        {savedRecords.length}
                      </span>
                    )}
                  </button>
                </div>

                {/* Main Hero Slider Vibe */}
                <div className="px-5 mt-4">
                  <div className="relative rounded-2xl overflow-hidden h-[160px] flex flex-col justify-end p-4 text-white shadow-md bg-stone-900">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent z-10"></div>
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-amber-500/20 via-transparent to-transparent"></div>
                    
                    <div className="relative z-10">
                      <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider font-extrabold text-amber-400 mb-1">
                        <Flame className="w-3 h-3 fill-amber-400" />
                        <span>本周最高人气体验</span>
                      </div>
                      <h3 className="text-base font-extrabold leading-tight">成都探店网红 × 自洽街角生</h3>
                      <p className="text-[10px] text-zinc-300 mt-1 line-clamp-1">游走于太古里的时尚镜头、民谣街角与市井美味，过一番成都自洽人生。</p>
                      
                      <button 
                        onClick={() => handleLaunchTrial("kol_chengdu")} 
                        className="mt-2 text-[10px] px-3 py-1 bg-amber-500 hover:bg-amber-600 font-bold rounded-lg flex items-center gap-1.5 transition active:scale-95 text-white"
                      >
                        <span>立即试玩一整天</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Filters - Tabs */}
                <div className="mt-6">
                  <h4 className="text-xs font-bold text-zinc-800 px-5 mb-2.5 uppercase tracking-wider">🌱 探索人生副本分类 (按调性)</h4>
                  
                  {/* Category horizontally scrollable cards */}
                  <div className="flex gap-2.5 overflow-x-auto px-5 pb-2 scrollbar-none" id="lobby_categories">
                    <button
                      onClick={() => setSelectedTone("all")}
                      className={`text-[11px] font-bold px-3 py-1.5 rounded-full shrink-0 flex items-center gap-1 cursor-pointer transition active:scale-95 border-0 ${
                        selectedTone === "all"
                          ? "bg-emerald-500 text-white shadow-xs"
                          : "bg-zinc-100 text-zinc-600 hover:text-zinc-950 hover:bg-zinc-200"
                      }`}
                    >
                      <Compass className="w-3 h-3" /> 推荐全部
                    </button>
                    <button
                      onClick={() => setSelectedTone("geek")}
                      className={`text-[11px] font-bold px-3 py-1.5 rounded-full shrink-0 flex items-center gap-1 cursor-pointer transition active:scale-95 border-0 ${
                        selectedTone === "geek"
                          ? "bg-indigo-600 text-white shadow-xs"
                          : "bg-zinc-100 text-zinc-600 hover:text-zinc-950 hover:bg-zinc-200"
                      }`}
                    >
                      🔬 极客信仰
                    </button>
                    <button
                      onClick={() => setSelectedTone("slow")}
                      className={`text-[11px] font-bold px-3 py-1.5 rounded-full shrink-0 flex items-center gap-1 cursor-pointer transition active:scale-95 border-0 ${
                        selectedTone === "slow"
                          ? "bg-amber-500 text-white shadow-xs"
                          : "bg-zinc-100 text-zinc-600 hover:text-zinc-950 hover:bg-zinc-200"
                      }`}
                    >
                      ☕ 慢节奏自洽
                    </button>
                    <button
                      onClick={() => setSelectedTone("corp")}
                      className={`text-[11px] font-bold px-3 py-1.5 rounded-full shrink-0 flex items-center gap-1 cursor-pointer transition active:scale-95 border-0 ${
                        selectedTone === "corp"
                          ? "bg-blue-600 text-white shadow-xs"
                          : "bg-zinc-100 text-zinc-600 hover:text-zinc-950 hover:bg-zinc-200"
                      }`}
                    >
                      💻 大厂齿轮
                    </button>
                  </div>
                </div>

                {/* Popular Campaigns Movie-Style Slider */}
                <div className="mt-5 flex-1">
                  <h4 className="text-xs font-bold text-zinc-800 px-5 mb-3.5 uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-yellow-500" />
                    热门人生副本 (首发)
                  </h4>
                  
                  {/* Large Netflix Style Horizontal scroll of Campaign Cards */}
                  <div className="flex gap-4 overflow-x-auto px-5 pb-6 scrollbar-none snap-x" id="lobby_trial_cards">
                    {trials.filter(trial => selectedTone === "all" || getTrialTone(trial.id) === selectedTone).map((trial) => (
                      <div 
                        key={trial.id}
                        onClick={() => {
                          setSelectedTrialId(trial.id);
                          navigateTo("detail");
                        }}
                        className="w-[180px] shrink-0 bg-white rounded-2xl shadow-xs border border-zinc-100 overflow-hidden cursor-pointer hover:shadow-md transition duration-200 snap-start flex flex-col"
                        id={`card_trial_${trial.id}`}
                      >
                        {/* Film Poster Cover Card */}
                        <div 
                          className="h-[170px] p-3.5 flex flex-col justify-between text-white relative"
                          style={{ background: trial.coverImage }}
                        >
                          {/* Top Tag Badges */}
                          <div className="flex justify-between items-center">
                            <span className="text-[9px] bg-black/40 backdrop-blur-md px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                              {trial.city.split(" ")[0]}
                            </span>
                            <span className="text-[9px] bg-white/20 backdrop-blur-md text-white px-2 py-0.5 rounded-full font-medium">
                              {trial.duration}
                            </span>
                          </div>

                          {/* Dynamic Vibe Emoji or Vibe Text */}
                          <div className="text-3xl self-center my-auto filter drop-shadow-sm">
                            {trial.id === "pm_shanghai" ? "💼" : trial.id === "designer_hangzhou" ? "🎨" : trial.id === "ai_beijing" ? "🧬" : "☕"}
                          </div>

                          {/* Bottom info caption */}
                          <div className="relative z-10 mt-auto">
                            <p className="text-[9px] text-white/80 font-bold tracking-wider blur-0">{trial.lifestyle.split(" ")[0]}</p>
                            <h5 className="text-sm font-black leading-tight truncate">{trial.subtitle}</h5>
                          </div>
                        </div>

                        {/* Card Meta Stats (Freedom / Difficulty / Vibe description) */}
                        <div className="p-3.5 flex-1 flex flex-col justify-between bg-white text-zinc-800">
                          <div>
                            <div className="flex items-center justify-between text-[10px] text-zinc-500 font-bold mb-1.5">
                              <span>自由度: {trial.freedom}%</span>
                              <span className="text-amber-500">★ {trial.difficulty}.0</span>
                            </div>
                            <p className="text-[10px] text-zinc-400 line-clamp-2 leading-relaxed">
                              {trial.vibe}
                            </p>
                          </div>

                          <div className="mt-3 pt-2.5 border-t border-zinc-100 flex items-center justify-between">
                            <span className="text-[10px] text-indigo-600 font-bold flex items-center gap-0.5">
                              开始试用 <ChevronRight className="w-3.5 h-3.5" />
                            </span>
                            <div className="flex gap-0.5" title="Difficulty Rating">
                              {[...Array(5)].map((_, i) => (
                                <span 
                                  key={i} 
                                  className={`w-1 h-1.5 rounded-full ${i < trial.difficulty ? "bg-amber-500" : "bg-stone-200"}`} 
                                />
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Slogan Quote Bottom Banner */}
                <div className="p-5 mt-auto bg-stone-100/50 border-t border-stone-200 shrink-0 text-center flex flex-col items-center">
                  <p className="text-xs font-semibold text-zinc-500">
                    “先过一天，再做选择。”
                  </p>
                  <p className="text-[9px] text-zinc-400 mt-1 max-w-[280px]">
                    人生没有练习册，却可以拥有专属的模拟试玩店。
                  </p>
                </div>
              </motion.div>
            )}

            {/* DETAIL SCREEN (Trial Detail Vibe) */}
            {currentScreen === "detail" && (
              <motion.div
                key="detail_screen"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                className="flex-1 flex flex-col"
                id="screen_detail"
              >
                {/* Header Back Button */}
                <div className="px-5 pt-6 pb-2 shrink-0 flex items-center gap-3">
                  <button 
                    onClick={() => navigateTo("lobby")} 
                    className="p-2 hover:bg-stone-100 transition active:scale-95 text-zinc-700 rounded-full bg-white border border-stone-200"
                    id="detail_btn_back"
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </button>
                  <span className="text-xs font-black text-zinc-500 uppercase tracking-widest">生活副本提案馆</span>
                </div>

                {/* Billboard Hero Card */}
                <div className="px-5 mt-4">
                  <div 
                    className="rounded-3xl p-5 text-white shadow-sm relative overflow-hidden flex flex-col justify-between h-[210px]"
                    style={{ background: activeTrial.coverImage }}
                  >
                    <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
                    
                    <div className="flex justify-between items-start">
                      <span className="text-[10px] font-black tracking-widest bg-black/40 backdrop-blur-md text-white rounded-full px-3 py-1">
                        📌 {activeTrial.city}
                      </span>
                      <span className="text-[10px] font-medium bg-white/20 backdrop-blur-md px-2 py-1 rounded-md">
                        {activeTrial.lifestyle.split(" ")[0]}
                      </span>
                    </div>

                    <div className="mt-auto">
                      <h3 className="text-xl font-black tracking-tight">{activeTrial.subtitle}</h3>
                      <p className="text-xs text-white/90 font-medium mt-1">{activeTrial.title}</p>
                      
                      <div className="flex items-center gap-3 mt-3.5 pt-3 border-t border-white/20 text-[10px] text-white/80">
                        <span>体验负荷: ★ {activeTrial.difficulty}.0</span>
                        <span>|</span>
                        <span>副本大小: {activeTrial.scenarios.length} 阶段剧情</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Attributes Radial Radar Pill boxes */}
                <div className="mt-5 px-5">
                  <h4 className="text-[11px] font-extrabold text-zinc-400 mb-3 uppercase tracking-wider">📊 初始人生天赋分布</h4>
                  
                  {/* Grid layout of gauges mapping variables */}
                  <div className="grid grid-cols-2 gap-2.5">
                    <div className="bg-white border border-zinc-100/80 rounded-xl p-2.5 flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className="text-base">😊</span>
                        <span className="text-xs font-bold text-zinc-700">幸福度</span>
                      </div>
                      <span className="text-xs font-black text-zinc-900">{Math.round((activeTrial.freedom + activeTrial.connection) / 2)}%</span>
                    </div>
                    
                    <div className="bg-white border border-zinc-100/80 rounded-xl p-2.5 flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className="text-base">❤️</span>
                        <span className="text-xs font-bold text-zinc-700">健康状况</span>
                      </div>
                      <span className="text-xs font-black text-zinc-900">{activeTrial.peace}%</span>
                    </div>

                    <div className="bg-white border border-zinc-100/80 rounded-xl p-2.5 flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className="text-base">⚡</span>
                        <span className="text-xs font-bold text-zinc-700">潜在压力</span>
                      </div>
                      <span className="text-xs font-black text-zinc-900">{Math.max(10, 100 - activeTrial.peace)}%</span>
                    </div>

                    <div className="bg-white border border-zinc-100/80 rounded-xl p-2.5 flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className="text-base">📈</span>
                        <span className="text-xs font-bold text-zinc-700">职业成长</span>
                      </div>
                      <span className="text-xs font-black text-zinc-900">{activeTrial.wealth}%</span>
                    </div>
                  </div>
                </div>

                {/* Previews of Story Scenarios Tree */}
                <div className="mt-5 px-5 flex-1 overflow-y-auto">
                  <h4 className="text-[11px] font-extrabold text-zinc-400 mb-2.5 uppercase tracking-wider">📅 试玩日程节点 preview</h4>
                  
                  <div className="space-y-3 relative before:absolute before:inset-y-2 before:left-3 before:w-0.5 before:bg-stone-200">
                    {activeTrial.scenarios.map((sc, scIdx) => {
                      const bgClasses = scIdx === 0 ? "bg-indigo-50 border-indigo-400 text-indigo-600" :
                                        scIdx === 1 ? "bg-emerald-50 border-emerald-400 text-emerald-600" :
                                        "bg-amber-50 border-amber-400 text-amber-600";
                      return (
                        <div key={scIdx} className="flex gap-3 relative z-10">
                          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-[10px] font-bold shrink-0 ${bgClasses}`}>
                            {scIdx + 1}
                          </div>
                          <div>
                            <h5 className="text-[11px] font-bold text-zinc-800">{sc.time} · {sc.sceneTitle}</h5>
                            <p className="text-[10px] text-zinc-400 leading-tight">{sc.description}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Start Action Button Drawer at bottom */}
                <div className="p-5 border-t border-stone-200 bg-white shrink-0 mt-auto">
                  <button 
                    onClick={() => handleLaunchTrial(activeTrial.id)}
                    className="w-full py-3.5 bg-zinc-900 hover:bg-zinc-800 text-white font-extrabold text-xs tracking-widest rounded-2xl flex items-center justify-center gap-2 transition active:scale-95 shadow-md"
                    id="detail_btn_start"
                  >
                    <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
                    <span>撕下海报 · 进入试玩人生</span>
                  </button>
                </div>
              </motion.div>
            )}

            {/* STORY / GAMEPLAY SCREEN (Working hours scenarios) */}
            {currentScreen === "story" && (
              <motion.div
                key="story_screen"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex-1 flex flex-col"
                id="screen_story"
              >
                {/* Floating score attributes dashboard in upper rail */}
                <div className="px-5 pt-3.5 pb-2.5 bg-white border-b border-stone-100 flex items-center justify-between gap-1 shrink-0">
                  <div className="flex items-center gap-1.5">
                    <button 
                      onClick={() => {
                        showConfirm(
                          "放弃当前试玩",
                          "确定要放弃这场好玩的人生，返回接待大厅吗？关闭后本轮试玩属性和进度不予存储。",
                          () => navigateTo("lobby")
                        );
                      }} 
                      className="p-1.5 hover:bg-stone-100 rounded-full transition active:scale-95 text-zinc-400"
                      id="story_btn_abort"
                    >
                      <ArrowLeft className="w-4 h-4" />
                    </button>
                    <div>
                      <h4 className="text-[10px] text-zinc-400 font-extrabold tracking-tight">试玩人生副本：</h4>
                      <h3 className="text-xs font-black text-zinc-800 line-clamp-1">{activeTrial.subtitle}</h3>
                    </div>
                  </div>

                  {/* Attributes status bars with colored indicators in minimal inline display */}
                  <div className="flex flex-col gap-1 w-[125px] shrink-0 font-semibold">
                    <div className="flex items-center gap-1 w-full scale-[0.82] origin-right">
                      <span className="text-[10px] shrink-0 text-center select-none" title="快乐">😊</span>
                      <div className="flex-1 h-1 bg-stone-100 rounded-full overflow-hidden relative">
                        <div className="h-full bg-emerald-500 rounded-full transition-all duration-300" style={{ width: `${attrs.happiness}%` }}></div>
                      </div>
                      <span className="text-[9px] font-mono font-black text-zinc-600 shrink-0 w-4.5 text-right">{attrs.happiness}</span>
                    </div>

                    <div className="flex items-center gap-1 w-full scale-[0.82] origin-right">
                      <span className="text-[10px] shrink-0 text-center select-none" title="健康">❤️</span>
                      <div className="flex-1 h-1 bg-stone-100 rounded-full overflow-hidden relative">
                        <div className="h-full bg-rose-500 rounded-full transition-all duration-300" style={{ width: `${attrs.health}%` }}></div>
                      </div>
                      <span className="text-[9px] font-mono font-black text-zinc-600 shrink-0 w-4.5 text-right">{attrs.health}</span>
                    </div>

                    <div className="flex items-center gap-1 w-full scale-[0.82] origin-right">
                      <span className="text-[10px] shrink-0 text-center select-none" title="压力">⚡</span>
                      <div className="flex-1 h-1 bg-stone-100 rounded-full overflow-hidden relative">
                        <div className="h-full bg-amber-500 rounded-full transition-all duration-300" style={{ width: `${attrs.stress}%` }}></div>
                      </div>
                      <span className="text-[9px] font-mono font-black text-zinc-600 shrink-0 w-4.5 text-right">{attrs.stress}</span>
                    </div>

                    <div className="flex items-center gap-1 w-full scale-[0.82] origin-right">
                      <span className="text-[10px] shrink-0 text-center select-none" title="成长">📈</span>
                      <div className="flex-1 h-1 bg-stone-100 rounded-full overflow-hidden relative">
                        <div className="h-full bg-indigo-500 rounded-full transition-all duration-300" style={{ width: `${attrs.growth}%` }}></div>
                      </div>
                      <span className="text-[9px] font-mono font-black text-zinc-600 shrink-0 w-4.5 text-right">{attrs.growth}</span>
                    </div>
                  </div>
                </div>

                {/* Progress Day nodes at upper side */}
                <div className="h-1 w-full bg-stone-100 shrink-0">
                  <div 
                    className="h-full bg-indigo-600 transition-all duration-300"
                    style={{ width: `${((currentScenarioIndex + 1) / activeTrial.scenarios.length) * 100}%` }}
                  ></div>
                </div>

                {/* Core Narrative Board content */}
                <div className="p-5 flex-1 flex flex-col justify-between overflow-y-auto">
                  
                  {/* Scene card setup block */}
                  <div className="bg-white border border-stone-100 rounded-3xl p-4 shadow-xs relative">
                    {/* Timestamp bubble tag */}
                    <div className="absolute -top-3.5 left-4 px-3 py-1 bg-zinc-900 border border-zinc-800 text-white rounded-full text-[9px] font-black tracking-widest flex items-center gap-1">
                      <Zap className="w-2.5 h-2.5 text-yellow-400 shrink-0 animate-bounce" />
                      <span>节点 - {activeTrial.scenarios[currentScenarioIndex].time}</span>
                    </div>

                    <div className="pt-2">
                      <div className="flex items-center gap-2 text-[10px] text-zinc-500 font-bold mb-1 ml-0.5 uppercase tracking-wider">
                        <span>场景阶段</span>
                        <span>·</span>
                        <span>{activeTrial.scenarios[currentScenarioIndex].period === "morning" ? "🌅 晨间日程" : activeTrial.scenarios[currentScenarioIndex].period === "noon" ? "🍔 中午休整" : "💼 下午极限"}</span>
                      </div>
                      
                      <h4 className="text-base font-extrabold text-zinc-900 leading-tight" id="story_scene_title">
                        {activeTrial.scenarios[currentScenarioIndex].sceneTitle}
                      </h4>
                      
                      {/* Character avatar badge / illustration bubble */}
                      <div className="my-3.5 bg-neutral-50 rounded-2xl p-3 flex gap-3 items-start border border-stone-100">
                        <span className="text-3xl p-1 bg-white/80 rounded-xl shadow-xs border border-stone-100 shrink-0 select-none">
                          {activeTrial.scenarios[currentScenarioIndex].illustration}
                        </span>
                        <p className="text-xs text-zinc-600 leading-relaxed font-medium" id="story_scene_description">
                          {activeTrial.scenarios[currentScenarioIndex].description}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Interactive Option Selection stack (No quizzes, pure choices) */}
                  <div className="mt-4 space-y-2.5">
                    <p className="text-[10px] font-extrabold text-zinc-400 pl-1 uppercase tracking-wider">🧩 做出你的内心选择：</p>
                    {activeTrial.scenarios[currentScenarioIndex].options.map((opt, i) => (
                      <button
                        key={i}
                        onClick={() => handleChooseOption(opt)}
                        className="w-full text-left bg-white hover:bg-stone-50 border border-stone-200 hover:border-zinc-400 p-2.5 rounded-2xl flex gap-3 transition-all duration-200 active:scale-98 group shadow-xs cursor-pointer"
                        id={`story_option_${i}`}
                      >
                        {/* Number bullet letter */}
                        <div className="w-5 h-5 rounded-full bg-stone-100 group-hover:bg-zinc-900 group-hover:text-white transition text-zinc-600 font-bold text-[10px] flex items-center justify-center shrink-0">
                          {String.fromCharCode(65 + i)}
                        </div>

                        <div>
                          <p className="text-xs font-bold text-zinc-900 leading-snug group-hover:text-indigo-600 transition">
                            {opt.text}
                          </p>
                          <p className="text-[10.5px] text-zinc-500 font-medium leading-tight mt-0.5">
                            {opt.subtext}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>

                </div>
              </motion.div>
            )}

            {/* EVENING AFTER-WORK ROUTINE SELECTION */}
            {currentScreen === "evening" && (
              <motion.div
                key="evening_screen"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="flex-1 flex flex-col p-5 justify-between bg-stone-50"
                id="screen_evening"
              >
                {/* Header Back Button */}
                <div className="flex items-center gap-1 shrink-0">
                  <button 
                    onClick={() => {
                      showConfirm(
                        "放弃当前进度",
                        "确定要放弃本轮的总结，返回接待大厅吗？当前试玩进度将不会被保存成卷轴。",
                        () => navigateTo("lobby")
                      );
                    }} 
                    className="p-1.5 hover:bg-stone-100 rounded-full transition text-zinc-400"
                    id="evening_btn_back"
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </button>
                  <span className="text-[10px] text-zinc-400 font-extrabold tracking-widest uppercase">暮色降临 · 暮色起时</span>
                </div>

                {/* Body Content */}
                <div className="flex-1 overflow-y-auto py-4 space-y-4">
                  <div className="text-center space-y-1.5 pb-2">
                    <span className="text-4xl select-none filter drop-shadow-sm">🌆</span>
                    <h3 className="text-base font-black text-neutral-900 tracking-tight leading-tight mt-1">日落黄昏，下班的电车驶出街口</h3>
                    <p className="text-[11px] text-zinc-500 leading-normal max-w-[280px] mx-auto font-medium">
                      关上电脑和大屏之后，内心涌起属于自我的主旋律。今晚你打算做什么来安顿劳碌了一天的灵魂？
                    </p>
                  </div>

                  {/* Options List */}
                  <div className="space-y-2.5">
                    {EVENING_OPTIONS.map((opt) => {
                      const isSelected = chosenEveningId === opt.id;
                      return (
                        <div
                          key={opt.id}
                          onClick={() => {
                            setChosenEveningId(opt.id);
                            // Adjust attrs on select
                            const eH = opt.effects.happiness || 0;
                            const eHe = opt.effects.health || 0;
                            const eS = opt.effects.stress || 0;
                            const eG = opt.effects.growth || 0;
                            setAttrs({
                              happiness: Math.max(0, Math.min(100, attrs.happiness + eH)),
                              health: Math.max(4, Math.min(100, attrs.health + eHe)),
                              stress: Math.max(0, Math.min(100, attrs.stress + eS)),
                              growth: Math.max(0, Math.min(100, attrs.growth + eG))
                            });
                            // Float toast notifications to indicate stats
                            const parts: string[] = [];
                            if (eH) parts.push(`😊 快乐 ${eH > 0 ? "+" : ""}${eH}`);
                            if (eHe) parts.push(`❤️ 健康 ${eHe > 0 ? "+" : ""}${eHe}`);
                            if (eS) parts.push(`⚡ 压力 ${eS > 0 ? "+" : ""}${eS}`);
                            if (eG) parts.push(`📈 成长 ${eG > 0 ? "+" : ""}${eG}`);
                            triggerToast(parts.length > 0 ? parts.join(" | ") : "🧩 做出了不改变属性的决定");
                          }}
                          className={`p-3.5 rounded-2xl border-2 transition duration-200 cursor-pointer flex gap-3 text-left relative overflow-hidden ${
                            isSelected 
                              ? "border-neutral-900 bg-white shadow-xs" 
                              : "border-stone-200/80 bg-white hover:border-stone-300"
                          }`}
                        >
                          <span className="text-2xl select-none leading-none pt-0.5">{opt.icon}</span>
                          <div className="space-y-0.5 pr-4">
                            <h4 className="text-xs font-black text-neutral-900 leading-snug">{opt.text}</h4>
                            <p className="text-[10px] text-zinc-400 font-semibold leading-relaxed">{opt.subtext}</p>
                          </div>
                          {isSelected && (
                            <div className="absolute top-3 right-3 bg-neutral-900 text-white w-4.5 h-4.5 rounded-full flex items-center justify-center text-[9px] font-bold">
                              ✓
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Narration Result dynamic display */}
                  {chosenEveningId && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-amber-50/50 border border-amber-100 rounded-2xl p-3.5 text-left"
                    >
                      <p className="text-[10px] text-amber-800 font-extrabold uppercase tracking-widest pl-0.5">🎬 黄昏独白</p>
                      <p className="text-[10.5px] text-amber-900/90 font-medium leading-relaxed mt-1">
                        {EVENING_OPTIONS.find(o => o.id === chosenEveningId)?.narration}
                      </p>
                    </motion.div>
                  )}
                </div>

                {/* Footer Action */}
                <div className="pt-4 border-t border-stone-200/60 bg-stone-50 shrink-0">
                  <button
                    disabled={!chosenEveningId}
                    onClick={() => {
                      const opt = EVENING_OPTIONS.find(o => o.id === chosenEveningId);
                      if (opt) {
                        const rec: ChoiceRecord = {
                          time: "19:00下班",
                          sceneTitle: "下班后的自我安顿",
                          selectedOption: opt.text,
                          narrationResult: opt.narration,
                          effects: opt.effects
                        };
                        setTrialChoices(prev => [...prev, rec]);
                        navigateTo("weekend");
                      }
                    }}
                    className={`w-full py-3.5 font-extrabold text-xs tracking-widest rounded-2xl flex items-center justify-center gap-1.5 transition active:scale-98 ${
                      chosenEveningId 
                        ? "bg-neutral-900 text-white hover:bg-neutral-800" 
                        : "bg-stone-200 text-stone-400 cursor-not-allowed"
                    }`}
                    id="evening_btn_confirm"
                  >
                    <span>确认选择，迈向周末</span>
                    <ArrowRight className="w-4 h-4 ml-0.5" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* WEEKEND ROUTINE SELECTION & FINAL REFLECTION */}
            {currentScreen === "weekend" && (
              <motion.div
                key="weekend_screen"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="flex-1 flex flex-col p-5 justify-between bg-stone-50"
                id="screen_weekend"
              >
                {/* Header Back Button */}
                <div className="flex items-center gap-1 shrink-0">
                  <button 
                    onClick={() => {
                      // Rollback choices and evening Id selection to repick evening
                      setTrialChoices(prev => prev.filter(c => c.time !== "19:00下班"));
                      navigateTo("evening");
                    }} 
                    className="p-1.5 hover:bg-stone-100 rounded-full transition text-zinc-400"
                    id="weekend_btn_back"
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </button>
                  <span className="text-[10px] text-zinc-400 font-extrabold tracking-widest uppercase">周末假期 · 终章觉悟</span>
                </div>

                {/* Body Content */}
                <div className="flex-1 overflow-y-auto py-4 space-y-4">
                  <div className="text-center space-y-1.5 pb-2">
                    <span className="text-4xl select-none filter drop-shadow-sm">🌿</span>
                    <h3 className="text-base font-black text-neutral-900 tracking-tight leading-tight mt-1">终于迎来了难得的周末假期</h3>
                    <p className="text-[11px] text-zinc-500 leading-normal max-w-[280px] mx-auto font-medium">
                      在这个可以自主支配的48小时时间格里，你会挑选什么样的方式完成自我边界的逃逸？
                    </p>
                  </div>

                  {/* Weekend Options List */}
                  <div className="grid grid-cols-2 gap-2.5">
                    {WEEKEND_OPTIONS.map((opt) => {
                      const isSelected = chosenWeekendId === opt.id;
                      return (
                        <div
                          key={opt.id}
                          onClick={() => {
                            setChosenWeekendId(opt.id);
                            // Adjust attrs on select
                            const wH = opt.effects.happiness || 0;
                            const wHe = opt.effects.health || 0;
                            const wS = opt.effects.stress || 0;
                            const wG = opt.effects.growth || 0;
                            setAttrs({
                              happiness: Math.max(0, Math.min(100, attrs.happiness + wH)),
                              health: Math.max(4, Math.min(100, attrs.health + wHe)),
                              stress: Math.max(0, Math.min(100, attrs.stress + wS)),
                              growth: Math.max(0, Math.min(100, attrs.growth + wG))
                            });
                            const parts: string[] = [];
                            if (wH) parts.push(`😊 快乐 ${wH > 0 ? "+" : ""}${wH}`);
                            if (wHe) parts.push(`❤️ 健康 ${wHe > 0 ? "+" : ""}${wHe}`);
                            if (wS) parts.push(`⚡ 压力 ${wS > 0 ? "+" : ""}${wS}`);
                            if (wG) parts.push(`📈 成长 ${wG > 0 ? "+" : ""}${wG}`);
                            triggerToast(parts.length > 0 ? parts.join(" | ") : "🧩 做出了不改变属性的决定");
                          }}
                          className={`p-3 rounded-2xl border-2 transition duration-200 cursor-pointer flex flex-col gap-1.5 text-left relative overflow-hidden bg-white ${
                            isSelected 
                              ? "border-neutral-900 shadow-xs" 
                              : "border-stone-200/80 hover:border-stone-300"
                          }`}
                        >
                          <div className="flex justify-between items-center">
                            <span className="text-xl select-none leading-none">{opt.icon}</span>
                            {isSelected && (
                              <span className="bg-neutral-900 text-white w-3.5 h-3.5 rounded-full flex items-center justify-center text-[8px] font-bold">✓</span>
                            )}
                          </div>
                          <div>
                            <h4 className="text-[11px] font-black text-neutral-900 leading-tight">{opt.text}</h4>
                            <p className="text-[9px] text-zinc-400 font-semibold leading-normal mt-0.5 line-clamp-2">{opt.subtext}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Weekend narration Result dynamically displayed */}
                  {chosenWeekendId && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-indigo-50/50 border border-indigo-100 rounded-2xl p-3 text-left"
                    >
                      <p className="text-[10px] text-indigo-800 font-extrabold uppercase tracking-widest pl-0.5">🎬 周末留白</p>
                      <p className="text-[10.5px] text-indigo-950/85 font-medium leading-relaxed mt-0.5">
                        {WEEKEND_OPTIONS.find(o => o.id === chosenWeekendId)?.narration}
                      </p>
                    </motion.div>
                  )}

                  {/* Double reflective panels */}
                  {chosenWeekendId && (
                    <motion.div
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-3 pt-1.5"
                    >
                      {/* Soliloquy */}
                      <div className="bg-white border border-stone-200 rounded-2xl p-3 text-left">
                        <label className="text-[9px] font-extrabold text-zinc-400 uppercase tracking-widest pl-1">💬 写下一句写实的内心独白（选填）：</label>
                        <textarea 
                          value={reflectionText}
                          onChange={(e) => setReflectionText(e.target.value)}
                          placeholder='例如：“希望少开会、少扯皮，把精力花在真正有价值的创作上。”'
                          className="w-full text-xs font-semibold text-zinc-800 bg-stone-50 border border-stone-200 rounded-xl p-2.5 mt-1 focus:outline-none focus:border-indigo-600 h-[60px] resize-none leading-relaxed"
                        />
                      </div>

                      {/* Nickname selection */}
                      <div className="bg-white border border-stone-200 rounded-2xl p-3 text-left">
                        <label className="text-[9px] font-extrabold text-zinc-400 uppercase tracking-widest pl-1">🏷️ 给今天试玩的自己取个代号：</label>
                        <input 
                          type="text"
                          value={nickname}
                          onChange={(e) => setNickname(e.target.value)}
                          maxLength={12}
                          placeholder='例如：“西湖边的阿甘”、“中关村隐形人”'
                          className="w-full text-xs font-bold text-zinc-800 bg-stone-50 border border-stone-200 rounded-xl p-2.5 mt-1 focus:outline-none focus:border-indigo-600"
                        />
                      </div>
                    </motion.div>
                  )}
                </div>

                {/* Footer confirm buttons */}
                <div className="pt-4 border-t border-stone-200/60 bg-stone-50 shrink-0">
                  <button
                    disabled={!chosenWeekendId || !nickname.trim()}
                    onClick={async () => {
                      const opt = WEEKEND_OPTIONS.find(o => o.id === chosenWeekendId);
                      if (opt) {
                        const rec: ChoiceRecord = {
                          time: "整个周末",
                          sceneTitle: "周末的惬意逃离",
                          selectedOption: opt.text,
                          narrationResult: opt.narration,
                          effects: opt.effects
                        };
                        const fullChoices = [...trialChoices, rec];
                        setTrialChoices(fullChoices);
                        // Submit logic
                        await handleCommitSettlement(fullChoices);
                      }
                    }}
                    className={`w-full py-3.5 font-black text-xs tracking-widest rounded-2xl flex items-center justify-center gap-1.5 transition ${
                      chosenWeekendId && nickname.trim()
                        ? "bg-neutral-900 text-white hover:bg-neutral-800" 
                        : "bg-stone-200 text-stone-400 cursor-not-allowed"
                    }`}
                    id="weekend_btn_submit"
                  >
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span>敲定体验 · 生成人生结算海报</span>
                  </button>
                  <p className="text-[9px] text-zinc-400 text-center mt-2.5 leading-normal px-2">
                    通过你的实景行为链与最终平衡属性卡，我们将由 Gemini AI 实时演算分析你的职场隐性 resonance 属性。
                  </p>
                </div>
              </motion.div>
            )}

            {/* LOADING SCREEN (Smart waiting, mimicking Forest/Duolingo) */}
            {currentScreen === "loading" && (
              <motion.div
                key="loading_screen"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex-1 flex flex-col p-8 items-center justify-center text-center bg-stone-900 text-white"
                id="screen_loading"
              >
                {/* Simulated vintage spinning wheel or clock */}
                <div className="relative w-20 h-20 mb-6">
                  <div className="absolute inset-0 border-4 border-indigo-600/30 rounded-full"></div>
                  <div className="absolute inset-0 border-4 border-indigo-400 border-t-transparent rounded-full animate-spin"></div>
                  <div className="absolute inset-4 bg-zinc-800 rounded-full flex items-center justify-center text-white font-mono text-xs font-black">
                    80%
                  </div>
                </div>

                <h3 className="text-base font-black tracking-tight" id="loading_header_msg">《人生试玩店》结算盘点中...</h3>
                
                {/* Random changing tips mirroring Forest/Duolingo fun mood */}
                <div className="mt-4 px-2 max-w-[280px]">
                  <p className="text-xs text-zinc-400 leading-relaxed italic animate-pulse" id="loading_tip_msg">
                    {activeTrial.id === "pm_shanghai" ? "正在评估你面对大厂开会时的‘大饼包装学’耐受度..." : activeTrial.id === "designer_hangzhou" ? "正在调配西湖边的数字像素比例，剔除大厂繁杂冗余..." : activeTrial.id === "ai_beijing" ? "正在计算服务器泄漏对你脑下垂体的电磁共振损害..." : "正在调配桂花茉莉花香，把工作的辛辣过滤成回甘..."}
                  </p>
                </div>

                <p className="text-[10px] text-zinc-600 font-mono mt-8">
                  Generating real-time semantic analysis reports...
                </p>
              </motion.div>
            )}

            {/* SETTLEMENT AND RESPONSE (Stunning shareable Life Poster card) */}
            {currentScreen === "settlement" && (
              <motion.div
                key="settlement_screen"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex-1 flex flex-col p-5"
                id="screen_settlement"
              >
                {/* Navigation and Title */}
                <div className="flex justify-between items-center mb-3.5">
                  <span className="text-[10px] text-zinc-500 font-black tracking-wider uppercase">🎉 人生副本结算海报</span>
                  
                  <button 
                    onClick={() => {
                      // Discard of return to lobby
                      navigateTo("lobby");
                    }}
                    className="text-xs font-black text-rose-500 hover:text-rose-600 px-3 py-1 bg-rose-50 rounded-full flex items-center gap-1 transition active:scale-95"
                    id="settlement_btn_discard"
                  >
                    <span>返回大厅</span>
                  </button>
                </div>

                {/* Main Settlement Frame / The shareable poster! */}
                <div className="flex-1 overflow-y-auto pr-0.5 space-y-4">
                  
                  {/* Outer Poster container imitating elegant high contrast card */}
                  <div 
                    id="visual_poster_card" 
                    className="rounded-3xl p-5 text-white relative shadow-md overflow-hidden"
                    style={{ background: activeTrial.coverImage }}
                  >
                    {/* Retro watermark background */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[90px] font-black text-white/[0.04] uppercase rotate-12 select-none tracking-widest">
                      TRIAL
                    </div>

                    <div className="relative z-10 flex flex-col justify-between min-h-[385px]">
                      
                      {/* Logo and Date */}
                      <div className="flex justify-between items-start border-b border-white/25 pb-3">
                        <div>
                          <h4 className="text-[11px] font-black tracking-widest text-amber-300">人生试玩店 · LIFE TRIAL</h4>
                          <p className="text-[9px] text-white/75 mt-0.5 font-bold">试玩代号：{nickname || "无名旅人"}</p>
                        </div>
                        <span className="text-[9px] font-mono text-white/50 bg-black/25 px-2.5 py-1 rounded-full select-none">
                          {new Date().toLocaleDateString("zh-CN", { month: "short", day: "numeric" })}
                        </span>
                      </div>

                      {/* Spark title */}
                      <div className="my-4">
                        <span className="text-[9px] bg-amber-400 font-extrabold px-2 py-0.5 text-zinc-950 rounded-sm">
                          {activeTrial.subtitle} 副本称号
                        </span>
                        
                        <h2 className="text-lg font-black tracking-tight leading-snug mt-1 text-white pr-2" id="settlement_title">
                          {(settlementData && settlementData.title) || (
                            activeTrial.id === "pm_shanghai" ? "咖啡续命的带薪摸鱼分析员" :
                            activeTrial.id === "designer_hangzhou" ? "西湖边边的灵感逃逸插画师" :
                            activeTrial.id === "ai_beijing" ? "中关村深夜的学术算力苦行僧" :
                            "玉林小巷微醺哲学创意咖啡家"
                          )}
                        </h2>
                      </div>

                      {/* Content Resonance */}
                      <div className="bg-black/20 backdrop-blur-md rounded-2xl p-3 border border-white/10 text-xs">
                        <h5 className="text-[9.5px] text-amber-300 font-extrabold uppercase tracking-widest flex items-center gap-1 mb-1">
                          <Compass className="w-3 h-3 shrink-0" />
                          灵魂共鸣分析 Resonance
                        </h5>
                        <p className="leading-relaxed font-semibold text-white/95" id="settlement_resonance">
                          {(settlementData && settlementData.resonance) || (
                            `你在体验中做出了兼顾属性与个人自由的选择。你的心跳频率显示，你并不单单追求纯粹的物质汇报，你的灵魂底色里潜藏着一拨追求自我意志的浪漫主义色彩。你渴望真实的生活回甘，抗拒任何冷冰冰的教条指挥。`
                          )}
                        </p>
                      </div>

                      {/* Attributes list tracking stats */}
                      <div className="mt-4 pt-3.5 border-t border-white/15 flex items-center justify-between text-center">
                        <div className="bg-black/10 rounded-xl px-2 py-1 border border-white/5 flex-1 mx-0.5">
                          <p className="text-[8px] text-white/70 font-bold uppercase">😊 快乐</p>
                          <p className="text-xs font-black mt-0.5">{attrs.happiness}</p>
                        </div>
                        <div className="bg-black/10 rounded-xl px-2 py-1 border border-white/5 flex-1 mx-0.5">
                          <p className="text-[8px] text-white/70 font-bold uppercase">❤️ 健康</p>
                          <p className="text-xs font-black mt-0.5">{attrs.health}</p>
                        </div>
                        <div className="bg-black/10 rounded-xl px-2 py-1 border border-white/5 flex-1 mx-0.5">
                          <p className="text-[8px] text-white/70 font-bold uppercase">⚡ 压力</p>
                          <p className="text-xs font-black mt-0.5">{attrs.stress}</p>
                        </div>
                        <div className="bg-black/10 rounded-xl px-2 py-1 border border-white/5 flex-1 mx-0.5">
                          <p className="text-[8px] text-white/70 font-bold uppercase">📈 成长</p>
                          <p className="text-xs font-black mt-0.5">{attrs.growth}</p>
                        </div>
                      </div>

                    </div>
                  </div>

                  {/* Real World Career Mapping details card */}
                  <div className="bg-white border border-stone-200 rounded-3xl p-4 shadow-xs text-zinc-800">
                    <h4 className="text-xs font-black tracking-wider text-indigo-600 mb-3.5 uppercase flex items-center gap-1.5 border-b border-stone-100 pb-2">
                      <Briefcase className="w-4 h-4 shrink-0 text-indigo-500" />
                      现实职业映射与社会洞点指南
                    </h4>

                    <div className="space-y-3.5 text-xs">
                      
                      <div>
                        <span className="text-[10px] text-zinc-400 font-extrabold uppercase block font-mono">建议映射职业：</span>
                        <p className="font-extrabold text-zinc-900 mt-0.5" id="settlement_mapping_career">
                          {(settlementData && settlementData.mapping?.career) || (
                            activeTrial.id === "pm_shanghai" ? "全栈项目协调家 / 产品策划合伙人" :
                            activeTrial.id === "designer_hangzhou" ? "自媒体视觉美学博主 / 新媒体创意美术" :
                            activeTrial.id === "ai_beijing" ? "技术布道师 (Advocate) / 科技创客主理人" :
                            "精品社区主理人 / 策展合伙人 / 创意手艺家"
                          )}
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-3 pt-2.5 border-t border-stone-100">
                        <div>
                          <span className="text-[10px] text-zinc-400 font-extrabold block font-mono">城市契合评分：</span>
                          <p className="font-extrabold text-zinc-800 mt-0.5">
                            {activeTrial.city.split(" ")[0]} 契合度 {(settlementData && settlementData.cityMatch?.score) || 88}%
                          </p>
                        </div>
                        <div>
                          <span className="text-[10px] text-zinc-400 font-extrabold block font-mono">真实荷包待遇线：</span>
                          <p className="font-extrabold text-zinc-800 mt-0.5 truncate" id="settlement_mapping_salary">
                            {(settlementData && settlementData.mapping?.salaryExpectation) || "约 月薪 15k - 22k"}
                          </p>
                        </div>
                      </div>

                      {settlementData?.cityMatch?.comment && (
                        <p className="text-[10px] text-stone-500 italic leading-relaxed bg-stone-50 p-2.5 rounded-xl border border-stone-100 mt-1">
                          " {settlementData.cityMatch.comment} "
                        </p>
                      )}

                      <div className="pt-2 border-t border-stone-100">
                        <span className="text-[10px] text-amber-600 font-black block uppercase tracking-wider flex items-center gap-1">
                          <Target className="w-3.5 h-3.5" />
                          你今天可以在现实中去做的"无压力小行动"：
                        </span>
                        <p className="text-xs text-neutral-800 leading-relaxed font-semibold mt-1" id="settlement_mapping_action">
                          {(settlementData && settlementData.mapping?.actionItem) || (
                            activeTrial.id === "pm_shanghai" ? "用便利贴规划你一天时间表的三个黄金节点，强迫自己在15分钟摸鱼时间关闭所有电子通知。训练注意力的边界防御感。" :
                            activeTrial.id === "designer_hangzhou" ? "去家门外，至少拍摄三种完全不同叶片或陈旧砖缝的肌理作为PS参考，命名为'遗落在人间的像素色板阶'。" :
                            activeTrial.id === "ai_beijing" ? "翻看一个你熟知的高维常数或自然定义（比如黄金比例或圆周率），思考它如何在大模型生成框架里保持本源的美。" :
                            "去观察家附近的咖啡店，仔细坐在角落听一个小时的阿姨唠嗑或者是上班族的争论，并列出三个他们最常提及的无聊字眼。"
                          )}
                        </p>
                      </div>

                    </div>
                  </div>

                  {/* ===== 行业洞见卡片 ===== */}
                  <div className="bg-gradient-to-br from-indigo-50 to-violet-50 border border-indigo-100 rounded-3xl p-4 shadow-xs text-zinc-800">
                    <h4 className="text-xs font-black tracking-wider text-violet-700 mb-3 uppercase flex items-center gap-1.5 border-b border-indigo-100 pb-2">
                      <TrendingUp className="w-4 h-4 shrink-0 text-violet-500" />
                      行业洞见 Industry Insight
                    </h4>

                    <div className="space-y-3 text-xs">
                      {/* 行业名称 */}
                      <div className="flex items-center gap-2">
                        <span className="bg-violet-600 text-white text-[9px] font-black px-2.5 py-1 rounded-lg tracking-wider">
                          {settlementData?.mapping?.industryInsight?.name || activeTrial.career.split("(")[0].trim().replace(/[）)]/g, "")}
                        </span>
                      </div>

                      {/* 行业趋势 */}
                      <div className="bg-white/70 rounded-xl p-3 border border-indigo-100/50">
                        <span className="text-[10px] text-violet-400 font-extrabold block mb-1 uppercase tracking-wider">📈 行业趋势</span>
                        <p className="text-zinc-700 leading-relaxed font-semibold">
                          {(settlementData && settlementData.mapping?.marketVibe) || (
                            activeTrial.id === "pm_shanghai" ? "互联网迈向精细存量经营，跨团队沟通与体验能力已成为产品战略专家安身立命的不二外挂。" :
                            activeTrial.id === "designer_hangzhou" ? "AI绘画爆发让套件贬值，但拥有执着个人温度笔触的独立手艺IP，具有无价的商业感召力。" :
                            activeTrial.id === "ai_beijing" ? "AI极速演进，懂底层数学原理、对真实世界又饱有悲悯的极客最为稀缺。" :
                            "大众对机械性单一岗位的依赖性正在下降，具备跨界能力的人才享有极致的自由。"
                          )}
                        </p>
                      </div>

                      {/* 前景 + 热门技能 */}
                      <div className="grid grid-cols-2 gap-2.5">
                        <div className="bg-white/70 rounded-xl p-2.5 border border-indigo-100/50">
                          <span className="text-[10px] text-emerald-500 font-extrabold block mb-0.5 uppercase">🔮 行业前景</span>
                          <p className="text-zinc-700 font-bold text-[11px] leading-snug">
                            {settlementData?.mapping?.industryInsight?.outlook || "结构性分化，但好人才永远稀缺"}
                          </p>
                        </div>
                        <div className="bg-white/70 rounded-xl p-2.5 border border-indigo-100/50">
                          <span className="text-[10px] text-amber-500 font-extrabold block mb-0.5 uppercase">⚡ 当红技能</span>
                          <p className="text-zinc-700 font-bold text-[11px] leading-snug">
                            {settlementData?.mapping?.industryInsight?.hotSkill || "跨界整合 + AI协作"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 职业导航引导 */}
                  <Link to="/map" className="block mt-4">
                    <div className="bg-gradient-to-r from-indigo-500 to-violet-600 rounded-2xl p-4 text-white">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">🗺️</span>
                        <div className="flex-1">
                          <h4 className="text-sm font-black">探索你的职业方向</h4>
                          <p className="text-[10px] text-white/70">基于试玩结果，发现更多匹配的职业</p>
                        </div>
                        <ChevronRight className="w-5 h-5" />
                      </div>
                    </div>
                  </Link>

                  {/* ===== 现实职业路径选择 ===== */}
                  <div className="bg-white border border-stone-200 rounded-3xl p-4 shadow-xs text-zinc-800">
                    <h4 className="text-xs font-black tracking-wider text-emerald-600 mb-3 uppercase flex items-center gap-1.5 border-b border-stone-100 pb-2">
                      <Compass className="w-4 h-4 shrink-0 text-emerald-500" />
                      现实职业路径选择 Career Paths
                    </h4>

                    <div className="space-y-2.5">
                      {(settlementData?.mapping?.careerPaths && settlementData.mapping.careerPaths.length > 0) ? (
                        settlementData.mapping.careerPaths.map((path: any, idx: number) => (
                          <motion.div
                            key={idx}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="bg-gradient-to-r from-stone-50 to-white rounded-2xl p-3 border border-stone-100 hover:border-emerald-200 hover:shadow-xs transition-all duration-200"
                          >
                            <div className="flex items-start gap-2.5">
                              <span className="text-xl shrink-0 mt-0.5">{path.icon || "🎯"}</span>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between">
                                  <h5 className="font-black text-zinc-900 text-[13px]">{path.name}</h5>
                                  <div className="flex items-center gap-1 shrink-0 ml-2">
                                    <span className={`text-[9px] font-black px-1.5 py-0.5 rounded-md ${
                                      path.fitScore >= 85 ? 'bg-emerald-100 text-emerald-700' :
                                      path.fitScore >= 70 ? 'bg-amber-100 text-amber-700' :
                                      'bg-stone-100 text-stone-600'
                                    }`}>
                                      匹配 {path.fitScore}%
                                    </span>
                                  </div>
                                </div>
                                <p className="text-[10.5px] text-zinc-500 leading-relaxed mt-0.5">{path.description}</p>
                                <p className="text-[10px] text-emerald-600 font-extrabold mt-1">💳 {path.salary}</p>
                              </div>
                            </div>
                            {/* 匹配度进度条 */}
                            <div className="mt-2 ml-9">
                              <div className="h-1.5 bg-stone-100 rounded-full overflow-hidden">
                                <motion.div
                                  initial={{ width: 0 }}
                                  animate={{ width: `${path.fitScore}%` }}
                                  transition={{ delay: 0.3 + idx * 0.1, duration: 0.6, ease: "easeOut" }}
                                  className={`h-full rounded-full ${
                                    path.fitScore >= 85 ? 'bg-emerald-500' :
                                    path.fitScore >= 70 ? 'bg-amber-500' :
                                    'bg-stone-400'
                                  }`}
                                />
                              </div>
                            </div>
                          </motion.div>
                        ))
                      ) : (
                        /* 无 careerPaths 时的 fallback：从 career 字段解析 */
                        (settlementData?.mapping?.career || (
                          activeTrial.id === "pm_shanghai" ? "全栈产品体验顾问 / 商业策略分析师 / 敏捷教练" :
                          activeTrial.id === "designer_hangzhou" ? "独立插画师 / 视觉设计总监 / 跨界美学主理人" :
                          activeTrial.id === "ai_beijing" ? "AI算法架构师 / 技术布道师 / 科技创业合伙人" :
                          "生活方式策展人 / 创意全栈顾问 / 数字游民创业者"
                        )).split(" / ").map((career: string, idx: number) => (
                          <div
                            key={idx}
                            className="bg-gradient-to-r from-stone-50 to-white rounded-2xl p-3 border border-stone-100"
                          >
                            <div className="flex items-start gap-2.5">
                              <span className="text-xl shrink-0 mt-0.5">{["🎯", "🔍", "💡"][idx] || "✨"}</span>
                              <div className="flex-1 min-w-0">
                                <h5 className="font-black text-zinc-900 text-[13px]">{career.trim()}</h5>
                                <p className="text-[10px] text-emerald-600 font-extrabold mt-1">
                                  💳 {(settlementData && settlementData.mapping?.salaryExpectation) || "约 月薪 12k - 25k"}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  {/* ===== 职业维度对比图 ===== */}
                  <div className="bg-white border border-stone-200 rounded-3xl p-4 shadow-xs text-zinc-800">
                    <h4 className="text-xs font-black tracking-wider text-blue-600 mb-3 uppercase flex items-center gap-1.5 border-b border-stone-100 pb-2">
                      <BarChart3 className="w-4 h-4 shrink-0 text-blue-500" />
                      职业维度对比 Career Dimension
                    </h4>
                    <p className="text-[10px] text-zinc-400 font-bold mb-3">试玩职业 vs 现实映射的四大维度对比</p>

                    <div className="space-y-3">
                      {[
                        { label: "自由度", icon: "🦋", trialVal: activeTrial.freedom, mappedVal: settlementData?.mapping?.careerPaths?.[0]?.fitScore ? Math.round(activeTrial.freedom * 0.7 + settlementData.mapping.careerPaths[0].fitScore * 0.3) : Math.round(activeTrial.freedom * 0.85), color: "bg-sky-500", bgColor: "bg-sky-100" },
                        { label: "人脉圈", icon: "🤝", trialVal: activeTrial.connection, mappedVal: settlementData?.mapping?.careerPaths?.[0]?.fitScore ? Math.round(activeTrial.connection * 0.6 + settlementData.mapping.careerPaths[0].fitScore * 0.4) : Math.round(activeTrial.connection * 0.9), color: "bg-violet-500", bgColor: "bg-violet-100" },
                        { label: "财富力", icon: "💰", trialVal: activeTrial.wealth, mappedVal: settlementData?.mapping?.careerPaths?.[0]?.fitScore ? Math.round(activeTrial.wealth * 0.8 + settlementData.mapping.careerPaths[0].fitScore * 0.2) : Math.round(activeTrial.wealth * 0.85), color: "bg-amber-500", bgColor: "bg-amber-100" },
                        { label: "内心安", icon: "🧘", trialVal: activeTrial.peace, mappedVal: settlementData?.mapping?.careerPaths?.[0]?.fitScore ? Math.round(activeTrial.peace * 0.75 + settlementData.mapping.careerPaths[0].fitScore * 0.25) : Math.round(activeTrial.peace * 0.9), color: "bg-emerald-500", bgColor: "bg-emerald-100" },
                      ].map((dim, idx) => (
                        <div key={idx}>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-[10px] font-black text-zinc-600 flex items-center gap-1">
                              <span className="text-sm">{dim.icon}</span>
                              {dim.label}
                            </span>
                            <div className="flex items-center gap-2 text-[9px] font-bold">
                              <span className="text-zinc-400">试玩 {dim.trialVal}</span>
                              <span className="text-zinc-300">→</span>
                              <span className="text-blue-600">现实 {dim.mappedVal}</span>
                            </div>
                          </div>
                          {/* Double bar comparison */}
                          <div className="relative h-3 bg-stone-50 rounded-full overflow-hidden border border-stone-100">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${dim.trialVal}%` }}
                              transition={{ delay: 0.2 + idx * 0.08, duration: 0.5 }}
                              className="absolute top-0 left-0 h-1.5 bg-stone-300/60 rounded-full"
                            />
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${dim.mappedVal}%` }}
                              transition={{ delay: 0.3 + idx * 0.08, duration: 0.5 }}
                              className={`absolute bottom-0 left-0 h-1.5 ${dim.color} rounded-full`}
                            />
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center justify-center gap-4 mt-3 pt-2 border-t border-stone-100">
                      <span className="text-[9px] text-zinc-400 font-bold flex items-center gap-1">
                        <span className="w-3 h-1.5 bg-stone-300/60 rounded-full inline-block"></span>
                        试玩职业
                      </span>
                      <span className="text-[9px] text-blue-500 font-bold flex items-center gap-1">
                        <span className="w-3 h-1.5 bg-blue-500 rounded-full inline-block"></span>
                        现实映射
                      </span>
                    </div>

                    <p className="text-[10px] text-center text-zinc-400 mt-2 italic">
                      {(() => {
                        const trialSum = activeTrial.freedom + activeTrial.connection + activeTrial.wealth + activeTrial.peace;
                        const bestFit = settlementData?.mapping?.careerPaths?.[0]?.fitScore || 75;
                        const mappedSum = Math.round(activeTrial.freedom * 0.7 + bestFit * 0.3) +
                          Math.round(activeTrial.connection * 0.6 + bestFit * 0.4) +
                          Math.round(activeTrial.wealth * 0.8 + bestFit * 0.2) +
                          Math.round(activeTrial.peace * 0.75 + bestFit * 0.25);
                        return Math.abs(trialSum - mappedSum) > 15
                          ? "💡 试玩与现实的差距，正是你可以用行动去缩短的距离"
                          : "✨ 你的选择和现实高度契合，这条职业路径值得认真考虑";
                      })()}
                    </p>
                  </div>

                </div>

                {/* Footer Save / Archive Buttons */}
                <div className="pt-4 border-t border-stone-100 bg-white shrink-0">
                  <div className="flex gap-2.5">
                    <button
                      onClick={() => navigateTo("lobby")}
                      className="px-4 py-3 bg-stone-100 hover:bg-stone-200 border border-stone-200 text-zinc-700 font-extrabold text-xs rounded-2xl flex items-center justify-center gap-1.5 transition active:scale-95"
                      id="settlement_btn_back_lobby"
                    >
                      <Home className="w-4 h-4 text-zinc-600" />
                      <span>返回大厅</span>
                    </button>

                    <button
                      onClick={handleSaveResultToArchive}
                      className="flex-1 py-3 bg-zinc-900 hover:bg-zinc-800 text-white font-extrabold text-xs tracking-wider rounded-2xl flex items-center justify-center gap-1.5 transition active:scale-95 shadow-sm"
                      id="settlement_btn_archive"
                    >
                      <Bookmark className="w-4 h-4 text-amber-400" />
                      <span>收录至档案馆</span>
                    </button>

                    <button
                      onClick={() => handleLaunchTrial(activeTrial.id)}
                      className="p-3 bg-stone-100 hover:bg-stone-200 border border-stone-200 text-zinc-700 rounded-2xl flex items-center justify-center transition active:scale-95"
                      title="重玩一次"
                    >
                      <RefreshCw className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* MY ARCHIVE SCREEN (The past attempts logs) */}
            {currentScreen === "archive" && (
              <motion.div
                key="archive_screen"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 50 }}
                className="flex-1 flex flex-col"
                id="screen_archive"
              >
                {/* Header back */}
                <div className="px-5 pt-6 pb-2.5 shrink-0 flex justify-between items-center bg-white border-b border-stone-100 sticky top-0 z-20">
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => navigateTo("lobby")} 
                      className="p-1.5 hover:bg-stone-100 text-zinc-700 rounded-full transition active:scale-95 border border-stone-200"
                    >
                      <ArrowLeft className="w-4 h-4" />
                    </button>
                    <span className="text-sm font-black text-neutral-800">人生档案馆</span>
                  </div>

                  {savedRecords.length > 0 && (
                    <button 
                      onClick={handleWipeArchive}
                      className="text-[10px] bg-rose-50 text-rose-500 font-bold px-2.5 py-1 rounded-full border border-rose-100 transition hover:bg-rose-100"
                    >
                      清空存储
                    </button>
                  )}
                </div>

                {/* Archives catalog list */}
                <div className="flex-1 p-5 overflow-y-auto space-y-4">
                  {savedRecords.length === 0 ? (
                    <div className="text-center py-20 space-y-3">
                      <span className="text-5xl select-none filter opacity-30">📂</span>
                      <h4 className="text-sm font-extrabold text-zinc-400">档案馆还没有收录人生卷轴</h4>
                      <p className="text-[10px] text-zinc-400 max-w-[200px] mx-auto leading-normal">
                        快挑选一门热门的城市生活副本，去体验一天的酸甜苦辣，并生成你的智能报告吧！
                      </p>
                      <button 
                        onClick={() => navigateTo("lobby")} 
                        className="mt-3 text-xs bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-4 py-2 rounded-xl transition shadow-xs active:scale-95"
                      >
                        去挑选体验
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3" id="archive_list">
                      <p className="text-[10px] font-extrabold text-zinc-400 pl-1 uppercase tracking-wider">📜 历次模拟的人生卷轴（{savedRecords.length} 项）</p>
                      {savedRecords.map((rec) => (
                        <div 
                          key={rec.id}
                          onClick={() => {
                            setSelectedArchiveDetail(rec);
                          }}
                          className="bg-white border border-stone-200/80 rounded-2xl p-4 cursor-pointer hover:shadow-xs transition duration-200 relative overflow-hidden flex flex-col justify-between"
                        >
                          {/* Inner gradient line */}
                          <div className="absolute top-0 inset-x-0 h-1 bg-stone-300"></div>
                          
                          <div className="flex justify-between items-start text-[10px] font-bold text-zinc-500">
                            <span>{rec.date} 卷轴</span>
                            <span className="bg-stone-100 text-zinc-700 px-2 py-0.5 rounded-full">{rec.city.split(" ")[0]}</span>
                          </div>

                          <h3 className="text-sm font-bold text-neutral-900 leading-snug mt-1.5">{rec.careerTitle}</h3>
                          <p className="text-[10.5px] text-zinc-400 font-medium line-clamp-1 mt-0.5">{rec.trialTitle}</p>
                          
                          <div className="mt-3.5 pt-2.5 border-t border-stone-100 flex items-center justify-between text-[10px] text-zinc-650 font-bold">
                            <span className="text-indigo-650">点击查阅详细属性 &gt;</span>
                            <div className="flex gap-1.5 font-mono">
                              <span>😊 {rec.stats.happiness}</span>
                              <span>📈 {rec.stats.growth}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Absolute Slide-over details drawer for selected archive */}
                <AnimatePresence>
                  {selectedArchiveDetail && (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 bg-black/60 backdrop-blur-xs z-50 flex flex-col justify-end"
                      onClick={() => setSelectedArchiveDetail(null)}
                    >
                      <motion.div 
                        initial={{ y: 200 }}
                        animate={{ y: 0 }}
                        exit={{ y: 200 }}
                        className="bg-white rounded-t-[32px] p-5 max-h-[85%] overflow-y-auto flex flex-col gap-4"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {/* Drag indicator bar */}
                        <div className="w-10 h-1 bg-stone-300 rounded-full mx-auto shrink-0 mb-1"></div>
                        
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="text-[10px] bg-stone-100 text-stone-600 rounded-full px-2 py-0.5 font-bold">
                              {selectedArchiveDetail.date} 试玩卷轴
                            </span>
                            <h3 className="text-base font-extrabold text-zinc-950 mt-1">{selectedArchiveDetail.careerTitle}</h3>
                            <p className="text-xs text-zinc-400 font-semibold">{selectedArchiveDetail.trialTitle}</p>
                          </div>
                          
                          <button 
                            onClick={() => setSelectedArchiveDetail(null)}
                            className="text-xs p-1 bg-stone-100 text-stone-600 rounded-full "
                          >
                            ✕
                          </button>
                        </div>

                        {/* Attribute gauges inside Detail Popup */}
                        <div className="grid grid-cols-4 gap-1.5 text-center bg-stone-50 p-2.5 rounded-2xl border border-stone-100 mt-1 font-semibold">
                          <div>
                            <p className="text-[9px] text-stone-400 font-extrabold">😊 快乐</p>
                            <p className="text-xs font-black text-rose-500">{selectedArchiveDetail.stats.happiness}</p>
                          </div>
                          <div>
                            <p className="text-[9px] text-stone-400 font-extrabold">❤️ 健康</p>
                            <p className="text-xs font-black text-emerald-500">{selectedArchiveDetail.stats.health}</p>
                          </div>
                          <div>
                            <p className="text-[9px] text-stone-400 font-extrabold">⚡ 压力</p>
                            <p className="text-xs font-black text-indigo-500">{selectedArchiveDetail.stats.stress}</p>
                          </div>
                          <div>
                            <p className="text-[9px] text-stone-400 font-extrabold">📈 成长</p>
                            <p className="text-xs font-black text-amber-500">{selectedArchiveDetail.stats.growth}</p>
                          </div>
                        </div>

                        <div className="space-y-3.5 text-xs">
                          <div>
                            <span className="text-[10.5px] text-indigo-600 font-black tracking-wider block uppercase">灵魂共鸣分析 Resonance</span>
                            <p className="text-stone-700 leading-relaxed font-semibold mt-1">
                              {selectedArchiveDetail.resonance}
                            </p>
                          </div>

                          <div className="p-3 bg-stone-50 rounded-2xl border border-stone-100 space-y-2">
                            <span className="text-[10.5px] text-zinc-400 font-extrabold tracking-wider block">映射职业 / 薪资待遇 / 行动建议</span>
                            <p className="font-extrabold text-neutral-800">🛠️ Mapped: {selectedArchiveDetail.mappedCareer}</p>
                            <p className="text-neutral-700">💳 Line: {selectedArchiveDetail.salaryExpectation}</p>
                            <p className="text-neutral-700 leading-relaxed italic border-t border-stone-200/60 pt-1.5 mt-1">
                              👉 Action: {selectedArchiveDetail.actionItem}
                            </p>
                          </div>
                        </div>

                        <button 
                          onClick={() => {
                            setSelectedArchiveDetail(null);
                            handleLaunchTrial(selectedArchiveDetail.trialId);
                          }}
                          className="w-full py-3 bg-zinc-950 hover:bg-zinc-800 text-white font-black text-xs rounded-2xl transition active:scale-95 text-center mt-2 shrink-0"
                        >
                          重新试玩一次
                        </button>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}

          </AnimatePresence>

          {/* Custom Confirmation Modal style */}
          <AnimatePresence>
            {confirmModal?.isOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-5"
                onClick={() => setConfirmModal(null)}
              >
                <motion.div
                  initial={{ scale: 0.9, y: 20 }}
                  animate={{ scale: 1, y: 0 }}
                  exit={{ scale: 0.9, y: 20 }}
                  className="bg-white dark:bg-zinc-900 rounded-3xl p-6 max-w-xs w-full shadow-2xl border border-stone-200/50 text-center"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="w-12 h-12 bg-amber-50 dark:bg-amber-950/40 rounded-full flex items-center justify-center mx-auto mb-4">
                    <AlertCircle className="w-6 h-6 text-amber-500" />
                  </div>
                  <h3 className="text-sm font-black text-zinc-900 dark:text-zinc-50 leading-snug">
                    {confirmModal.title}
                  </h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-2 leading-relaxed font-semibold">
                    {confirmModal.description}
                  </p>
                  <div className="flex gap-3 mt-6">
                    <button
                      onClick={() => setConfirmModal(null)}
                      className="flex-1 py-2.5 bg-stone-100 hover:bg-stone-200 text-zinc-700 font-bold text-xs rounded-xl active:scale-95 transition"
                    >
                      取消
                    </button>
                    <button
                      onClick={confirmModal.onConfirm}
                      className="flex-1 py-2.5 bg-zinc-900 hover:bg-zinc-800 text-white font-extrabold text-xs rounded-xl active:scale-95 transition"
                    >
                      确定
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>

      </div>

    </div>
  );
}
