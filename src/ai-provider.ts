/**
 * AI Provider 抽象层
 * 支持 Gemini / OpenAI 多模型切换
 * 通过环境变量 AI_PROVIDER 选择: "gemini" | "openai"
 * 
 * Gemini 使用 REST API (fetch)，无需 @google/genai SDK
 * OpenAI 使用 REST API (fetch)，无需 openai SDK
 */

export interface CareerPath {
  name: string;
  fitScore: number; // 0-100 适合度
  description: string; // 一句话描述
  salary: string; // 薪资范围
  icon: string; // emoji
}

export interface IndustryInsight {
  name: string;        // 行业名称
  trend: string;       // 趋势描述
  outlook: string;     // 前景判断
  hotSkill: string;    // 热门技能
}

export interface CareerMappingResult {
  title: string;
  resonance: string;
  cityMatch: {
    score: number;
    comment: string;
  };
  mapping: {
    career: string;
    marketVibe: string;
    salaryExpectation: string;
    actionItem: string;
    careerPaths?: CareerPath[];     // 多条职业路径选择
    industryInsight?: IndustryInsight; // 行业洞见
  };
}

export interface AIProvider {
  name: string;
  generateCareerMapping(params: CareerMappingParams): Promise<CareerMappingResult>;
  generateReport(params: GenerateReportParams): Promise<ReportResult>;
}

export interface CareerMappingParams {
  trialId: string;
  trialTitle: string;
  choicesSummary: string;
  reflection: string;
  finalStats: {
    happiness: number;
    health: number;
    stress: number;
    growth: number;
  };
}

// =============================================
// Report Generation Types
// =============================================
export interface DimensionAnalysis {
  score: number;
  analysis: string;
}

export interface RecommendedJob {
  name: string;
  matchScore: number;
  reason: string;
  salary: string;
}

export interface ActionItem {
  text: string;
  timeline: string;
  category: string;
}

export interface ReportResult {
  userSummary: string;
  dimensionAnalysis: {
    freedom: DimensionAnalysis;
    connection: DimensionAnalysis;
    wealth: DimensionAnalysis;
    peace: DimensionAnalysis;
  };
  recommendedJobs: RecommendedJob[];
  actionItems: ActionItem[];
  overallAdvice: string;
}

export interface GenerateReportParams {
  profile: {
    school?: string;
    major?: string;
    cityPreference?: string;
    dimensionWeights?: {
      freedom?: number;
      connection?: number;
      wealth?: number;
      peace?: number;
    };
  };
  trialResults: Array<{
    trialId: string;
    trialTitle: string;
    finalStats: {
      freedom?: number;
      connection?: number;
      wealth?: number;
      peace?: number;
      happiness?: number;
      health?: number;
      stress?: number;
      growth?: number;
    };
    reflection?: string;
  }>;
  favoriteJobs: string[];
}

// =============================================
// Gemini Provider (REST API via fetch)
// =============================================
class GeminiProvider implements AIProvider {
  name = "gemini";
  private apiKey: string;

  constructor() {
    this.apiKey = process.env.GEMINI_API_KEY || "";
    if (this.apiKey && this.apiKey !== "MY_GEMINI_API_KEY" && this.apiKey !== "") {
      console.log("[AI] Gemini provider configured (REST API).");
    } else {
      console.log("[AI] No valid GEMINI_API_KEY. Will use fallback responses.");
    }
  }

  async generateCareerMapping(params: CareerMappingParams): Promise<CareerMappingResult> {
    if (!this.apiKey || this.apiKey === "MY_GEMINI_API_KEY") {
      throw new Error("Gemini API key not configured");
    }

    const prompt = buildPrompt(params);

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${this.apiKey}`;

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          responseMimeType: "application/json",
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Gemini API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
      throw new Error("Empty response from Gemini");
    }

    return parseAIResponse(text);
  }

  async generateReport(params: GenerateReportParams): Promise<ReportResult> {
    if (!this.apiKey || this.apiKey === "MY_GEMINI_API_KEY") {
      throw new Error("Gemini API key not configured");
    }

    const prompt = buildReportPrompt(params);

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${this.apiKey}`;

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          responseMimeType: "application/json",
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Gemini API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
      throw new Error("Empty response from Gemini");
    }

    return parseReportResponse(text);
  }
}
// =============================================
class OpenAIProvider implements AIProvider {
  name = "openai";
  private apiKey: string;

  constructor() {
    this.apiKey = process.env.OPENAI_API_KEY || "";
    if (this.apiKey && this.apiKey !== "MY_OPENAI_API_KEY" && this.apiKey !== "") {
      console.log("[AI] OpenAI provider configured.");
    } else {
      console.log("[AI] No valid OPENAI_API_KEY. Will use fallback responses.");
    }
  }

  async generateCareerMapping(params: CareerMappingParams): Promise<CareerMappingResult> {
    if (!this.apiKey || this.apiKey === "MY_OPENAI_API_KEY") {
      throw new Error("OpenAI API key not configured");
    }

    const prompt = buildPrompt(params);

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content:
              "你是一名顶级的人生职业咨询师与成长治愈系导师。请严格按照用户要求的JSON格式返回结果，不要带任何Markdown标记。",
          },
          { role: "user", content: prompt },
        ],
        response_format: { type: "json_object" },
        temperature: 0.8,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`OpenAI API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    const text = data.choices?.[0]?.message?.content;

    if (!text) {
      throw new Error("Empty response from OpenAI");
    }

    return parseAIResponse(text);
  }

  async generateReport(params: GenerateReportParams): Promise<ReportResult> {
    if (!this.apiKey || this.apiKey === "MY_OPENAI_API_KEY") {
      throw new Error("OpenAI API key not configured");
    }

    const prompt = buildReportPrompt(params);

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content:
              "你是一名顶级的人生职业咨询师与成长治愈系导师。请严格按照用户要求的JSON格式返回结果，不要带任何Markdown标记。",
          },
          { role: "user", content: prompt },
        ],
        response_format: { type: "json_object" },
        temperature: 0.8,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`OpenAI API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    const text = data.choices?.[0]?.message?.content;

    if (!text) {
      throw new Error("Empty response from OpenAI");
    }

    return parseReportResponse(text);
  }
}
// =============================================
function buildPrompt(params: CareerMappingParams): string {
  return `
你是一名顶级的人生职业咨询师与成长治愈系导师。用户在我们的沉浸式人生模拟游戏《人生试玩店》（Life Trial）中试玩了人生副本。

【副本基本信息】
- 副本名称：${params.trialTitle}
- 城市与职业：${params.trialId}
- 用户主观偏好反射："${params.reflection || "未填写"}"
- 体验中的决策流：
${params.choicesSummary}
- 体验结算数值：
  1. 快乐/幸福度 (Happiness): ${params.finalStats.happiness}/100
  2. 身体跟心理健康 (Health): ${params.finalStats.health}/100
  3. 精神压力负荷 (Stress): ${params.finalStats.stress}/100
  4. 职业成长及积累 (Career Growth): ${params.finalStats.growth}/100

根据以上数据，生成一份极具情感温度、治愈而实用的《人生映射结案报告》。
你必须遵循【人生试玩店】的年轻化、轻游戏、Netflix/Duolingo/Forest式温暖风格。切记绝无官腔、大厂黑话或冷冰冰的教条！字词要像和老朋友聊天，充满生活细节与奇妙想象。

返回一个精确的 JSON 格式响应（不要带任何 Markdown \`\`\`json 标记，直接返回 JSON 串即可）。
JSON 结构如下：
{
  "title": "符合用户试玩路线特质的极其好玩的'人生试玩称号'（字数在15字以内，需体现职业与特制印记，例如：'西湖边野生像素牧羊人'、'下午茶续命的方案精算师'）",
  "resonance": "【灵魂共鸣分析】150字以内的段落，用温暖、治愈、极其敏锐的言语描写出选择背后的偏好本质。别聊MBTI，而是讲他们对世界的热忱、对自我的保护，以及他们在这个职业中闪光或挣扎的真正症结",
  "cityMatch": {
    "score": 85,
    "comment": "100字以内的极简评点：他们的生活哲学在这个试玩城市是否契合？给出有温度的建议"
  },
  "mapping": {
    "career": "映射出的 2-3 个好玩的现实对应职业（用' / '分隔）",
    "marketVibe": "100字以内。真实社会的行业氛围和当前变化趋势的柔性点拨。要讲实话，但要以鼓励、富有前瞻的方式表达",
    "salaryExpectation": "大致的真实待遇预期（如：'实习期 150-250/天，成熟期 15-28k/月'）",
    "actionItem": "120字以内。一个用户今天就可以在日常中去做的、极具体验感的可行小行动（不要给重度任务如写简历、刷题。给游戏化行为）",
    "careerPaths": [
      { "name": "职业名A", "fitScore": 85, "description": "一句话描述这个职业的日常和适合人群", "salary": "8k-15k/月", "icon": "📊" },
      { "name": "职业名B", "fitScore": 72, "description": "一句话描述", "salary": "12k-25k/月", "icon": "🎨" },
      { "name": "职业名C", "fitScore": 65, "description": "一句话描述", "salary": "6k-12k/月", "icon": "💡" }
    ],
    "industryInsight": {
      "name": "所属行业名称（如：互联网/金融/文创/医疗等）",
      "trend": "60字以内的行业当前趋势点拨",
      "outlook": "40字以内的行业前景判断（看涨/震荡/结构性调整等）",
      "hotSkill": "该行业当前最吃香的1-2个核心技能"
    }
  }
}
`;
}

// =============================================
// Response Parser
// =============================================
function parseAIResponse(text: string): CareerMappingResult {
  const cleanedText = text.trim();
  const parsed = JSON.parse(cleanedText);

  return {
    title: parsed.title || "城市自洽探索家",
    resonance: parsed.resonance || "",
    cityMatch: {
      score: Number(parsed.cityMatch?.score) || 80,
      comment: parsed.cityMatch?.comment || "",
    },
    mapping: {
      career: parsed.mapping?.career || "",
      marketVibe: parsed.mapping?.marketVibe || "",
      salaryExpectation: parsed.mapping?.salaryExpectation || "",
      actionItem: parsed.mapping?.actionItem || "",
      careerPaths: Array.isArray(parsed.mapping?.careerPaths) ? parsed.mapping.careerPaths : undefined,
      industryInsight: parsed.mapping?.industryInsight || undefined,
    },
  };
}

// =============================================
// Report Prompt Builder
// =============================================
function buildReportPrompt(params: GenerateReportParams): string {
  const { profile, trialResults, favoriteJobs } = params;

  const profileSection = `
【用户档案】
- 学校：${profile.school || "未填写"}
- 专业：${profile.major || "未填写"}
- 城市偏好：${profile.cityPreference || "未填写"}
- 维度权重：自由 ${profile.dimensionWeights?.freedom ?? 50}、连接 ${profile.dimensionWeights?.connection ?? 50}、财富 ${profile.dimensionWeights?.wealth ?? 50}、平和 ${profile.dimensionWeights?.peace ?? 50}`;

  const trialsSection = trialResults.length > 0
    ? trialResults.map((t, i) => `
【试玩 ${i + 1}】${t.trialTitle} (${t.trialId})
- 结算数值：自由 ${t.finalStats.freedom ?? t.finalStats.happiness ?? 50}、连接 ${t.finalStats.connection ?? 50}、财富 ${t.finalStats.wealth ?? t.finalStats.growth ?? 50}、平和 ${t.finalStats.peace ?? t.finalStats.health ?? 50}
- 用户感受："${t.reflection || "未填写"}"`).join("\n")
    : "（暂无试玩记录）";

  const favJobsSection = favoriteJobs.length > 0
    ? favoriteJobs.map((j, i) => `${i + 1}. ${j}`).join("\n")
    : "（暂无收藏岗位）";

  return `
你是一名顶级的人生职业咨询师与成长治愈系导师。用户在我们的沉浸式人生模拟游戏《人生试玩店》中完成了多次人生试玩，现在需要生成一份综合职业决策报告。

${profileSection}

【试玩结果】
${trialsSection}

【收藏的岗位】
${favJobsSection}

根据以上所有数据，生成一份极具情感温度、治愈而实用的《职业决策报告》。
你必须遵循【人生试玩店】的年轻化、轻游戏、Netflix/Duolingo/Forest式温暖风格。切记绝无官腔、大厂黑话或冷冰冰的教条！字词要像和老朋友聊天，充满生活细节与奇妙想象。

返回一个精确的 JSON 格式响应（不要带任何 Markdown \`\`\`json 标记，直接返回 JSON 串即可）。
JSON 结构如下：
{
  "userSummary": "基于用户档案和试玩行为的画像分析，150字以内，温暖有洞察",
  "dimensionAnalysis": {
    "freedom": { "score": 75, "analysis": "你对自由的追求分析，60字以内" },
    "connection": { "score": 70, "analysis": "你对人际连接的需求分析，60字以内" },
    "wealth": { "score": 65, "analysis": "你对物质财富的态度分析，60字以内" },
    "peace": { "score": 80, "analysis": "你对内心平和的看重程度分析，60字以内" }
  },
  "recommendedJobs": [
    { "name": "产品经理", "matchScore": 92, "reason": "推荐理由，80字以内", "salary": "15k-35k" },
    { "name": "第二个推荐职业", "matchScore": 85, "reason": "推荐理由", "salary": "薪资范围" },
    { "name": "第三个推荐职业", "matchScore": 78, "reason": "推荐理由", "salary": "薪资范围" }
  ],
  "actionItems": [
    { "text": "一个今天就可以做的小行动，游戏化、有体验感", "timeline": "今天", "category": "explore" },
    { "text": "本周可以尝试的探索行动", "timeline": "本周", "category": "learn" },
    { "text": "本月可以推进的实践行动", "timeline": "本月", "category": "practice" }
  ],
  "overallAdvice": "综合职业建议，150字以内，温暖治愈且有实操性"
}

注意：
- dimensionAnalysis 的 score 必须是 0-100 的整数，基于用户的维度权重和试玩结果综合计算
- recommendedJobs 至少 3 个，matchScore 是 0-100 的整数
- actionItems 的 category 只能是 "explore"（探索）、"learn"（学习）、"practice"（实践）之一
- 如果用户收藏了岗位，推荐职业要优先参考收藏岗位的方向
`;
}

// =============================================
// Report Response Parser
// =============================================
function parseReportResponse(text: string): ReportResult {
  const cleanedText = text.trim();
  const parsed = JSON.parse(cleanedText);

  const parseDimension = (d: any): DimensionAnalysis => ({
    score: Number(d?.score) || 50,
    analysis: d?.analysis || "",
  });

  return {
    userSummary: parsed.userSummary || "",
    dimensionAnalysis: {
      freedom: parseDimension(parsed.dimensionAnalysis?.freedom),
      connection: parseDimension(parsed.dimensionAnalysis?.connection),
      wealth: parseDimension(parsed.dimensionAnalysis?.wealth),
      peace: parseDimension(parsed.dimensionAnalysis?.peace),
    },
    recommendedJobs: Array.isArray(parsed.recommendedJobs)
      ? parsed.recommendedJobs.map((j: any) => ({
          name: j.name || "",
          matchScore: Number(j.matchScore) || 50,
          reason: j.reason || "",
          salary: j.salary || "",
        }))
      : [],
    actionItems: Array.isArray(parsed.actionItems)
      ? parsed.actionItems.map((a: any) => ({
          text: a.text || "",
          timeline: a.timeline || "",
          category: a.category || "explore",
        }))
      : [],
    overallAdvice: parsed.overallAdvice || "",
  };
}

// =============================================
// Provider Factory
// =============================================
let _provider: AIProvider | null = null;

export function getAIProvider(): AIProvider {
  if (_provider) return _provider;

  const providerName = (process.env.AI_PROVIDER || "gemini").toLowerCase().trim();

  switch (providerName) {
    case "openai":
      _provider = new OpenAIProvider();
      break;
    case "gemini":
    default:
      _provider = new GeminiProvider();
      break;
  }

  console.log(`[AI] Active provider: ${_provider.name}`);
  return _provider;
}

export { GeminiProvider, OpenAIProvider };
